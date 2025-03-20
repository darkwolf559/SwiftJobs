import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';

const { width } = Dimensions.get('window');

const CategoryScreen = ({ navigation }) => {
  const categories = [
    {
      id: 1,
      title: 'TECHNOLOGY',
      Icon: () => <Icon name="code" size={24} color="#623AA2" />,
      jobs: 680,
    },
    {
      id: 2,
      title: 'HEALTHCARE',
      Icon: () => <IoniconsIcon name="laptop-outline" size={24} color="#6F67FE" />,
      jobs: 1020,
    },
    {
      id: 3,
      title: 'EDUCATION',
      Icon: () => <Icon name="trending-up" size={24} color="#6F67FE"/>,
      jobs: 400,
    },
    {
      id: 4,
      title: 'AGRICULTURE',
      Icon: () => <FontAwesomeIcon name="stethoscope" size={24} color="#6F67FE" />,
      jobs: 410,
    },
    {
      id: 5,
      title: 'FINANCIAL',
      Icon: () => <FoundationIcon name="home" size={24} color="#6F67FE"/>,
      jobs: 2000,
    },
    {
      id: 6,
      title: 'TRANSPOTATION',
      Icon: () => <FontAwesomeIcon name="pen-nib" size={24} color="#6F67FE"/>,
      jobs: 500,
    },
    {
      id: 7,
      title: 'CONSTRUCTION',
      Icon: () => <FontAwesomeIcon name="utensils" size={24} color="#6F67FE" />,
      jobs: 880,
    },
    {
      id: 8,
      title: 'DOMESTIC WORKS',
      Icon: () => <Icon name="article" size={24} color="#6F67FE" />,
      jobs: 680,
    },
    {
      id: 8,
      title: 'OTHERS',
      Icon: () => <Icon name="article" size={24} color="#6F67FE" />,
      jobs: 680,
    },
  ];

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