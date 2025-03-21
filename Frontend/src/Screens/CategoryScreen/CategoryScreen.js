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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import { jobService } from '../../services/api'; 

const { width } = Dimensions.get('window');

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const baseCategories = [
    {
      id: '1',
      title: 'TECHNOLOGY',
      Icon: () => <Icon name="computer" size={24} color="#6F67FE" />,
      jobs: 0,
    },
    {
      id: '2',
      title: 'HEALTHCARE',
      Icon: () => <FontAwesomeIcon name="stethoscope" size={24} color="#6F67FE" />,
      jobs: 0,
    },
    {
      id: '3',
      title: 'EDUCATION',
      Icon: () => <Icon name="school" size={24} color="#6F67FE"/>,
      jobs: 0,
    },
    {
      id: '4',
      title: 'AGRICULTURE',
      Icon: () => <FontAwesomeIcon name="tractor" size={24} color="#6F67FE" />,
      jobs: 0,
    },
    {
      id: '5',
      title: 'FINANCIAL',
      Icon: () => <FontAwesomeIcon name="chart-line" size={24} color="#6F67FE"/>,
      jobs: 0,
    },
    {
      id: '6',
      title: 'TRANSPOTATION',
      Icon: () => <FontAwesomeIcon name="truck" size={24} color="#6F67FE"/>,
      jobs: 0,
    },
    {
      id: '7',
      title: 'CONSTRUCTION',
      Icon: () => <FontAwesomeIcon name="hard-hat" size={24} color="#6F67FE" />,
      jobs: 0,
    },
    {
      id: '8',
      title: 'DOMESTIC WORKS',
      Icon: () => <FontAwesomeIcon name="home" size={24} color="#6F67FE" />,
      jobs: 0,
    },
    {
      id: '9',
      title: 'OTHERS',
      Icon: () => <Icon name="my-library-add" size={24} color="#6F67FE" />,
      jobs: 0,
    },
  ];

  
  useEffect(() => {
    fetchJobCounts();
  }, []);

  
  const fetchJobCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      const jobsData = await jobService.getAllJobs();
      
     
      const categoryCounts = {};
      jobsData.forEach(job => {
        const categoryId = job.jobCategory;
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      });
      
      
      const updatedCategories = baseCategories.map(category => ({
        ...category,
        jobs: categoryCounts[category.id] || 0
      }));
      
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error fetching job counts:', error);
      setError('Failed to load categories. Please try again.');
      setCategories(baseCategories); 
    } finally {
      setLoading(false);
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
            <Text style={styles.headerTitle}>CATEGORIES</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading categories...</Text>
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
          <Text style={styles.headerTitle}>CATEGORIES</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Error message if needed */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchJobCounts}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Categories Grid */}
      <ScrollView 
        contentContainerStyle={styles.categoriesGrid}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('JobsList', { category })}
          >
            <View style={styles.categoryContent}>
              <View style={styles.iconContainer}>
                {category.Icon()}
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.jobCount}>({category.jobs} jobs)</Text>
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
  headerTitle: {
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(98, 58, 162, 0.1)",
  },
  categoryTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  jobCount: {
    color: '#9E9E9E',
    fontSize: 14,
    marginTop: 4,
  },
});

export default CategoryScreen;