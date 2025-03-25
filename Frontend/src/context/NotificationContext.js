import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../services/notificationService';
import NetworkService from '../services/NetworkService';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
  
    NetworkService.checkConnection().then(connected => {
      setIsConnected(connected);
    });
    
    const unsubscribe = NetworkService.addListener((connected) => {
      setIsConnected(connected);
      
      if (connected && lastFetchTime) {
        const timeSinceLastFetch = Date.now() - lastFetchTime;

        if (timeSinceLastFetch > 60000) {
          fetchNotifications(false);
        }
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [lastFetchTime]);

  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (!isConnected) {
      console.log('Skipping notification fetch - device is offline');
      setRefreshing(false);
      return;
    }
    
    try {
      if (showLoading) setLoading(true);
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (!authToken) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        timeout: 15000, 
      });
      
      setLastFetchTime(Date.now());
      
      if (response && response.data) {
        setNotifications(response.data);
        const unread = response.data.filter(notif => !notif.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      if (showLoading && !refreshing) {
        if (error.message && error.message.includes('Network Error')) {
          console.log('Network error when fetching notifications');
        } else if (error.response && error.response.status === 401) {
          console.log('Authentication token may be expired');
        }
      }
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  }, [isConnected]);

  const markAsRead = async (notificationId) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return;
      
      setNotifications(prevNotifications => {
        return prevNotifications.map(notif => {
          if (notif._id === notificationId && !notif.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
            return { ...notif, read: true };
          }
          return notif;
        });
      });
      
      await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      fetchNotifications(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return;
      
      setNotifications(prevNotifications => {
        return prevNotifications.map(notif => ({ ...notif, read: true }));
      });
      setUnreadCount(0);
      
      await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      fetchNotifications(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(false);
  };

  const handleNotificationNavigation = (notification, navigation) => {
    if (!notification) return;
    
    switch(notification.type) {
      case 'JOB_POSTED':
        if (notification.relatedJob && notification.relatedJob._id) {
          navigation.navigate('JobSingle', { 
            jobId: notification.relatedJob._id,
            companyInfo: {
              name: notification.relatedJob.employerName || 'Company',
              location: notification.relatedJob.location || 'Unknown Location',
            }
          });
        }
        break;
      case 'JOB_APPLICATION':
        navigation.navigate('JobApplicationDetails', { 
          notificationId: notification._id,
          applicantData: notification.data 
        });
        break;
      case 'APPLICATION_STATUS':
        navigation.navigate('UserProfile', { tab: 'applications' });
        break;
      case 'NEW_MESSAGE':
        navigation.navigate('Messages');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const initializeNotifications = async () => {
      if (isInitialized) return;
      
      try {
        const hasPermission = await notificationService.requestPermission();
        if (!hasPermission) {
          console.log('Notification permission denied');
          return;
        }
        
        const token = await notificationService.getToken();
        if (token) {
          await notificationService.registerTokenWithServer(token);
        }
        
        const unsubscribe = notificationService.setupMessageHandlers(() => {  
          fetchNotifications(false);
        });
        
        fetchNotifications();
        
        setIsInitialized(true);
        
        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };
    
    initializeNotifications();
  }, [fetchNotifications, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    
    const intervalId = setInterval(() => {
      fetchNotifications(false);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchNotifications, isInitialized]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshing,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        handleRefresh,
        handleNotificationNavigation,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default { NotificationProvider, useNotifications };