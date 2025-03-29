import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/constants';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const JobApplicationDetailsScreen = ({ route, navigation }) => {
  const { applicationId, notificationId, applicantData: initialData } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicantData, setApplicantData] = useState(initialData || null);
  const [jobData, setJobData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  useEffect(() => {
    fetchApplicationDetails();
  }, []);
  
  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      let response;
      
      if (applicationId) {
        response = await axios.get(`${API_URL}/applications/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const application = response.data;
        
        setApplicantData({
          id: application.applicant._id,
          name: application.applicant.fullName || application.applicantName,
          email: application.applicant.email || application.applicantEmail,
          phone: application.applicant.phoneNumber || application.applicantPhone,
          gender: application.applicant.gender || application.applicantGender,
          address: application.applicant.homeAddress || application.applicantAddress,
          education: application.applicantEducation,
          skills: application.applicantSkills,
          status: application.status,
          feedback: application.feedback,
          profilePhotoUrl: application.applicant.profilePhotoUrl,
          resumeUrl: application.applicant.resumeUrl,
          resumeName: application.applicant.resumeName,
          applicationDate: new Date(application.createdAt).toLocaleDateString()
        });
        
        setJobData({
          id: application.job._id,
          title: application.job.jobTitle,
          location: application.job.location,
          salary: application.job.payment,
          employerName: application.job.employerName,
          employerPhotoUrl: application.job.employerPhotoUrl,
          category: application.job.jobCategory
        });
      } else if (notificationId) {
        response = await axios.get(`${API_URL}/notifications/${notificationId}/application-details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get job details from the notification data
        let jobResponse;
        try {
          if (response.data.jobId) {
            jobResponse = await axios.get(`${API_URL}/jobs/${response.data.jobId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            setJobData({
              id: jobResponse.data._id,
              title: jobResponse.data.jobTitle,
              location: jobResponse.data.location,
              salary: jobResponse.data.payment,
              employerName: jobResponse.data.employerName,
              employerPhotoUrl: jobResponse.data.employerPhotoUrl,
              category: jobResponse.data.jobCategory
            });
          }
        } catch (jobError) {
          console.error('Error fetching job details:', jobError);
        }
        
        setApplicantData({
          ...response.data,
          status: 'Pending',
        });
        
        await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (initialData) {
        setApplicantData({
          ...initialData,
          status: initialData.status || 'Pending',
          applicationDate: initialData.applicationDate || new Date().toLocaleDateString()
        });

        if (initialData.jobId) {
          try {
            const jobResponse = await axios.get(`${API_URL}/jobs/${initialData.jobId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            setJobData({
              id: jobResponse.data._id,
              title: jobResponse.data.jobTitle,
              location: jobResponse.data.location,
              salary: jobResponse.data.payment,
              employerName: jobResponse.data.employerName,
              employerPhotoUrl: jobResponse.data.employerPhotoUrl,
              category: jobResponse.data.jobCategory
            });
          } catch (jobError) {
            console.error('Error fetching job details:', jobError);
          }
        } else {
          setJobData({
            title: initialData.jobTitle || 'Job Position',
            location: initialData.location || 'Unknown Location',
            salary: initialData.salary || 'Not specified',
            employerName: initialData.employerName || 'Employer',
            employerPhotoUrl: null
          });
        }
      } else {
        setError('No application information provided');
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenResume = async () => {
    if (applicantData && applicantData.resumeUrl) {
      try {
        setResumeLoading(true);
        
        const base64Data = applicantData.resumeUrl.split(',')[1];
        const resumeFileName = applicantData.resumeName || 'resume.pdf';
        
        const filePath = `${RNFS.CachesDirectoryPath}/${resumeFileName}`;
        
        await RNFS.writeFile(filePath, base64Data, 'base64');
        
        await FileViewer.open(filePath);
      } catch (error) {
        console.error('Error opening resume:', error);
        Alert.alert('Error', 'Could not open resume file');
      } finally {
        setResumeLoading(false);
      }
    } else {
      Alert.alert('Resume Not Available', 'This applicant has not uploaded a resume');
    }
  };
  
  const handleContact = (type) => {
    let action;
    
    switch (type) {
      case 'phone':
        if (!applicantData.phone) {
          Alert.alert('Contact Error', 'Phone number not available');
          return;
        }
        action = `tel:${applicantData.phone}`;
        break;
      case 'email':
        if (!applicantData.email) {
          Alert.alert('Contact Error', 'Email not available');
          return;
        }
        action = `mailto:${applicantData.email}`;
        break;
      default:
        return;
    }
    
    Linking.canOpenURL(action)
      .then(supported => {
        if (supported) {
          return Linking.openURL(action);
        } else {
          Alert.alert('Error', `Cannot open ${type}: ${action}`);
        }
      })
      .catch(error => {
        console.error(`Error opening ${type} link:`, error);
        Alert.alert('Error', `Failed to open ${type}`);
      });
  };
  
  const handleAction = async (status) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Authentication Error', 'You need to be logged in to perform this action');
        return;
      }
      
      let endpoint;
      let payload = { status, feedback };
      
      if (applicationId) {
        endpoint = `${API_URL}/applications/${applicationId}/status`;
      } else if (notificationId) {
        endpoint = `${API_URL}/notifications/${notificationId}/application-status`;
      } else {
        Alert.alert('Error', 'Cannot update application status without proper reference');
        setActionLoading(false);
        return;
      }
      
      const response = await axios.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setApplicantData(prevData => ({
        ...prevData,
        status: status,
        feedback: feedback
      }));
      
      ToastAndroid.show(`Application ${status.toLowerCase()} successfully`, ToastAndroid.SHORT);
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
      
    } catch (error) {
      console.error('Error updating application status:', error);
      Alert.alert('Error', 'Failed to update application status');
    } finally {
      setActionLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
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
            <Text style={styles.headerTitle}>APPLICANT DETAILS</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading applicant details...</Text>
        </View>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.container}>
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
            <Text style={styles.headerTitle}>APPLICANT DETAILS</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color="#F97794" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchApplicationDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>APPLICANT DETAILS</Text>
        </View>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Job Information Section */}
        <View style={styles.jobCard}>
          <View style={styles.jobCardHeader}>
            <View style={styles.jobCompanyLogo}>
              {jobData && jobData.employerPhotoUrl ? (
                <Image 
                  source={{ uri: jobData.employerPhotoUrl }} 
                  style={styles.employerPhoto} 
                />
              ) : (
                <View style={styles.employerPhotoPlaceholder}>
                  <Icon name="business" size={28} color="#623AA2" />
                </View>
              )}
            </View>
            
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{jobData?.title || 'Job Position'}</Text>
              <View style={styles.jobMetaRow}>
                <Icon name="location-on" size={16} color="#666" style={styles.jobMetaIcon} />
                <Text style={styles.jobMetaText}>{jobData?.location || 'Unknown Location'}</Text>
              </View>
              <View style={styles.jobMetaRow}>
                <Icon name="monetization-on" size={16} color="#666" style={styles.jobMetaIcon} />
                <Text style={styles.jobMetaText}>{jobData?.salary || 'Salary not specified'}</Text>
              </View>
              <View style={styles.jobMetaRow}>
                <Icon name="business-center" size={16} color="#666" style={styles.jobMetaIcon} />
                <Text style={styles.jobMetaText}>{jobData?.employerName || 'Employer'}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.applicationStatusRow}>
            <Text style={styles.applicationDate}>Application Date: {applicantData.applicationDate}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(applicantData.status) }]}>
              <Text style={styles.statusText}>{applicantData.status || 'Pending'}</Text>
            </View>
          </View>
        </View>
        
        {/* Applicant Information */}
        <View style={styles.sectionTitle}>
          <Icon name="person" size={20} color="#623AA2" style={styles.sectionTitleIcon} />
          <Text style={styles.sectionTitleText}>Applicant Information</Text>
        </View>
        
        <View style={styles.applicantCard}>
          <View style={styles.applicantHeader}>
            {applicantData.profilePhotoUrl ? (
              <Image 
                source={{ uri: applicantData.profilePhotoUrl }} 
                style={styles.applicantPhoto} 
              />
            ) : (
              <View style={styles.applicantPhotoPlaceholder}>
                <Icon name="person" size={40} color="#623AA2" />
              </View>
            )}
            
            <View style={styles.applicantInfo}>
              <Text style={styles.applicantName}>{applicantData.name}</Text>
              <View style={styles.contactButtons}>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContact('phone')}
                >
                  <Icon name="phone" size={20} color="#623AA2" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContact('email')}
                >
                  <Icon name="email" size={20} color="#623AA2" />
                </TouchableOpacity>
                
                {applicantData.resumeUrl && (
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={handleOpenResume}
                    disabled={resumeLoading}
                  >
                    {resumeLoading ? (
                      <ActivityIndicator size="small" color="#623AA2" />
                    ) : (
                      <Icon name="description" size={20} color="#623AA2" />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <DetailItem icon="email" label="Email" value={applicantData.email} />
            <DetailItem icon="phone" label="Phone" value={applicantData.phone} />
            <DetailItem icon="wc" label="Gender" value={applicantData.gender} />
            <DetailItem icon="home" label="Address" value={applicantData.address} />
            <DetailItem icon="school" label="Education" value={applicantData.education} multiline />
            <DetailItem icon="build" label="Skills" value={applicantData.skills} multiline />
          </View>
        </View>

        {applicantData.resumeUrl && (
          <>
            <View style={styles.sectionTitle}>
              <Icon name="description" size={20} color="#623AA2" style={styles.sectionTitleIcon} />
              <Text style={styles.sectionTitleText}>Resume</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.resumeCard}
              onPress={handleOpenResume}
              disabled={resumeLoading}
            >
              <View style={styles.resumeIcon}>
                {resumeLoading ? (
                  <ActivityIndicator size="large" color="#623AA2" />
                ) : (
                  <Icon name="description" size={40} color="#623AA2" />
                )}
              </View>
              <View style={styles.resumeInfo}>
                <Text style={styles.resumeName}>{applicantData.resumeName || 'Resume'}</Text>
                <Text style={styles.resumeAction}>Tap to view resume</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </>
        )}

{applicantData.status === 'Accepted' && (
  <View style={styles.chatButtonContainer}>
    <TouchableOpacity
      style={styles.chatButton}
      onPress={() => navigation.navigate('ChatScreen', {
        applicationId: applicationId,
        otherUser: {
          _id: applicantData.id,
          fullName: applicantData.name,
          profilePhotoUrl: applicantData.profilePhotoUrl
        },
        jobTitle: jobData?.title || 'Job Discussion'
      })}
    >
      <Icon name="chat" size={20} color="#fff" />
      <Text style={styles.chatButtonText}>Chat with Applicant</Text>
    </TouchableOpacity>
  </View>
)}

        {applicantData.status !== 'Accepted' && applicantData.status !== 'Rejected' && (
          <View style={styles.actionContainer}>
            <Text style={styles.feedbackLabel}>Feedback (Optional):</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Provide feedback to the applicant"
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => {
                  Alert.alert(
                    'Reject Application',
                    'Are you sure you want to reject this application?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Reject', onPress: () => handleAction('Rejected') }
                    ]
                  );
                }}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>REJECT</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => {
                  Alert.alert(
                    'Accept Application',
                    'Are you sure you want to accept this application?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Accept', onPress: () => handleAction('Accepted') }
                    ]
                  );
                }}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>ACCEPT</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(applicantData.status === 'Accepted' || applicantData.status === 'Rejected') && applicantData.feedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>Feedback:</Text>
            <Text style={styles.feedbackText}>{applicantData.feedback}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const DetailItem = ({ icon, label, value, multiline }) => {
  if (!value) return null;
  
  return (
    <View style={styles.detailItem}>
      <Icon name={icon} size={20} color="#666" />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[
          styles.detailValue, 
          multiline && styles.multilineValue
        ]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return '#FFB700'; 
    case 'accepted':
      return '#4CAF50'; 
    case 'rejected':
      return '#F44336'; 
    default:
      return '#999'; 
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  placeholder: {
    width: 34,
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
  },
  retryButton: {
    backgroundColor: '#623AA2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },

  jobCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobCardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  jobCompanyLogo: {
    marginRight: 16,
  },
  employerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  employerPhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  jobMetaIcon: {
    marginRight: 8,
  },
  jobMetaText: {
    fontSize: 14,
    color: '#666',
  },
  applicationStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  applicationDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitleIcon: {
    marginRight: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  applicantCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  applicantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  applicantPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  applicantPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applicantInfo: {
    flex: 1,
    marginLeft: 16,
  },
  applicantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  detailsContainer: {
    marginTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  multilineValue: {
    lineHeight: 22,
  },
  
  // Resume card
  resumeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumeIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  resumeAction: {
    fontSize: 14,
    color: '#623AA2',
  },

  actionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  feedbackContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
      feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  chatButtonContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  chatButton: {
    backgroundColor: '#623AA2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});

export default JobApplicationDetailsScreen;