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
      
      if (!authToken || !fcmToken) {
        console.log('Missing auth token or FCM token');
        return false;
      }

      const isConnected = await this.checkNetworkConnection();
      if (!isConnected) {
        console.log('No network connection available');
        return false;
      }
      
      await axios.post(
        `${API_URL}/profile/fcm-token`,
        { fcmToken },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          timeout: 10000 
        }
      );
      
      return true;
    } catch (error) {
      console.log('Error registering token with server:');
      console.log(error.message || 'Unknown error');
      await AsyncStorage.setItem('pendingFcmRegistration', fcmToken);
      return false;
    }
  }
  
  async checkNetworkConnection() {
    try {
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async setupAndroidChannel() {
    await notifee.createChannel({
      id: 'job_alerts',
      name: 'Job Alerts',
      description: 'Notifications for new job opportunities',
      importance: 4, 
      vibration: true,
      sound: 'default',
    });

    await notifee.createChannel({
      id: 'general',
      name: 'General',
      description: 'General app notifications',
      importance: 3, 
    });

    console.log('Android notification channels created');
  }

  async displayLocalNotification(title, body, data = {}) {
    const channelId = data.type === 'JOB_POSTED' ? 'job_alerts' : 'general';

    await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId,
        smallIcon: 'ic_notification',
        largeIcon: data.largeIcon || undefined,
        color: '#623AA2', 
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
      
      const requestStatus = await messaging().requestPermission();
      return requestStatus === messaging.AuthorizationStatus.AUTHORIZED || 
             requestStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } catch (error) {
      console.error('Permission request error:', error);
      return true;
    }
  }

  async registerTokenWithServerWithRetry(fcmToken, maxRetries = 3) {
    let retries = 0;
    
    const attemptRegistration = async () => {
      try {
        const result = await this.registerTokenWithServer(fcmToken);
        return result;
      } catch (error) {
        if (retries < maxRetries) {
          retries++;
          console.log(`Retrying token registration (${retries}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, retries - 1)));
          return attemptRegistration();
        } else {
          console.error('Max retries reached for token registration');
          return false;
        }
      }
    };
    
    return attemptRegistration();
  }

  setupPeriodicTokenRefresh() {
    setInterval(async () => {
      try {
        const pendingToken = await AsyncStorage.getItem('pendingFcmRegistration');
        if (pendingToken) {
          console.log('Attempting to register pending FCM token');
          const success = await this.registerTokenWithServer(pendingToken);
          if (success) {
            await AsyncStorage.removeItem('pendingFcmRegistration');
            console.log('Successfully registered pending FCM token');
          }
        }
      } catch (error) {
        console.log('Error in periodic token refresh:', error);
      }
    }, 3600000); 
  }

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

    this.setupAndroidChannel();
    

    this.setupPeriodicTokenRefresh();
    

    this.getToken().then(token => {
      if (token) {
        this.registerTokenWithServerWithRetry(token);
      }
    });

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

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification:', remoteMessage);
      return Promise.resolve();
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background notification:', remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from quit state notification:', remoteMessage);
      }
    });


    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === notifee.BackgroundEventType.PRESS) {
        console.log('User pressed notification from background', detail.notification);
      } else if (type === notifee.BackgroundEventType.ACTION_PRESS) {
        const { pressAction } = detail;
        

        if (pressAction.id === 'view_job' && detail.notification) {
          console.log('View job action pressed', detail.notification.data);
        } else if (pressAction.id === 'save_job' && detail.notification) {

          console.log('Save job action pressed', detail.notification.data);
        }
      }
    });


    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === notifee.ForegroundEventType.PRESS) {
        console.log('User pressed notification', detail.notification);
      } else if (type === notifee.ForegroundEventType.ACTION_PRESS) {
        const { pressAction } = detail;
        
        if (pressAction.id === 'view_job' && detail.notification) {
          console.log('View job action pressed', detail.notification.data);
        } else if (pressAction.id === 'save_job' && detail.notification) {
          console.log('Save job action pressed', detail.notification.data);
        }
      }
    });

    return unsubscribeForeground;
  }

  handleNotificationNavigation(notification, navigation) {
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
        navigation.navigate('ApplicationsReceived', { 
          jobId: notification.relatedJob && notification.relatedJob._id 
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
  }
}

export default new NotificationService();