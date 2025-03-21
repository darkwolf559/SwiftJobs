import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
  ToastAndroid
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { bookmarkService } from '../../services/api';

const { width } = Dimensions.get('window');

const BookmarksScreen = ({ navigation }) => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add this ref to track component mounting state
  const isMounted = useRef(true);

  // Initial loading of bookmarks
  useEffect(() => {
    fetchBookmarks();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Refresh when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookmarks();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchBookmarks = async () => {
    try {
      if (!isMounted.current) return;
      
      setLoading(true);
      setError(null);
      
      const bookmarks = await bookmarkService.getUserBookmarks();
      
      if (!isMounted.current) return;
      
      const formattedJobs = bookmarks.map(bookmark => ({
        id: bookmark.job._id,
        bookmarkId: bookmark._id,
        title: bookmark.job.jobTitle,
        company: bookmark.job.employerName || 'Unknown Company',
        location: bookmark.job.location,
        description: bookmark.job.jobDescription && bookmark.job.jobDescription.length > 150 
          ? bookmark.job.jobDescription.substring(0, 150) + '...' 
          : bookmark.job.jobDescription || 'No description available',
        salary: bookmark.job.payment,
        createdBy: bookmark.job.createdBy,
        bookmarkDate: new Date(bookmark.createdAt).toLocaleDateString()
      }));
      
      setBookmarkedJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      if (isMounted.current) {
        setError('Failed to load bookmarks. Please try again.');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Navigate to Job details screen
  const navigateToJobDetails = (job) => {
    navigation.navigate('JobSingle', { 
      jobId: job.id,
      companyInfo: {
        name: job.company,
        location: job.location,
      }
    });
  };

  // Remove bookmark with safe alert handling
  const removeBookmark = async (jobId) => {
    try {
      await bookmarkService.removeBookmark(jobId);
      
      if (isMounted.current) {
        // Update the local state to remove the job from the list
        setBookmarkedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        
        // Use ToastAndroid instead of Alert for safer notification
        ToastAndroid.show("Job removed from bookmarks", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      if (isMounted.current) {
        // Use ToastAndroid instead of Alert for safer notification
        ToastAndroid.show("Failed to remove bookmark", ToastAndroid.SHORT);
      }
    }
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
            <Text style={styles.headerTitle}>MY BOOKMARKS</Text>
          </View>
          <View style={{width: 24, opacity: 0}} />
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading bookmarks...</Text>
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
          <Text style={styles.headerTitle}>MY BOOKMARKS</Text>
          <Text style={styles.jobCount}>
            {bookmarkedJobs.length} saved jobs
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={fetchBookmarks}
        >
          <Icon name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Error handling */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchBookmarks}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Jobs List or No Jobs View */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsContainer}
      >
        {bookmarkedJobs.length > 0 ? (
          bookmarkedJobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
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
                  <Text style={styles.bookmarkDate}>
                    Saved on: {job.bookmarkDate}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.bookmarkButton}
                  onPress={() => removeBookmark(job.id)}
                >
                  <Icon name="bookmark" size={24} color="#623AA2" />
                </TouchableOpacity>
              </View>
              <Text style={styles.jobDescription}>{job.description}</Text>
              <View style={styles.jobFooter}>
                <Text style={styles.salary}>{job.salary}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeBookmark(job.id)}
                  >
                    <Text style={styles.removeButtonText}>REMOVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => navigateToJobDetails(job)}
                  >
                    <Text style={styles.viewButtonText}>VIEW JOB</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noJobsContainer}>
            <Icon name="bookmark-border" size={80} color="#ccc" />
            <Text style={styles.noJobsText}>No bookmarked jobs</Text>
            <Text style={styles.noJobsSubText}>
              Jobs you bookmark will appear here
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('AllJobsScreen')}
            >
              <Text style={styles.browseButtonText}>Browse Jobs</Text>
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
  retryButtonText: {
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
  bookmarkDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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
  buttonContainer: {
    flexDirection: 'row',
  },
  removeButton: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#623AA2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
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
    marginBottom: 8,
    textAlign: 'center',
  },
  noJobsSubText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#623AA2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default BookmarksScreen;