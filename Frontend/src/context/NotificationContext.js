import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchNotifications = useCallback(async (showLoading = true) => {
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
        timeout: 10000, 
      });
      
      setNotifications(response.data);
      const unread = response.data.filter(notif => !notif.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);

    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Mark notification as read
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
        handleNotificationNavigation: notificationService.handleNotificationNavigation,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default { NotificationProvider, useNotifications };