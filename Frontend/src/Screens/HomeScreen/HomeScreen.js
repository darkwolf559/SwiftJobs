import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView,Image } from "react-native";
import React, { useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from "@react-navigation/native";
import TabNavigation from "../../compenents/TabNavigation";
import CustomDrawer from "../../compenents/CustomDrawerContent";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from "react-native-elements";
const { width } = Dimensions.get("window");

const HomeScreen = () => {
  
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Home");
  const [isDrawerVisible, setIsDrawerVisible] = useState (false);

  const categories = [
    {
      id: 1,
      title: 'DEVELOPER',
      Icon: () => <MaterialIcons name="code" size={24} color="#623AA2" />,
      jobs: 8,
    },
    {
      id: 2,
      title: 'TECHNOLOGY',
      Icon: () => <Icon name="laptop-outline" size={24} color="#6F67FE" />,
      jobs: 1020,
    },
    {
      id: 3,
      title: 'ACCOUNTING',
      Icon: () => <MaterialIcons name="trending-up" size={24} color="#6F67FE"/>,
      jobs: 400,
    },
    {
      id: 4,
      title: 'MEDICAL',
      Icon: () => <FontAwesome name="stethoscope" size={24} color="#6F67FE" />,
      jobs: 410,
    },
  ];
  const jobs = [
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
  

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#623AA2", "#F97794"]} style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleDrawer}>
          <Icon name="menu-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>HOME</Text>
        </View>

        
      
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('FilterScreen')} >
          <FontAwesome name="sliders" size={24} color="white" />
        </TouchableOpacity>

      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
     

      <TouchableOpacity 
  style={styles.avatar}
  onPress={() => navigation.navigate('Chatbot')}
>
  <Image 
    source={require('../../assets/bot.png')}
    style={{ width: 160, height: 150 }} 
  />
</TouchableOpacity>

    {renderSectionHeader("ALL CATEGORY", () => navigation.navigate('Categories'))}
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
          <Text style={styles.jobCount}>({category.jobs} jobs)</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>


    {renderSectionHeader("JOBS", () => navigation.navigate('Jobs'))}
    <View style={styles.jobsContainer}>
      {jobs.map((job) => (
        <TouchableOpacity
          key={job.id}
          style={styles.jobCard}
          onPress={() => navigation.navigate('JobSingle', { job })}
        >
          <View style={styles.jobHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
              style={styles.companyLogo}
            />
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company}</Text>
              <Text style={styles.location}>{job.location}</Text>
            </View>
            <TouchableOpacity>
              <MaterialIcons name="bookmark-border" size={24} color="#623AA2" />
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
    </View>

    
    {renderSectionHeader("COMPANIES", () => navigation.navigate('Companies'))}
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.companiesContainer}
    >
      {companies.map((company) => (
        <TouchableOpacity
          key={company.id}
          style={styles.companyCard}
          onPress={() => navigation.navigate('CompanyDetails', { company })}
        >
          <Image 
            source={{ uri: company.logo }}
            style={styles.companyLogo}
            resizeMode="contain"
          />
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.companyJobs}>({company.jobCount} jobs)</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {renderSectionHeader("OUR TESTIMONIALS")}
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

  <TabNavigation 
    activeTab={activeTab}
    onTabPress={handleTabPress}
  />

  <CustomDrawer 
    isVisible={isDrawerVisible}
    onClose={() => setIsDrawerVisible(false)}
    navigation={navigation}
  />
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
    borderRadius: 12,
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
      right:30,
      top:520,
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
});

export default HomeScreen;