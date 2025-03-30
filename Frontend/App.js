import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'react-native' ;
import Onboarding from './src/Screens/onboardingScreen.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginSignup/LoginScreen.js';
import SignupScreen from './src/Screens/LoginSignup/SignupScreen.js';
import HomeScreen from './src/Screens/HomeScreen/HomeScreen.js';
import 'react-native-gesture-handler'
import UserProfile from './src/compenents/UserProfile/UserProfile.js';
import CategoryScreen from './src/Screens/CategoryScreen/CategoryScreen.js';
import CompanyScreen from './src/Screens/CompanyScreen/CompanyScreen.js';
import EditProfile from './src/Screens/EditProfileScreen/EditProfile.js';
import InviteFriend from './src/Screens/InviteFriend/InviteFriend.js';
import Company from './src/CompanyPage/company.js';
import JobSingle from './src/JobSinglePage/job.js';
import FilterScreen from './src/FilterPage/filter.js';
import JobsList from './src/Screens/JobList/JobList.js';
import Chatbot from './src/Chatbot/Chatbot.js';
import JobPostingPage from './src/Screens/JobPost/JobPost.js';
import { AuthProvider } from './src/context/AuthContext';
import AllJobsScreen from './src/Screens/JobList/AllJobs.js';
import TestimonialsScreen from './src/compenents/Testimonials/TestimonialsScreen.js';
import BookmarksScreen from './src/Screens/Bookmark/BookmarksScreen.js';
import NotificationsScreen from './src/Screens/Notifications/NotificationsScreen.js';
import { requestUserPermission, notificationListener } from './src/utils/firebase';
import { NotificationProvider } from './src/context/NotificationContext.js';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import AllReviewsScreen from './src/Screens/AllReviews/AllReviews.js';
import ApplicationDetailsScreen from './src/Applications/applicationdetails.js';
import AppliedJobsScreen from './src/Applications/appliedJobs.js';
import ApplicationsScreen from './src/Applications/ApplicationScreen.js';
import JobApplicationDetailsScreen from './src/Screens/ApplySuccess/JobApplicationDetails.js';
import ChatsListScreen from './src/Chat/chatList.js';
import ChatScreen from './src/Chat/chatScreen.js';
import ForgotPasswordScreen from './src/Screens/LoginSignup/ForgotPasswordScreen.js';
import ResetPasswordScreen from './src/Screens/LoginSignup/ResetPasswordScreen.js';
import VerifyCodeScreen from './src/Screens/LoginSignup/VerifyCodeScreen.js';





messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background notification received:', remoteMessage);
  return Promise.resolve();
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 50,
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          backgroundColor: "#fff",
        },
        tabBarActiveTintColor: "#623AA2",
        tabBarInactiveTintColor: "#B0B0B0",
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={26} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="BookmarksTab" 
        component={BookmarksScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bookmark-o" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="JobsTab" 
        component={AllJobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="briefcase" size={23} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="InviteTab" 
        component={InviteFriend}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-friends" size={23} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={UserProfile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-circle" size={24} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default App = () => {

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);
  
  return (
    <AuthProvider>
      <NotificationProvider>
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator 
        initialRouteName="Onboarding"
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="CompanyScreen" component={CompanyScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="InviteFriend" component={InviteFriend} />
        <Stack.Screen name="Company" component={Company} />
        <Stack.Screen name="JobSingle" component={JobSingle} />
        <Stack.Screen name="FilterScreen" component={FilterScreen} />
        <Stack.Screen name="JobsList" component={JobsList} />
        <Stack.Screen name="Chatbot" component={Chatbot} />
        <Stack.Screen name="JobPostingPage" component={JobPostingPage} />
        <Stack.Screen name="AllJobsScreen" component={AllJobsScreen} />
        <Stack.Screen name="TestimonialsScreen" component={TestimonialsScreen} />
        <Stack.Screen name="BookmarksScreen" component={BookmarksScreen} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        <Stack.Screen name="AllReviewsScreen" component={AllReviewsScreen} />
        <Stack.Screen name="ApplicationDetails" component={ApplicationDetailsScreen} />
        <Stack.Screen name="AppliedJobsScreen" component={AppliedJobsScreen} />
        <Stack.Screen name="ApplicationsScreen" component={ApplicationsScreen} />
        <Stack.Screen name="JobApplicationDetails" component={JobApplicationDetailsScreen} />
        <Stack.Screen name="ChatsListScreen" component={ChatsListScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </NotificationProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});