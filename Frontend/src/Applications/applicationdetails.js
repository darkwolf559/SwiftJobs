import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/constants';

const ApplicationDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { applicationId } = route.params || {};
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        
        if (!applicationId) {
          setError('Application details not found');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_URL}/applications/${applicationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setApplication(response.data);
      } catch (error) {
        console.error('Error fetching application details:', error);
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicationDetails();
  }, [applicationId]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#623AA2" barStyle="light-content" />
        
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
            <Text style={styles.headerTitle}>APPLICATION DETAILS</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading application details...</Text>
        </View>
      </View>
    );
  }

  if (error || !application) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#623AA2" barStyle="light-content" />
        
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
            <Text style={styles.headerTitle}>APPLICATION DETAILS</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>
        
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color="#F97794" />
          <Text style={styles.errorText}>{error || 'Application details not available'}</Text>
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
      <StatusBar backgroundColor="#623AA2" barStyle="light-content" />
      
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
          <Text style={styles.headerTitle}>APPLICATION DETAILS</Text>
        </View>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Application Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) }]}>
            <Text style={styles.statusText}>{application.status || 'Pending'}</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>JOB DETAILS</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Position</Text>
              <Text style={styles.detailValue}>{application.job?.jobTitle || 'Not specified'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Company</Text>
              <Text style={styles.detailValue}>{application.job?.employerName || 'Not specified'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{application.job?.location || 'Not specified'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {getCategoryName(application.job?.jobCategory) || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Salary</Text>
              <Text style={styles.detailValue}>{application.job?.payment || 'Not specified'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>APPLICATION TIMELINE</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Applied On</Text>
              <Text style={styles.detailValue}>{formatDate(application.createdAt)}</Text>
            </View>
            
            {application.status !== 'Pending' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status Updated</Text>
                <Text style={styles.detailValue}>{formatDate(application.updatedAt)}</Text>
              </View>
            )}
            
            {application.feedback && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.detailLabel}>Feedback</Text>
                <Text style={styles.feedbackText}>{application.feedback}</Text>
              </View>
            )}
          </View>
        </View>
        
        {application.status === 'Accepted' && (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>NEXT STEPS</Text>
    <View style={styles.card}>
      <Text style={styles.instructionsText}>
        Congratulations! Your application has been accepted. You can now chat with the employer
        to discuss further details.
      </Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatScreen', {
            applicationId: applicationId,
            otherUser: {
              _id: application.job.employer,
              fullName: application.job.employerName,
              profilePhotoUrl: null
            },
            jobTitle: application.job.jobTitle
          })}
        >
          <Icon name="chat" size={20} color="white" />
          <Text style={styles.buttonText}>Chat with Employer</Text>
        </TouchableOpacity>
        
        {application.job?.employerEmail && (
          <TouchableOpacity 
            style={styles.emailButton}
            onPress={() => Linking.openURL(`mailto:${application.job.employerEmail}`)}
          >
            <Icon name="email" size={20} color="white" />
            <Text style={styles.buttonText}>Email Employer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
)}
        
        {application.status === 'Rejected' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>OTHER OPPORTUNITIES</Text>
            <View style={styles.card}>
              <Text style={styles.instructionsText}>
                Don't be discouraged! There are many more opportunities available.
              </Text>
              
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => navigation.navigate('AllJobs')}
              >
                <Icon name="search" size={20} color="white" />
                <Text style={styles.browseButtonText}>Browse More Jobs</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const getCategoryName = (categoryId) => {
  const categories = {
    '1': 'Technology',
    '2': 'Healthcare',
    '3': 'Education',
    '4': 'Agriculture',
    '5': 'Financial',
    '6': 'Transportation',
    '7': 'Construction',
    '8': 'Domestic Works',
    '9': 'Others'
  };
  
  return categories[categoryId] || categoryId;
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
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  feedbackContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  instructionsText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: '#623AA2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  browseButton: {
    backgroundColor: '#F97794',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ApplicationDetailsScreen;