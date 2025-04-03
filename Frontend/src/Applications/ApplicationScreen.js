import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/constants';

const ApplicationsScreen = () => {
  const navigation = useNavigation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchApplications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('You need to be logged in to view applications');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/applications/employer`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplications(false);
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

  const filteredApplications = () => {
    if (activeFilter === 'All') {
      return applications;
    }
    return applications.filter(app => 
      app.status.toLowerCase() === activeFilter.toLowerCase()
    );
  };

  const renderFilterButton = (filterName) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filterName && styles.activeFilterButton
      ]}
      onPress={() => setActiveFilter(filterName)}
    >
      <Text 
        style={[
          styles.filterButtonText,
          activeFilter === filterName && styles.activeFilterButtonText
        ]}
      >
        {filterName}
      </Text>
    </TouchableOpacity>
  );

  const   renderApplicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.applicationItem}
      onPress={() => navigation.navigate('JobApplicationDetails', { 
        applicationId: item._id,
        notificationId: item.relatedNotification,
        applicantData: {
          _id: item.applicant?._id,
          name: item.applicant?.fullName || item.applicantName || 'Applicant',
          email: item.applicant?.email || item.applicantEmail || '',
          phone: item.applicant?.phoneNumber || item.applicantPhone || '',
          gender: item.applicant?.gender || item.applicantGender || '',
          address: item.applicant?.homeAddress || item.applicantAddress || '',
          education: item.applicantEducation || '',
          skills: item.applicantSkills || '',
          profilePhotoUrl: item.applicant?.profilePhotoUrl || null,
          resumeUrl: item.applicant?.resumeUrl || null,
          jobTitle: item.job?.jobTitle || 'Job Position'
        }
      })}
    >
      <View style={styles.applicantInfoContainer}>
        {item.applicant?.profilePhotoUrl ? (
          <Image 
            source={{ uri: item.applicant.profilePhotoUrl }} 
            style={styles.applicantPhoto} 
          />
        ) : (
          <View style={styles.applicantPhotoPlaceholder}>
            <Icon name="person" size={24} color="#623AA2" />
          </View>
        )}
        
        <View style={styles.applicantDetails}>
          <Text style={styles.applicantName}>
            {item.applicant?.fullName || item.applicantName || 'Applicant'}
          </Text>
          <Text style={styles.jobTitle}>{item.job?.jobTitle || 'Job Position'}</Text>
          <Text style={styles.applicationDate}>
            Applied on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.headerTitle}>JOB APPLICATIONS</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading applications...</Text>
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
          <Text style={styles.headerTitle}>JOB APPLICATIONS</Text>
        </View>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <View style={styles.filterContainer}>
        {renderFilterButton('All')}
        {renderFilterButton('Pending')}
        {renderFilterButton('Accepted')}
        {renderFilterButton('Rejected')}
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color="#F97794" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchApplications()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredApplications()}
          renderItem={renderApplicationItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#623AA2"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="folder-open" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {activeFilter === 'All'
                  ? "You don't have any job applications yet"
                  : `No ${activeFilter.toLowerCase()} applications found`}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
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
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#623AA2',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  applicationItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  applicantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicantPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  applicantPhotoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applicantDetails: {
    flex: 1,
    marginLeft: 15,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  jobTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  applicationDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default ApplicationsScreen;