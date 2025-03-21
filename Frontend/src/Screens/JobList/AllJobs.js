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

const AllJobsScreen = ({ route, navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Map between category IDs from the API and the filter categories
  const categoryMappings = {
    'technology': ['technology', 'tech', '1'],
    'healthcare': ['healthcare', 'health', 'medical', '2'],
    'education': ['education', 'teaching', '3'],
    'agriculture': ['agriculture', 'farming', '4'],
    'financial': ['financial', 'finance', 'banking', '5'],
    'transportation': ['transportation', 'transport', 'logistics', '6', 'transpotation'],
    'construction': ['construction', 'building', '7'],
    'domesticWorks': ['domestic works', 'domestic', '8', 'domesticworks'],
    'others': ['others', 'other', '9']
  };

  // Function to parse salary string to number
  const parseSalary = (salaryString) => {
    // Remove non-numeric characters and convert to number
    const numericSalary = parseFloat(
      salaryString.replace(/[^0-9.-]+/g, '')
    );
    return isNaN(numericSalary) ? 0 : numericSalary;
  };

  // Apply filters to jobs
  const applyFilters = (jobsList, filters) => {
    if (!filters) return jobsList;

    console.log('Applying filters:', filters);
    console.log('Total jobs before filtering:', jobsList.length);

    const filteredJobs = jobsList.filter(job => {
      // Salary range filter
      const salary = parseSalary(job.salary);
      const salaryInRange = 
        salary >= filters.salaryRange.min && 
        salary <= filters.salaryRange.max;

      // Location filter (case-insensitive, partial match)
      const locationMatch = 
        !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());

      // Enhanced category filter
      let categoryMatch = true;
      
      if (filters.categories && filters.categories.length > 0) {
        categoryMatch = filters.categories.some(selectedCategory => {
          // Check if job's category matches any of the acceptable values
          // for the selected category
          const acceptableValues = categoryMappings[selectedCategory.toLowerCase()] || [];
          
          // Check job.category (string) and job.category (ID) formats
          const jobCategoryLower = job.category ? job.category.toString().toLowerCase() : '';
          
          // Debug logging
          console.log(`Job "${job.title}" category: "${jobCategoryLower}", checking against: ${selectedCategory}`);
          
          return acceptableValues.includes(jobCategoryLower);
        });
      }

      const matched = salaryInRange && locationMatch && categoryMatch;
      if (!matched) {
        console.log(`Job "${job.title}" filtered out. Salary match: ${salaryInRange}, Location match: ${locationMatch}, Category match: ${categoryMatch}`);
      }
      
      return matched;
    });

    console.log('Total jobs after filtering:', filteredJobs.length);
    return filteredJobs;
  };

  // Fetch jobs and apply filters
  useEffect(() => {
    const fetchJobsAndApplyFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch jobs from API
        const jobsData = await jobService.getAllJobs();
        
        // Format job data
        const formattedJobs = jobsData.map(job => {
          // Standardize the category format
          let standardizedCategory = job.jobCategory;
          
          // If jobCategory is a numeric ID, try to convert it to a string name
          if (job.jobCategory && !isNaN(job.jobCategory)) {
            // Map from numeric ID to category name
            const categoryMap = {
              '1': 'technology',
              '2': 'healthcare',
              '3': 'education',
              '4': 'agriculture',
              '5': 'financial',
              '6': 'transportation',
              '7': 'construction',
              '8': 'domesticWorks',
              '9': 'others'
            };
            standardizedCategory = categoryMap[job.jobCategory] || job.jobCategory;
          }
          
          return {
            id: job._id,
            title: job.jobTitle,
            company: job.employerName || 'Unknown Company',
            location: job.location,
            description: job.jobDescription.length > 150 
              ? job.jobDescription.substring(0, 150) + '...' 
              : job.jobDescription,
            salary: job.payment,
            createdBy: job.createdBy,
            category: standardizedCategory // Use the standardized category
          };
        });

        // Check if filters were passed
        const { filters } = route.params || {};

        if (filters) {
          console.log('Received filters:', filters);
          const filtered = applyFilters(formattedJobs, filters);
          setFilteredJobs(filtered);
          setIsFiltered(true);
        } else {
          setFilteredJobs(formattedJobs);
          setIsFiltered(false);
        }

        setJobs(formattedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again.');
        
        // Fallback to placeholder data
        const placeholderJobs = [
          {
            id: 'placeholder1',
            title: 'Web Developer',
            company: 'Tech Company',
            location: 'Colombo',
            description: 'Note: This is placeholder data. Backend connection failed.',
            salary: 'LKR 50,000 - 70,000',
            category: 'technology'
          },
          {
            id: 'placeholder2',
            title: 'Nurse',
            company: 'General Hospital',
            location: 'Kandy',
            description: 'Note: This is placeholder data. Backend connection failed.',
            salary: 'LKR 40,000 - 60,000',
            category: 'healthcare'
          }
        ];

        setFilteredJobs(placeholderJobs);
        setJobs(placeholderJobs);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobsAndApplyFilters();
  }, [route.params]);

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

  // Clear filters
  const clearFilters = () => {
    navigation.setParams({ filters: null });
  };

  // Render loading state
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
          <Text style={styles.headerTitle}>
            {isFiltered ? 'FILTERED JOBS' : 'ALL JOBS'}
          </Text>
          <Text style={styles.jobCount}>
            {filteredJobs.length} jobs found
          </Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Error handling */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Jobs List or No Jobs View */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsContainer}
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
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
            <Text style={styles.noJobsText}>
              {isFiltered 
                ? 'No jobs match your filter criteria' 
                : 'No jobs available'}
            </Text>
            {isFiltered && (
              <TouchableOpacity 
                style={styles.clearFilterButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearFilterButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
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
    textAlign: 'center',
  },
  clearFilterButton: {
    backgroundColor: '#623AA2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  clearFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default AllJobsScreen;