import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/constants';

const AppliedJobsScreen = () => {
  const navigation = useNavigation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('You need to be logged in to view your applications');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/applications/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load your applications');
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
    switch (status.toLowerCase()) {
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

  const renderApplicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.applicationItem}
      onPress={() => navigation.navigate('ApplicationDetails', { applicationId: item._id })}
    >
      <View style={styles.applicationContent}>
        <Text style={styles.jobTitle}>{item.job.jobTitle}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Icon name="business" size={16} color="#666" />
            <Text style={styles.metaText}>{item.job.employerName || 'Unknown Company'}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Icon name="category" size={16} color="#666" />
            <Text style={styles.metaText}>
              {getCategoryName(item.job.jobCategory) || 'Uncategorized'}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Icon name="location-on" size={16} color="#666" />
            <Text style={styles.metaText}>{item.job.location || 'Location not specified'}</Text>
          </View>
        </View>
        
        <View style={styles.dateStatusContainer}>
          <Text style={styles.applicationDate}>
            Applied on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.headerTitle}>APPLIED JOBS</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading your applications...</Text>
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
          <Text style={styles.headerTitle}>APPLIED JOBS</Text>
        </View>
        <View style={styles.placeholder} />
      </LinearGradient>
      
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
          data={applications}
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
              <Icon name="work-off" size={64} color="#ccc" />
              <Text style={styles.emptyText}>You haven't applied to any jobs yet</Text>
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
  applicationContent: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  metaContainer: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  dateStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  applicationDate: {
    fontSize: 13,
    color: '#888',
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

export default AppliedJobsScreen;