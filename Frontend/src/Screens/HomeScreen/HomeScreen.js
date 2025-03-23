import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image, ActivityIndicator,Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from "@react-navigation/native";
import TabNavigation from "../../compenents/TabNavigation";
import CustomDrawer from "../../compenents/CustomDrawerContent";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { jobService } from '../../services/api'; 
import ImageCarousel from "./MovingImages";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import JobCard from "../../compenents/JobCard";
import NotificationIcon from "../../compenents/NotificationIcon";
const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(true);

  
  const categories = [
    {
      id: '1',
      title: 'TECHNOLOGY',
      Icon: () => <MaterialIcons name="computer" size={24} color="#6F67FE" />,
      jobs: 0,
    },
    {
      id: '2',
      title: 'HEALTHCARE',
      Icon: () => <FontAwesome5Icon name="stethoscope" size={24} color="#6F67FE" />,
      jobs: 0,
    },
    {
      id: '3',
      title: 'EDUCATION',
      Icon: () => <MaterialIcons name="school" size={24} color="#6F67FE" />,
      jobs: 0,
    },
    {
      id: '4',
      title: 'AGRICULTURE',
      Icon: () => <FontAwesome5Icon name="tractor" size={24} color="#6F67FE" />,
      jobs: 0,
    },
  ];

  const companies = [
    { 
      id: 1, 
      name: "PICOE LTD.", 
      logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", 
      jobCount: 11 
    },
    { 
      id: 2, 
      name: "CHOE LTD.", 
      logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", 
      jobCount: 14 
    },
    { 
      id: 3, 
      name: "COMPANY LTD.", 
      logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", 
      jobCount: 10 
    },
    { 
      id: 4, 
      name: "GIOEW LTD.", 
      logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80", 
      jobCount: 23 
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Michael Linville',
      role: 'Support Manager',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.',
    },
    {
      id: 2,
      name: 'David Cooper',
      role: 'UI Designer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.',
    },
  ];

  
  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
      fetchCategoryCounts();
    }, [])
  );

  
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const jobsData = await jobService.getAllJobs();
      
      
      const randomizedJobs = jobsData
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 2); 
      
      
      const formattedJobs = randomizedJobs.map(job => ({
        id: job._id,
        title: job.jobTitle,
        company: job.employerName || 'Unknown Company',
        location: job.location,
        description: job.jobDescription.length > 150 
          ? job.jobDescription.substring(0, 150) + '...' 
          : job.jobDescription,
        salary: job.payment,
      }));
      
      setFeaturedJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      
      
      setFeaturedJobs([
        {
          id: 'placeholder1',
          title: 'Web Designing',
          company: 'Facebook Inc.',
          location: 'Los Angeles, CA',
          description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
          salary: '$50,000 - $70,000 a year',
        },
        {
          id: 'placeholder2',
          title: 'Projects Designing',
          company: 'Facebook Inc.',
          location: 'Los Angeles, CA',
          description: 'It is a long established fact that a reader will be distracted by content of a page when looking at its layout...',
          salary: '$50,000 - $70,000 a year',
        },
      ]);
    } finally {
      setLoadingJobs(false);
    }
  };

  
  const fetchCategoryCounts = async () => {
    try {
      setLoadingCategories(true);
      
      
      const jobsData = await jobService.getAllJobs();
      
      // Calculate job counts for each category
      const counts = {};
      jobsData.forEach(job => {
        const categoryId = job.jobCategory;
        counts[categoryId] = (counts[categoryId] || 0) + 1;
      });
      
      setCategoryCounts(counts);
    } catch (error) {
      console.error('Error fetching category counts:', error);
      
      setCategoryCounts({});
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };
  
  const renderSectionHeader = (title, onSeeAll) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );
  
  
  const navigateToJobDetails = (job) => {
    navigation.navigate('JobSingle', { 
      jobId: job.id,
      companyInfo: {
        name: job.company,
        location: job.location,
      }
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#623AA2", "#F97794"]} style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleDrawer}>
          <Icon name="menu-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>HOME</Text>
        </View>

        <View style={styles.headerRight}>
       <NotificationIcon /> 
       <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('FilterScreen')}>
      <FontAwesome name="sliders" size={24} color="white" />
       </TouchableOpacity>
       </View>
      </LinearGradient>

      <ScrollView>
      <ImageCarousel/>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      
        {renderSectionHeader("ALL CATEGORY", () => navigation.navigate('CategoryScreen'))}
        {loadingCategories ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#623AA2" />
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('JobsList', { category })}
              >
                <View style={styles.categoryIcon}>
                  {category.Icon()}
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.jobCount}>({categoryCounts[category.id] || 0} jobs)</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

{renderSectionHeader("JOBS", () => navigation.navigate('AllJobsScreen'))}
  {loadingJobs ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="#623AA2" />
    </View>
  ) : (
    <View style={styles.jobsContainer}>
      {featuredJobs.length > 0 ? (
        featuredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onPress={() => navigateToJobDetails(job)}
            navigation={navigation}
          />
        ))
      ) : (
        <View style={styles.noJobsContainer}>
          <Text style={styles.noJobsText}>No jobs available yet</Text>
          <TouchableOpacity 
            style={styles.postJobButton}
            onPress={() => navigation.navigate('JobPosting')}
          >
            <Text style={styles.postJobButtonText}>Post a Job</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )}



       {renderSectionHeader("OUR TESTIMONIALS", () => navigation.navigate('TestimonialsScreen'))}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.testimonialsContainer}
        >
          {testimonials.map((testimonial) => (
            <View key={testimonial.id} style={styles.testimonialCard}>
              <Image 
                source={{ uri: testimonial.image }}
                style={styles.testimonialImage}
              />
              <Text style={styles.testimonialName}>{testimonial.name}</Text>
              <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              <Text style={styles.testimonialText}>{testimonial.text}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      </ScrollView>

      <CustomDrawer 
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        navigation={navigation}
      />

      <TouchableOpacity 
        style={styles.avatar}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Image 
          source={require('../../assets/bot.png')}
          style={{ width: 160, height: 150 }} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    width: width,
    height: 60,
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
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    color: '#623AA2',
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginRight: 12,
    width: 150,
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(98, 58, 162, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  jobCount: {
    fontSize: 12,
    color: '#666',
  },
  jobsContainer: {
    marginBottom: 24,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
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
    borderRadius: 25,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#623AA2',
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
  companiesContainer: {
    marginBottom: 24,
  },
  companyCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  companyJobs: {
    fontSize: 12,
    color: '#666',
  },
  testimonialsContainer: {
    marginBottom: 24,
  },
  testimonialCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 280,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    position: 'absolute',
    right: 30,
    bottom: 80, 
    zIndex: 999, 
    elevation: 1000,  
    width: 70,
    height: 70,
    borderRadius: 35, 
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  testimonialImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  testimonialRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  testimonialText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },

  noJobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noJobsText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  postJobButton: {
    backgroundColor: '#623AA2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  postJobText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default HomeScreen;