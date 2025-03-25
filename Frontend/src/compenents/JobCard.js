import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { bookmarkService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApplySuccessPopup from '../Screens/ApplySuccess/ApplySuccessPopup';
import { API_URL } from '../config/constants';
const JobCard = ({ job, onPress, navigation }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const isMounted = useRef(true);
  
  useEffect(() => {
    checkBookmarkStatus();
    

    return () => {
      isMounted.current = false;
    };
  }, [job.id]);
  
  const checkBookmarkStatus = async () => {
    try {
  
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      
      const isBookmarked = await bookmarkService.checkBookmarkStatus(job.id);
      if (isMounted.current) {
        setIsBookmarked(isBookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };
  
  const toggleBookmark = async () => {
    try {

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {

        navigation.navigate('Login');
        return;
      }
      
      setBookmarkLoading(true);
      
      if (isBookmarked) {        await bookmarkService.removeBookmark(job.id);
        if (isMounted.current) {
          setIsBookmarked(false);
          ToastAndroid.show("Job removed from bookmarks", ToastAndroid.SHORT);
        }
      } else {

        await bookmarkService.addBookmark(job.id);
        if (isMounted.current) {
          setIsBookmarked(true);
          ToastAndroid.show("Job added to bookmarks", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      if (isMounted.current) {
        let errorMessage = "Failed to update bookmark";
 
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      }
    } finally {
      if (isMounted.current) {
        setBookmarkLoading(false);
      }
    }
  };


  const handleApply = async (e) => {
    e.stopPropagation(); 
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert('Login Required', 'You need to login to apply for this job');
        navigation.navigate('Login');
        return;
      }
  
      setShowSuccessPopup(true);
      
      const userData = await AsyncStorage.getItem('userData');
      let parsedUserData = {};
      
      if (userData) {
        parsedUserData = JSON.parse(userData);
      }

      function formatEducation(userData) {
        const parts = [];
        if (userData.college) parts.push(`College: ${userData.college}`);
        if (userData.highSchool) parts.push(`High School: ${userData.highSchool}`);
        if (userData.higherSecondaryEducation) parts.push(`Higher Secondary: ${userData.higherSecondaryEducation}`);
        return parts.join('\n');
      }
   
      if (!job.id) {
        console.error('Job ID is missing');
        ToastAndroid.show("Cannot apply - missing job information", ToastAndroid.SHORT);
        return;
      }
  
      console.log('Applying for job with ID:', job.id);
  
      const response = await axios.post(
        `${API_URL}/jobs/${job.id}/apply`,
        {
          jobId: job.id,
          userName: parsedUserData.fullName || parsedUserData.username || 'User',
          userEmail: parsedUserData.email || '',
          userPhone: parsedUserData.phoneNumber || parsedUserData.mobileNumber || '',
          userGender: parsedUserData.gender || '',
          userAddress: parsedUserData.homeAddress || '',
          userEducation: formatEducation(parsedUserData),
          userSkills: parsedUserData.skills ? parsedUserData.skills.join(', ') : ''
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        }
      );
      
      console.log('Job application sent:', response.data);
      ToastAndroid.show("Application submitted successfully!", ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error applying for job:', error);
      setShowSuccessPopup(false);
      ToastAndroid.show("Failed to submit application. Please try again.", ToastAndroid.LONG);
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={onPress}
    >
      <View style={styles.jobHeader}>
        <Image
          source={require('../assets/20943599.jpg')}
          style={styles.companyLogo}
        />
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyInfo}>
            {job.company}, {job.location}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleBookmark();
          }}
          disabled={bookmarkLoading}
        >
          {bookmarkLoading ? (
            <ActivityIndicator size="small" color="#623AA2" />
          ) : (
            <Icon 
              name={isBookmarked ? "bookmark" : "bookmark-border"} 
              size={24} 
              color="#623AA2" 
            />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.jobDescription}>{job.description}</Text>
      <View style={styles.jobFooter}>
        <Text style={styles.salary}>{job.salary}</Text>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>APPLY</Text>
        </TouchableOpacity>
      </View>
      <ApplySuccessPopup 
        visible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  jobTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  companyInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bookmarkButton: {
    padding: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  applyButton: {
    backgroundColor: '#623AA2',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default JobCard;