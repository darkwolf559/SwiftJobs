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
import JobCard from '../../compenents/JobCard';

const { width } = Dimensions.get('window');

const AllJobsScreen = ({ route, navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const categoryMappings = {
    'technology': ['technology', 'tech', '1'],
    'healthcare': ['healthcare', 'health', 'medical', '2'],
    'education': ['education', 'teaching', '3'],
    'agriculture': ['agriculture', 'farming', '4'],
    'financial': ['financial', 'finance', 'banking', '5'],
    'transportation': ['transportation', 'transport', 'logistics', '6', 'transpotation'],
    'construction': ['construction', 'building', '7'],
    'domesticworks': ['domestic works', 'domestic', '8', 'domesticworks'],
    'others': ['others', 'other', '9']
  };

 
  const parseSalary = (salaryString) => {
    if (!salaryString || typeof salaryString !== 'string') {
      return { min: 0, max: 0 };
    }
    

    if (salaryString.includes('-')) {
      const parts = salaryString.split('-');
      
 
      const minValue = parseFloat(parts[0].replace(/[^0-9.]+/g, ''));
      const maxValue = parseFloat(parts[1].replace(/[^0-9.]+/g, ''));
      
      return {
        min: isNaN(minValue) ? 0 : minValue,
        max: isNaN(maxValue) ? 0 : maxValue
      };
    } else {

      const value = parseFloat(salaryString.replace(/[^0-9.]+/g, ''));
      const numericValue = isNaN(value) ? 0 : value;
      return { min: numericValue, max: numericValue };
    }
  };

  const applyFilters = (jobsList, filters) => {

    if (!filters) return jobsList;
    if (!jobsList || jobsList.length === 0) return [];

    const lenientFilters = {
      salaryRange: filters.salaryRange || { min: 0, max: 1000000 },
      categories: filters.categories || [],
      location: filters.location || ''
    };
    

    if (lenientFilters.salaryRange.min === undefined || isNaN(lenientFilters.salaryRange.min)) {
      lenientFilters.salaryRange.min = 0;
    }
    if (lenientFilters.salaryRange.max === undefined || isNaN(lenientFilters.salaryRange.max)) {
      lenientFilters.salaryRange.max = 1000000;
    }
    
    const filteredJobs = jobsList.filter(job => {
      //Salary Filter
      let salaryInRange = true;
      if (lenientFilters.salaryRange && 
          (lenientFilters.salaryRange.min > 0 || lenientFilters.salaryRange.max < 1000000)) {
        
        const parsedSalary = parseSalary(job.salary || '0');
        

        if (parsedSalary.min === 0 && parsedSalary.max === 0) {
          salaryInRange = true;
        } else {
          salaryInRange = (
            (parsedSalary.min >= lenientFilters.salaryRange.min && parsedSalary.min <= lenientFilters.salaryRange.max) ||
            (parsedSalary.max >= lenientFilters.salaryRange.min && parsedSalary.max <= lenientFilters.salaryRange.max) ||
            (parsedSalary.min <= lenientFilters.salaryRange.min && parsedSalary.max >= lenientFilters.salaryRange.max)
          );
        }
      }

      //Location Filter
      let locationMatch = true;
      if (lenientFilters.location && lenientFilters.location.trim() !== '') {
        
        const jobLocation = job.location ? job.location.toString().toLowerCase() : '';
        const filterLocation = lenientFilters.location.toString().toLowerCase();
        
  
        if (!jobLocation) {
          locationMatch = true;
        } else {
          locationMatch = jobLocation.includes(filterLocation);
        }
      }

      //Category Filter
      let categoryMatch = true;
      if (lenientFilters.categories && lenientFilters.categories.length > 0) {
        if (!job.category) {
        
          const hasOthersCategory = lenientFilters.categories.some(
            cat => cat && cat.toLowerCase() === 'others'
          );
          categoryMatch = hasOthersCategory;
        } else {
          categoryMatch = lenientFilters.categories.some(selectedCategory => {
            if (!selectedCategory) return false;
            
            const selectedCategoryLower = selectedCategory.toLowerCase();
          
            const acceptableValues = categoryMappings[selectedCategoryLower] || [];

            const jobCategoryLower = job.category ? job.category.toString().toLowerCase() : '';
            
            if (jobCategoryLower === 'others' || jobCategoryLower === '9') {
              return selectedCategoryLower === 'others';
            }
            
           
            return acceptableValues.some(value => 
              jobCategoryLower.includes(value) || value.includes(jobCategoryLower)
            );
          });
        }
      }

      return salaryInRange && locationMatch && categoryMatch;
    });

    return filteredJobs;
  };

  // Fetch jobs and apply filters
  useEffect(() => {
    const fetchJobsAndApplyFilters = async () => {
      try {
        setLoading(true);
        setError(null);
               
        const jobsData = await jobService.getAllJobs();
        
        const formattedJobs = jobsData.map(job => {
    
          let standardizedCategory = job.jobCategory;
          
          if (job.jobCategory && !isNaN(job.jobCategory)) {
            
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
            description: job.jobDescription && job.jobDescription.length > 150 
              ? job.jobDescription.substring(0, 150) + '...' 
              : job.jobDescription || 'No description available',
            salary: job.payment || 'Not specified',
            createdBy: job.createdBy,
            category: standardizedCategory 
          };
        });

        const { filters } = route.params || {};

        if (filters) {
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
        
        
        const placeholderJobs = [
          {
            id: 'placeholder1',
            title: 'Web Developer',
            company: 'Tech Company',
            location: 'Colombo',
            description: 'This is description',
            salary: 'LKR 50,000 - 70,000',
            category: 'technology'
          },
          {
            id: 'placeholder2',
            title: 'Nurse',
            company: 'General Hospital',
            location: 'Kandy',
            description: 'This is description',
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

<ScrollView 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.jobsContainer}
  >
    {filteredJobs.length > 0 ? (
      filteredJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onPress={() => navigateToJobDetails(job)}
          navigation={navigation}
        />
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