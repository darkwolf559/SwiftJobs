import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ToastAndroid, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { jobService, reviewService } from '../services/api';
import { bookmarkService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApplySuccessPopup from '../Screens/ApplySuccess/ApplySuccessPopup';
import { API_URL } from '../config/constants';
import axios from 'axios';
const JobSingle = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState('Description');
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const { jobId } = route.params || { jobId: null };
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const isMounted = useRef(true);
  const [ratingStats, setRatingStats] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });
  
  const checkBookmarkStatus = async () => {
    try {
      if (!jobId) return;
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      
      const isBookmarked = await bookmarkService.checkBookmarkStatus(jobId);
      if (isMounted.current) {
        setIsBookmarked(isBookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };
  
  const fetchJobReviews = async () => {
    try {
      if (!jobId) return;
      
      const reviewsData = await reviewService.getJobReviews(jobId);
      

      const formattedReviews = reviewsData.map(review => ({
        id: review._id,
        name: review.userId ? (review.userId.fullName || review.userId.username) : 'Anonymous User',
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.createdAt).toLocaleDateString(),
        avatar: review.userId && review.userId.profilePhotoUrl ? review.userId.profilePhotoUrl : null
      }));
      
      setReviews(formattedReviews);
      

      const stats = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      };
      
      reviewsData.forEach(review => {
        stats[review.rating] = (stats[review.rating] || 0) + 1;
      });
      
      setRatingStats(stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (jobId) {
          console.log('Fetching job with ID:', jobId);
          const data = await jobService.getJobById(jobId);
          
          const formattedJob = {
            title: data.jobTitle,
            salary: data.payment,
            jobType: data.duration,
            location: data.location,
            jobDescription: data.jobDescription,
            requiredSkills: data.requiredSkills,
            workingHours: data.workingHours,
            employerName: data.employerName || 'Company Name Not Available',
            employerEmail: data.employerEmail || data.employerMobile || 'Email Not Available',
            employerPhone: data.employerPhone || 'Phone Not Available',
            employerWebsite: data.employerWebsite || 'Website Not Available',
            applicationDeadline: data.applicationDeadline || 'Deadline not Available'
          };
          
          setJobData(formattedJob);
        } else {
          setJobData(getSampleJobData());
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
        setError('Failed to load job details. Please try again.');
        setJobData(getSampleJobData());
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
    checkBookmarkStatus();
    fetchJobReviews();
  }, [jobId]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const toggleBookmark = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      
      if (isMounted.current) {
        setBookmarkLoading(true);
      }
      
      if (isBookmarked) {
        await bookmarkService.removeBookmark(jobId);
        if (isMounted.current) {
          setIsBookmarked(false);
          ToastAndroid.show("Job removed from bookmarks", ToastAndroid.SHORT);
        }
      } else {
        await bookmarkService.addBookmark(jobId);
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
        
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      }
    } finally {
      if (isMounted.current) {
        setBookmarkLoading(false);
      }
    }
  };
  
  const getSampleJobData = () => {
    return {
      title: "Driving Vacancy",
      salary: "$75,000 - $90,000 a year",
      jobType: "Part Time",
      location: "Sri Lanka",
      jobDescription: "We are looking for experienced drivers to join our growing team. The ideal candidate will be responsible for safely transporting goods and ensuring timely deliveries to our customers.",
      requiredSkills: "Valid driving license, 2+ years of experience, Clean driving record, Basic vehicle maintenance knowledge",
      workingHours: "20-25 hours/week, Flexible scheduling",
      employerName: "Swift Transport Services",
      employerEmail: "careers@swifttransport.com",
      employerPhone: "+94 75 123 4567",
      employerWebsite: "www.swifttransport.com",
      applicationDeadline: "April 30, 2025"
    };
  };

  const openLink = (url) => {
    if (!url || url === 'Website Not Available') {
      Alert.alert('Info', 'Website not available');
      return;
    }
    
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(fullUrl).catch(() => Alert.alert('Error', 'Failed to open link'));
  };
  
  const submitReview = async () => {
    if (userRating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert(
          'Login Required', 
          'You need to login to submit a review',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }
      
      setSubmittingReview(true);
      setReviewError(null);
      
      await reviewService.addReview(jobId, userRating, userComment);
      

      await fetchJobReviews();
      
      setUserRating(0);
      setUserComment('');
      
      Alert.alert('Success', 'Your review has been submitted!');
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError('Failed to submit review. Please try again.');
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };


  const handleApply = async (e) => {
    e.stopPropagation(); 
    try {
      setShowSuccessPopup(true);
      
      const userData = await AsyncStorage.getItem('userData');
      let parsedUserData = {};
      
      if (userData) {
        parsedUserData = JSON.parse(userData);
      }
      
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert('Login Required', 'You need to login to apply for this job');
        navigation.navigate('Login');
        return;
      }

      function formatEducation(userData) {
        const parts = [];
        if (userData.college) parts.push(`College: ${userData.college}`);
        if (userData.highSchool) parts.push(`High School: ${userData.highSchool}`);
        if (userData.higherSecondaryEducation) parts.push(`Higher Secondary: ${userData.higherSecondaryEducation}`);
        return parts.join('\n');
      }
   
      const response = await axios.post(
        `${API_URL}/jobs/${jobId}/apply`,
        {
          jobId: jobId,
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
    } catch (error) {
      console.error('Error applying for job:', error);
      ToastAndroid.show("Failed to submit application. Please try again.", ToastAndroid.LONG);
    }
  };

  if (loading) {
    return (
      <>
        <LinearGradient 
          colors={["#623AA2", "#F97794"]} 
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>JOB DETAILS</Text>
          </View>
          <View style={{width: 24, opacity: 0}} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </>
    );
  }

  if (error && !jobData) {
    return (
      <>
        <LinearGradient 
          colors={["#623AA2", "#F97794"]} 
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>JOB DETAILS</Text>
          </View>
          <View style={{width: 24, opacity: 0}} />
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <>
            <Text style={styles.topics}>Job Description</Text>
            <View style={styles.card}>
              <Text style={styles.description}>{jobData?.jobDescription}</Text>
            </View>
            
            <Text style={styles.topics}>Required Skills</Text>
            <View style={styles.card}>
              {jobData?.requiredSkills ? 
                jobData.requiredSkills.split(',').map((skill, index) => (
                  <Text key={index} style={styles.points}>{`• ${skill.trim()}`}</Text>
                ))
                :
                <Text style={styles.description}>No specific skills listed</Text>
              }
            </View>
            
            <Text style={styles.topics}>Working Hours</Text>
            <View style={styles.card}>
              <Text style={styles.description}>{jobData?.workingHours}</Text>
            </View>
          </>
        );
      case 'Employer':
        return (
          <>
            <Text style={styles.topics}>Employer Information</Text>
            <View style={styles.card}>
              <View style={styles.employerDetail}>
                <Icon name="business" size={24} color="#601cd6" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Company Name</Text>
                  <Text style={styles.detailValue}>{jobData?.employerName}</Text>
                </View>
              </View>
              
              <View style={styles.employerDetail}>
                <Icon name="mail" size={24} color="#601cd6" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{jobData?.employerEmail}</Text>
                </View>
              </View>
              
              <View style={styles.employerDetail}>
                <Icon name="call" size={24} color="#601cd6" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{jobData?.employerPhone}</Text>
                </View>
              </View>
              
              <View style={styles.employerDetail}>
                <Icon name="globe" size={24} color="#601cd6" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Website</Text>
                  <TouchableOpacity onPress={() => openLink(jobData?.employerWebsite)}>
                    <Text style={[styles.detailValue, styles.link]}>{jobData?.employerWebsite}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.employerDetail}>
                <Icon name="calendar" size={24} color="#601cd6" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Application Deadline</Text>
                  <Text style={styles.detailValue}>{jobData?.applicationDeadline}</Text>
                </View>
              </View>
            </View>
          </>
        );
      case 'Review':
        return (
          <View style={styles.reviewContainer}>
            <View style={styles.ratingStatsContainer}>
              {[5, 4, 3, 2, 1].map(rating => (
                <View key={rating} style={styles.ratingRow}>
                  <View style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={styles.starIcon}>
                        {i < rating ? '★' : '☆'}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${(ratingStats[rating] / Object.values(ratingStats).reduce((a, b) => a + b, 0) || 0) * 100}%`,
                          backgroundColor: '#9370DB' 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.ratingCount}>{ratingStats[rating]}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.yourRatingText}>YOUR RATING</Text>
            <View style={styles.userRatingContainer}>
              <View style={styles.starRatingContainer}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    onPress={() => setUserRating(rating)}
                    style={styles.ratingButton}
                  >
                    <Text style={styles.starIcon}>
                      {userRating >= rating ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={styles.commentInput}
                placeholder="Enter your comment"
                value={userComment}
                onChangeText={setUserComment}
                multiline
              />
              
              <TouchableOpacity 
                style={[styles.submitButton, submittingReview && styles.disabledButton]}
                onPress={submitReview}
                disabled={submittingReview}
              >
                {submittingReview ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>SUBMIT</Text>
                )}
              </TouchableOpacity>
              
              {reviewError && <Text style={styles.errorText}>{reviewError}</Text>}
            </View>

            <View style={styles.reviewsList}>
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewerInfo}>
                        <View style={styles.avatarContainer}>
                          {review.avatar ? (
                            <Image source={{ uri: review.avatar }} style={styles.reviewerAvatar} />
                          ) : (
                            <Icon name="person-circle" size={30} color="#fff" />
                          )}
                        </View>
                        <View>
                          <Text style={styles.reviewerName}>{review.name}</Text>
                          <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                      </View>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Text key={i} style={styles.starIcon}>
                            {i < review.rating ? '★' : '☆'}
                          </Text>
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noReviewsText}>No reviews available for this job posting yet. Be the first to review!</Text>
              )}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <LinearGradient 
        colors={["#623AA2", "#F97794"]} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>JOB DETAILS</Text>
        </View>
        <View style={{width: 24, opacity: 0}} />
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.container}>
      
      <View style={{marginLeft:15}}>
      <View style={styles.jobHeaderContainer}>
      <View style={styles.jobCard}>
      <View style={styles.iconContainer}>
      <Icon name="today" size={36} color="#601cd6" />
    </View>
    <Text style={styles.jobTitle}>{jobData?.title}</Text>
    
      <View style={styles.jobMetaContainer}>
      <View style={styles.salaryContainer}>
        <Icon name="cash-outline" size={16} color="#666" style={styles.metaIcon} />
        <Text style={styles.salaryText}>{jobData?.salary}</Text>
      </View>
      
      <View style={styles.jobTypeContainer}>
        <Icon name="time-outline" size={16} color="#666" style={styles.metaIcon} />
        <Text style={styles.jobTypeText}>{jobData?.jobType}</Text>
       </View>
     </View>
    
      <View style={styles.locationContainer}>
      <Icon name="location-outline" size={16} color="#666" style={styles.metaIcon} />
      <Text style={styles.locationText}>{jobData?.location}</Text>
    </View>
     </View>
    </View>

        <View style={styles.tabContainer}>
          {['Description', 'Employer', 'Review'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
      </View>
      
      <View style={styles.bottomContainer}>
      <TouchableOpacity 
        style={styles.bookmarkButton}
        onPress={toggleBookmark}
        disabled={bookmarkLoading}
      >
      {bookmarkLoading ? (
        <ActivityIndicator size="small" color="#601cd6" />
      ) : (
        <Icon 
          name={isBookmarked ? "bookmark" : "bookmark-outline"} 
          size={40} 
          color="#601cd6" 
        />
      )}
      </TouchableOpacity>
        
      <TouchableOpacity 
        style={styles.applyButton}
        onPress={handleApply}
>
       <Text style={styles.applyButtonText}>APPLY</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
    <ApplySuccessPopup 
      visible={showSuccessPopup} 
      onClose={() => setShowSuccessPopup(false)} 
    />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#623AA2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  jobHeaderContainer: {
    paddingHorizontal: 15,
    width: '100%',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    marginLeft:-15
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  jobMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  jobTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaIcon: {
    marginRight: 5,
  },
  salaryText: {
    fontSize: 15,
    color: '#666',
  },
  jobTypeText: {
    fontSize: 14,
    color: '#601cd6',
    fontWeight: '600',
  },
  locationText: {
    fontSize: 15,
    color: '#666',
  },
  topics: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15,
    marginBottom: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 5,
    marginBottom: 3,
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#7b5cff',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  points: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
    color: '#333',
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  bookmarkButton: {
    width: 50,
    height: 50,
  },
  applyButton: {
    width: '70%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#601cd6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  employerDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  reviewContainer: {
    marginTop: 15,
  },
  ratingStatsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    width: 90,
  },
  starIcon: {
    fontSize: 18,
    color: '#FFD700',
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  ratingCount: {
    width: 30,
    textAlign: 'right',
    color: '#666',
  },
  yourRatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  userRatingContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  ratingButton: {
    padding: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#9370DB',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
    opacity: 0.8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewsList: {
    marginTop: 20,
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9370DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewDate: {
    color: '#888',
    fontSize: 12,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  errorText: {
    color: '#f44336',
    marginTop: 10,
    textAlign: 'center',
  }
});

export default JobSingle;