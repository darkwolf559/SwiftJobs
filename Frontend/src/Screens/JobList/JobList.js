import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const JobsList = ({ route, navigation }) => {
  const { category } = route.params;

  // Mock data for developer jobs
  const developerJobs = [
    {
      id: 1,
      title: 'Web Designing',
      company: 'Facebook Inc.',
      location: 'Los Angeles, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$50,000 - $70,000 a year',
    },
    {
      id: 2,
      title: 'Projects Designing',
      company: 'Facebook Inc.',
      location: 'Los Angeles, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$50,000 - $70,000 a year',
    },
    {
      id: 3,
      title: 'Product Designing',
      company: 'Facebook Inc.',
      location: 'Los Angeles, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$35,000 - $85,000 a year',
    },
    {
      id: 4,
      title: 'Android Development',
      company: 'Facebook Inc.',
      location: 'Los Angeles, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$35,000 - $85,000 a year',
    },
    {
      id: 5,
      title: 'iOS Development',
      company: 'Facebook Inc.',
      location: 'Los Angeles, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$45,000 - $90,000 a year',
    },
    {
      id: 6,
      title: 'Full Stack Development',
      company: 'Facebook Inc.',
      location: 'Los Angeles, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$60,000 - $100,000 a year',
    },
    {
      id: 7,
      title: 'Backend Development',
      company: 'Facebook Inc.',
      location: 'Los Angeles, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$55,000 - $95,000 a year',
    },
    {
      id: 8,
      title: 'Frontend Development',
      company: 'Facebook Inc.',
      location: 'Los Angeles, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$45,000 - $85,000 a year',
    },
  ];

  // ADDED: Mock data for other job categories
  const technologyJobs = [
    {
      id: 1,
      title: 'IT Support Specialist',
      company: 'Google Inc.',
      location: 'Mountain View, CA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$45,000 - $65,000 a year',
    },
    {
      id: 2,
      title: 'Network Administrator',
      company: 'Microsoft Corp.',
      location: 'Seattle, WA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$55,000 - $80,000 a year',
    },
    // More jobs would go here
  ];

  const accountingJobs = [
    {
      id: 1,
      title: 'Financial Analyst',
      company: 'Amazon Inc.',
      location: 'Seattle, WA',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$60,000 - $85,000 a year',
    },
    {
      id: 2,
      title: 'Tax Accountant',
      company: 'Deloitte',
      location: 'New York, NY',
      description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
      salary: '$65,000 - $90,000 a year',
    },
    // More jobs would go here
  ];

  // ADDED: Function to get jobs based on category ID
  const getJobsForCategory = (categoryId) => {
    switch(categoryId) {
      case 1: // DEVELOPER
        return developerJobs;
      case 2: // TECHNOLOGY
        return technologyJobs;
      case 3: // ACCOUNTING
        return accountingJobs;
      // For other categories, you would add more cases
      default:
        // If category not found, return a modified version of developer jobs
        // This ensures something is displayed even for categories without specific data
        return developerJobs.map(job => ({
          ...job,
          title: job.title.replace('Development', `${category.title.toLowerCase()} specialist`).replace('Designing', `${category.title.toLowerCase()} design`)
        }));
    }
  };

  // ADDED: Get the appropriate jobs for the selected category
  const jobsToShow = getJobsForCategory(category.id);

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
          <Text style={styles.headerTitle}>{category.title} JOBS</Text>
          {/* CHANGED: Display actual number of jobs from jobsToShow */}
          <Text style={styles.jobCount}>{jobsToShow.length} jobs found</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Jobs List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsContainer}
      >
        {/* CHANGED: Map over jobsToShow instead of developerJobs */}
        {jobsToShow.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() => {}}
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
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>APPLY</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
});

export default JobsList;