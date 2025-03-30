import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
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

  // Improved salary parsing function
  const parseSalary = (salaryString) => {
    // If salary is not specified or invalid, return default values
    if (!salaryString || typeof salaryString !== 'string' || 
        salaryString.toLowerCase().includes('not specified') ||
        salaryString.toLowerCase().includes('negotiable')) {
      return { min: 0, max: 0 };
    }
    
    // Clean the string and extract all numbers
    const cleanSalary = salaryString.replace(/[^\d,.]/g, ' ');
    const numbers = cleanSalary.match(/\d[\d,]*(\.\d+)?/g);
    
    if (!numbers || numbers.length === 0) {
      return { min: 0, max: 0 };
    }
    
    // Parse the numbers by removing commas
    const parsedNumbers = numbers.map(num => parseFloat(num.replace(/,/g, '')));
    
    // Sort the numbers to ensure min is the smallest and max is the largest
    parsedNumbers.sort((a, b) => a - b);
    
    // If there's only one number, use it for both min and max
    if (parsedNumbers.length === 1) {
      return { min: parsedNumbers[0], max: parsedNumbers[0] };
    }
    
    // Get the min and max from the array
    const min = parsedNumbers[0];
    const max = parsedNumbers[parsedNumbers.length - 1];
    
    return { min, max };
  };

  // Improved filtering function
  const filterJobs = (jobs, filters) => {
    if (!filters || !jobs || jobs.length === 0) {
      return jobs;
    }
    
    return jobs.filter(job => {
      // 1. Salary filtering
      let salaryMatches = true;
      if (filters.salaryRange && (filters.salaryRange.min > 0 || filters.salaryRange.max < 500000)) {
        const parsedSalary = parseSalary(job.salary);
        
        // For debugging
        console.log(`Job: ${job.title}, Salary: ${job.salary}`);
        console.log(`Parsed: min=${parsedSalary.min}, max=${parsedSalary.max}`);
        console.log(`Filter: min=${filters.salaryRange.min}, max=${filters.salaryRange.max}`);
        
        // Logic for salary matching:
        
        // Case 1: Job has unspecified salary (min=0, max=0)
        if (parsedSalary.min === 0 && parsedSalary.max === 0) {
          // Consider unspecified salaries as matching only if filter min is 0
          salaryMatches = filters.salaryRange.min === 0;
        } 
        // Case 2: Check if ranges overlap
        else {
          // Check if the ranges overlap
          // (filter min <= job max) AND (filter max >= job min)
          salaryMatches = (
            filters.salaryRange.min <= parsedSalary.max && 
            filters.salaryRange.max >= parsedSalary.min
          );
        }
        
        console.log(`Salary matches: ${salaryMatches}`);
      }
      
      // 2. Location filtering
      let locationMatches = true;
      if (filters.location && filters.location.trim() !== '') {
        const jobLocation = (job.location || '').toLowerCase();
        const filterLocation = filters.location.toLowerCase();
        locationMatches = jobLocation.includes(filterLocation);
      }
      
      // 3. Category filtering
      let categoryMatches = true;
      if (filters.categories && filters.categories.length > 0) {
        if (!job.category) {
          // If job has no category and "others" is selected
          categoryMatches = filters.categories.some(cat => 
            cat.toLowerCase() === 'others'
          );
        } else {
          categoryMatches = filters.categories.some(selectedCategory => {
            const selectedCategoryLower = selectedCategory.toLowerCase();
            const acceptableValues = categoryMappings[selectedCategoryLower] || [];
            const jobCategoryLower = (job.category || '').toLowerCase();
            
            return acceptableValues.some(value => 
              jobCategoryLower.includes(value) || value.includes(jobCategoryLower)
            );
          });
        }
      }
      
      return salaryMatches && locationMatches && categoryMatches;
    });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
               
        const jobsData = await jobService.getAllJobs();
        
        // Format the jobs data
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
        
        setJobs(formattedJobs);
        
        // Get filters from route params
        const { filters } = route.params || {};
        
        if (filters) {
          console.log('Applying filters:', JSON.stringify(filters));
          
          // Filter the jobs
          const filtered = filterJobs(formattedJobs, filters);
          console.log(`Filtered ${filtered.length} out of ${formattedJobs.length} jobs`);
          
          setFilteredJobs(filtered);
          setIsFiltered(true);
        } else {
          setFilteredJobs(formattedJobs);
          setIsFiltered(false);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again.');
        
        // Fallback to placeholder data for demo/testing
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
    
    fetchJobs();
  }, [route.params]);

  const navigateToJobDetails = (job) => {
    navigation.navigate('JobSingle', { 
      jobId: job.id,
      companyInfo: {
        name: job.company,
        location: job.location,
      }
    });
  };

  const clearFilters = () => {
    navigation.setParams({ filters: null });
  };

  const navigateToFilter = () => {
    navigation.navigate('FilterScreen');
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
          <TouchableOpacity style={styles.iconButton} onPress={navigateToFilter}>
            <Icon name="filter-list" size={24} color="white" />
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
        <TouchableOpacity style={styles.iconButton} onPress={navigateToFilter}>
          <Icon name="filter-list" size={24} color="white" />
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

      {isFiltered && (
        <View style={styles.filterBanner}>
          <Text style={styles.filterBannerText}>Showing filtered results</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFilterText}>Clear Filters</Text>
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
  filterBanner: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterBannerText: {
    color: '#1976d2',
    fontSize: 14,
  },
  clearFilterText: {
    color: '#623AA2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  jobsContainer: {
    padding: 16,
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