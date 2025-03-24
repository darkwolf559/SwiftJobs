import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/constants'; 

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

// Get and store the FCM token
async function getFCMToken() {
  try {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        
        sendTokenToServer(fcmToken);
      }
    } else {
      console.log('FCM Token already exists:', fcmToken);
    }
  } catch (error) {
    console.log('Error getting FCM token:', error);
  }
}

// Send the token to your server
async function sendTokenToServer(fcmToken) {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    
    if (authToken) {
      await axios.post(
        `${API_URL}/profile/fcm-token`,
        { fcmToken },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log('FCM token sent to server successfully');
    }
  } catch (error) {
    console.log('Error sending FCM token to server:', error);
  }
}


export function notificationListener(onNotificationReceived) {
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);
    if (onNotificationReceived) {
      onNotificationReceived(remoteMessage);
    }
  });


  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background notification:', remoteMessage);
    return Promise.resolve();
  });


  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from notification:', remoteMessage);
      }
    });
}