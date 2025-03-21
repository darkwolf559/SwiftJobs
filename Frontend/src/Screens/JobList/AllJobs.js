import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { jobService } from '../../services/api'; 

const { width } = Dimensions.get('window');

const AllJobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    fetchAllJobs();
  }, []);

 s
  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      const jobsData = await jobService.getAllJobs();
      
      
      const formattedJobs = jobsData.map(job => ({
        id: job._id,
        title: job.jobTitle,
        company: job.employerName || 'Unknown Company',
        location: job.location,
        description: job.jobDescription.length > 150 
          ? job.jobDescription.substring(0, 150) + '...' 
          : job.jobDescription,
        salary: job.payment,
        createdBy: job.createdBy,
        category: job.jobCategory
      }));
      
      setJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
      
      
      setJobs([
        {
          id: 'placeholder1',
          title: 'Web Developer',
          company: 'Tech Company',
          location: 'Colombo',
          description: 'This is description',
          salary: '$LKR50,000',
          category: '1'
        },
        {
          id: 'placeholder2',
          title: 'Nurse',
          company: 'General Hospital',
          location: 'Kandy',
          description: 'This is description',
          salary: 'LKR40,000',
          category: '2'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  
  const navigateToJobDetails = (job) => {
    navigation.navigate('JobSingle', { 
      jobId: job.id,
      companyInfo: {
        name: job.company,
        location: job.location,
      }
    });
  };

  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient 
          colors={["#623AA2", "#F97794"]} 
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>ALL JOBS</Text>
            <Text style={styles.jobCount}>Loading...</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={["#623AA2", "#F97794"]} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>ALL JOBS</Text>
          <Text style={styles.jobCount}>{jobs.length} jobs found</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

  
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchAllJobs}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

  
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsContainer}
      >
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => navigateToJobDetails(job)}
            >
              <View style={styles.jobHeader}>
                <Image
                  source={require('../../assets/20943599.jpg')}
                  style={styles.companyLogo}
                />
                <View style={styles.jobTitleContainer}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.companyInfo}>
                    {job.company}, {job.location}
                  </Text>
                </View>
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Icon name="bookmark-border" size={24} color="#623AA2" />
                </TouchableOpacity>
              </View>
              <Text style={styles.jobDescription}>{job.description}</Text>
              <View style={styles.jobFooter}>
                <Text style={styles.salary}>{job.salary}</Text>
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={() => navigateToJobDetails(job)}
                >
                  <Text style={styles.applyButtonText}>APPLY</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noJobsContainer}>
            <Icon name="work-off" size={80} color="#ccc" />
            <Text style={styles.noJobsText}>No jobs found</Text>
            <TouchableOpacity 
              style={styles.postJobButton}
              onPress={() => navigation.navigate('JobPostingPage')}
            >
              <Text style={styles.postJobText}>Post a Job</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    width: width,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  jobCount: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
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
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffebee',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#623AA2',
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  jobsContainer: {
    padding: 16,
  },
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
  noJobsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  noJobsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  postJobButton: {
    backgroundColor: '#623AA2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  postJobText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default AllJobsScreen;