// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { Alert, Platform } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/constants';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Request permission for push notifications
  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    }
  };

  // Register device with FCM
  const registerDevice = async () => {
    try {
      const token = await messaging().getToken();
      
      // Save token to backend
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        await axios.post(
          `${API_URL}/profile/fcm-token`,
          { fcmToken: token },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      }
      console.log('FCM Token:', token);
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };

  // Display a local notification using Notifee
  const displayNotification = async (title, body, data) => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display notification
    await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // your app's icon name
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (!authToken) return;
      
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      setNotifications(response.data);
      const unread = response.data.filter(notif => !notif.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return;
      
      await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      // Update local state
      setNotifications(prevNotifications => {
        return prevNotifications.map(notif => {
          if (notif._id === notificationId) {
            return { ...notif, read: true };
          }
          return notif;
        });
      });
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return;
      
      await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      // Update local state
      setNotifications(prevNotifications => {
        return prevNotifications.map(notif => ({ ...notif, read: true }));
      });
      
      // Update unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Handle refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Setup notification listeners
  useEffect(() => {
    requestUserPermission();
    registerDevice();
    fetchNotifications();

    // Foreground message handler
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      
      const { notification, data } = remoteMessage;
      
      if (notification) {
        displayNotification(
          notification.title,
          notification.body,
          data
        );
        
        // Refresh notifications list
        fetchNotifications();
      }
    });

    // Background/quit state handler
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background state:', remoteMessage);
      // Handle navigation based on notification type
      if (remoteMessage.data && remoteMessage.data.jobId) {
        // Navigate to job details page
      }
    });

    // Check if app was opened from a notification when in quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened app from quit state:', remoteMessage);
          // Handle navigation based on notification type
        }
      });

    // Handle notification press action
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === notifee.ForegroundEventType.PRESS) {
        console.log('User pressed notification', detail.notification);
        // Handle navigation based on notification data
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === notifee.BackgroundEventType.PRESS) {
        console.log('User pressed notification from background', detail.notification);
      }
    });

    // Cleanup
    return () => {
      unsubscribeForeground();
    };
  }, [fetchNotifications]);

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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};