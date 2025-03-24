import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const CompanyScreen = ({ navigation }) => {
  const [companies] = useState([
    { 
      id: 1, 
      name: "PICOE LTD.", 
      logo: require('../../assets/20943599.jpg'), 
      jobCount: 1 
    },
    { 
      id: 2, 
      name: "CHOE LTD.", 
      logo: require('../../assets/20943599.jpg'), 
      jobCount: 14 
    },
    { 
      id: 3, 
      name: "COMPANY LTD.", 
      logo: require('../../assets/20943599.jpg'), 
      jobCount: 10 
    },
    { 
      id: 4, 
      name: "GIOEW LTD.", 
      logo: require('../../assets/20943599.jpg'), 
      jobCount: 23 
    },
    { 
      id: 5, 
      name: "KIEE LTD.", 
      logo: require('../../assets/20943599.jpg'), 
      jobCount: 50 
    },
    { 
      id: 6, 
      name: "BIROC LTD.", 
      logo: require('../../assets/20943599.jpg'), 
      jobCount: 20 
    },
    { 
      id: 7, 
      name: "DOBS LTD.", 
      logo: require('../../assets/20943599.jpg'), 
      jobCount: 880 
    },
    { 
      id: 8, 
      name: "REYES LTD.", 
      logo: require('../../assets/20943599.jpg'), 
      jobCount: 30 
    }
  ]);

  const handleCompanyPress = (company) => {
    navigation.navigate('Company', { company });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={["#623AA2", "#F97794"]} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>COMPANIES</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Companies Grid */}
      <ScrollView 
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {companies.map((company) => (
          <TouchableOpacity 
            key={company.id} 
            style={styles.companyCard}
            onPress={() => handleCompanyPress(company)}
          >
            <View style={styles.companyLogoContainer}>
              <Image 
                source={company.logo} 
                style={styles.companyLogo} 
                resizeMode="contain"
              />
            </View>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.jobCount}>({company.jobCount} jobs)</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 10,
  },
  searchButton: {
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  companyCard: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  companyLogoContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  companyLogo: {
    width: '100%',
    height: '100%',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  jobCount: {
    fontSize: 14,
    color: '#666',
  }
});

export default CompanyScreen;