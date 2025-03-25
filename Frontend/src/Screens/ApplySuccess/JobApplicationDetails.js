import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Linking,
  Alert 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/constants';

const JobApplicationDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { notificationId, applicantData } = route.params || {};
  const [resumeLoading, setResumeLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
const fetchApplicantDetails = async () => {
    try {
      setLoading(true);
      
      if (applicantData) {
        console.log('Using provided applicant data:', {
          hasName: !!applicantData.name,
          hasPhoto: !!applicantData.profilePhotoUrl,
          hasResume: !!applicantData.resumeUrl,
          hasAddress: !!applicantData.address
        });
        setApplicant(applicantData);
        setLoading(false);
        return;
      }
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      if (!notificationId) {
        setError('Application details not found');
        setLoading(false);
        return;
      }
      
      console.log('Fetching application details for notification:', notificationId);
      
      const response = await axios.get(`${API_URL}/notifications/${notificationId}/application-details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Received applicant details:', {
        hasName: !!response.data.name,
        hasPhoto: !!response.data.profilePhotoUrl,
        hasResume: !!response.data.resumeUrl,
        hasAddress: !!response.data.address
      });
      
      setApplicant(response.data);
    } catch (error) {
      console.error('Error fetching applicant details:', error);
      setError('Failed to load applicant details');
    } finally {
      setLoading(false);
    }
  };
    
    fetchApplicantDetails();
  }, [notificationId, applicantData]);
  
  const handleOpenResume = async () => {
    if (applicant && applicant.resumeUrl) {
      try {
        setResumeLoading(true);
        
        const base64Data = applicant.resumeUrl.split(',')[1];
        const resumeFileName = applicant.resumeName || 'resume.pdf';
        
        const filePath = `${RNFS.CachesDirectoryPath}/${resumeFileName}`;
        
        await RNFS.writeFile(filePath, base64Data, 'base64');
        await FileViewer.open(filePath);
      } catch (error) {
        console.error('Error opening resume:', error);
        Alert.alert('Error', 'Could not open resume file. The format might not be supported.');
      } finally {
        setResumeLoading(false);
      }
    } else {
      Alert.alert('Resume Not Available', 'No resume has been uploaded yet');
    }
  };
  
  const handleContactApplicant = (method, value) => {
    if (!value) return;
    
    switch (method) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      default:
        break;
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
          <View style={{width: 24}} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading applicant details...</Text>
        </View>
      </View>
    );
  }
  
  if (error || !applicant) {
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
          <View style={{width: 24}} />
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color="#F97794" />
          <Text style={styles.errorText}>{error || 'Applicant details not available'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
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
        <View style={{width: 24}} />
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            {applicant.profilePhotoUrl ? (
              <Image 
                source={{ uri: applicant.profilePhotoUrl }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Icon name="person" size={40} color="#623AA2" />
              </View>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{applicant.name || 'Unknown'}</Text>
            
            <View style={styles.contactButtonsContainer}>
              {applicant.phone && (
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContactApplicant('phone', applicant.phone)}
                >
                  <Icon name="phone" size={20} color="#623AA2" />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>
              )}
              
              {applicant.email && (
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => handleContactApplicant('email', applicant.email)}
                >
                  <Icon name="email" size={20} color="#623AA2" />
                  <Text style={styles.contactButtonText}>Email</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>JOB DETAILS</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Applied For</Text>
              <Text style={styles.infoValue}>{applicant.jobTitle || 'Unknown Job'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Application Date</Text>
              <Text style={styles.infoValue}>
                {applicant.applicationDate 
                  ? new Date(applicant.applicationDate).toLocaleDateString() 
                  : 'Unknown Date'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{applicant.name || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{applicant.gender || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{applicant.email || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{applicant.phone || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{applicant.address || 'Not provided'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          <View style={styles.infoCard}>
            {applicant.education ? (
              <Text style={styles.infoValue}>{applicant.education}</Text>
            ) : (
              <Text style={styles.noDataText}>No education information provided</Text>
            )}
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          <View style={styles.infoCard}>
            {applicant.skills ? (
              <View style={styles.skillsContainer}>
                {applicant.skills.split(',').map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill.trim()}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No skills information provided</Text>
            )}
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>RESUME</Text>
          <View style={styles.infoCard}>
            {applicant.resumeUrl ? (
              <View style={styles.resumeContainer}>
                <Icon name="description" size={24} color="#623AA2" />
                <Text style={styles.resumeText}>Resume available</Text>
                <TouchableOpacity 
                  style={styles.viewResumeButton}
                  onPress={handleOpenResume}
                >
                  <Text style={styles.viewResumeButtonText}>View Resume</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.noDataText}>No resume provided</Text>
            )}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => {

              Alert.alert('Success', 'Applicant has been approved');
            }}
          >
            <Icon name="check" size={24} color="white" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => {
              Alert.alert('Success', 'Applicant has been rejected');
            }}
          >
            <Icon name="close" size={24} color="white" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
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
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profilePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contactButtonsContainer: {
    flexDirection: 'row',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E6FF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  contactButtonText: {
    color: '#623AA2',
    marginLeft: 5,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  noDataText: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  skillChip: {
    backgroundColor: '#F0E6FF',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 3,
  },
  skillText: {
    color: '#623AA2',
    fontSize: 14,
  },
  resumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resumeText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  viewResumeButton: {
    backgroundColor: '#623AA2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  viewResumeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default JobApplicationDetailsScreen;