import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';
import axios from 'axios';
import { API_URL } from '../config/constants';

class NotificationService {
  async getToken() {
    try {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      
      if (!fcmToken) {
        fcmToken = await messaging().getToken();
        
        if (fcmToken) {
          console.log('New FCM Token:', fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      }
      
      return fcmToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  async registerTokenWithServer(fcmToken) {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (!authToken || !fcmToken) return false;
      
      await axios.post(
        `${API_URL}/profile/fcm-token`,
        { fcmToken },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error registering token with server:', error);
      return false;
    }
  }

  async setupAndroidChannel() {
    // Create notification channels for Android
    await notifee.createChannel({
      id: 'job_alerts',
      name: 'Job Alerts',
      description: 'Notifications for new job opportunities',
      importance: 4, // High importance for job notifications
      vibration: true,
      sound: 'default',
    });

    await notifee.createChannel({
      id: 'general',
      name: 'General',
      description: 'General app notifications',
      importance: 3, // Default importance
    });

    console.log('Android notification channels created');
  }

  async displayLocalNotification(title, body, data = {}) {
    // Determine channel based on notification type
    const channelId = data.type === 'JOB_POSTED' ? 'job_alerts' : 'general';

    // Display notification
    await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId,
        smallIcon: 'ic_notification', // Make sure this exists in your drawable folder
        largeIcon: data.largeIcon || undefined,
        color: '#623AA2', // Brand color for notification
        pressAction: {
          id: 'default',
        },
        actions: this.getAndroidActions(data),
      },
    });
  }

  async requestPermission() {
    try {
    
      const authStatus = await messaging().hasPermission();
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
      if (enabled) {
        console.log('Notification permission granted.');
        return true;
      }
      
      // If not enabled, we can request it (usually only needed for special features)
      const requestStatus = await messaging().requestPermission();
      return requestStatus === messaging.AuthorizationStatus.AUTHORIZED || 
             requestStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } catch (error) {
      console.error('Permission request error:', error);
      // Return true anyway since Android typically doesn't block notifications
      return true;
    }
  }

  // Add quick actions to notifications based on type
  getAndroidActions(data) {
    if (data.type === 'JOB_POSTED') {
      return [
        {
          title: 'View Job',
          pressAction: {
            id: 'view_job',
          },
        },
        {
          title: 'Save',
          pressAction: {
            id: 'save_job',
          },
        },
      ];
    }
    return [];
  }

  setupMessageHandlers(onNotificationReceived) {
    // Set up the notification channel first
    this.setupAndroidChannel();

    // Foreground handler
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      
      if (remoteMessage.notification) {
        this.displayLocalNotification(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
          remoteMessage.data
        );
        
        if (onNotificationReceived) {
          onNotificationReceived(remoteMessage);
        }
      }
    });

    // Background handler - no need to display notifications manually
    // as Android does this automatically for background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification:', remoteMessage);
      return Promise.resolve();
    });

    // Background notification tap handler
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background notification:', remoteMessage);
    });

    // App closed notification tap handler
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from quit state notification:', remoteMessage);
      }
    });

    // Handle notification actions
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === notifee.BackgroundEventType.PRESS) {
        console.log('User pressed notification from background', detail.notification);
      } else if (type === notifee.BackgroundEventType.ACTION_PRESS) {
        const { pressAction } = detail;
        
        // Handle custom actions
        if (pressAction.id === 'view_job' && detail.notification) {
          // This would need to work with your navigation
          // You might want to store this action and handle it when the app opens
          console.log('View job action pressed', detail.notification.data);
        } else if (pressAction.id === 'save_job' && detail.notification) {
          // Save job in background
          console.log('Save job action pressed', detail.notification.data);
          // You could call an API here to save the job
        }
      }
    });

    // Handle foreground events
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === notifee.ForegroundEventType.PRESS) {
        console.log('User pressed notification', detail.notification);
      } else if (type === notifee.ForegroundEventType.ACTION_PRESS) {
        const { pressAction } = detail;
        
        if (pressAction.id === 'view_job' && detail.notification) {
          console.log('View job action pressed', detail.notification.data);
          // You would need to use a navigation ref to navigate here
        } else if (pressAction.id === 'save_job' && detail.notification) {
          console.log('Save job action pressed', detail.notification.data);
          // Save job logic
        }
      }
    });

    return unsubscribeForeground;
  }

  // Navigate based on notification
  handleNotificationNavigation(notification, navigation) {
    if (!notification) return;
    
    // Handle different notification types
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
      case 'APPLICATION_STATUS':
        navigation.navigate('UserProfile', { tab: 'applications' });
        break;
      case 'NEW_MESSAGE':
        navigation.navigate('Messages');
        break;
      default:
        // Default navigation or do nothing
        break;
    }
  }
}

export default new NotificationService();