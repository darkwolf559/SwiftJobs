import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const UserProfile = ({ navigation }) => {
  const userData = {
    fullName: "Mark Gutierrez",
    email: "mail@example.com",
    gender: "Male",
    dateOfBirth: "28 May 1992",
    phoneNumber: "623-466-7667",
    homeAddress: "2750 Cambridge Drive Phoenix",
    country: "Belarus",
    zipCode: "7667",
    education: {
      college: "Public affairs specialist",
      highSchool: "Public affairs specialist",
      higherSecondary: "Public affairs specialist"
    },
    skills: ["PHOTOSHOP", "ILLUSTRATOR", "AFTER EFFECT", "PREMIER PRO", "COREL DRAW", "FRAMES"],
    resume: {
      lastUpdated: "16 June 2021"
    }
  };


  const handleEditPress = () => {
    navigation.navigate('EditProfile', { userData });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={["#623AA2", "#F97794"]} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROFILE</Text>
        <View style={styles.emptySpace} />
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* Profile Banner and Info Card */}
        <View style={styles.profileBannerContainer}>
          <Image 
            source={require('../../assets/20943599.jpg')}
            style={styles.profileBanner}
            resizeMode="cover"
          />
          
          <View style={styles.profileInfoCard}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={require('../../assets/20943599.jpg')}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.fullName}</Text>
              <Text style={styles.profileEmail}>{userData.email}</Text>
            </View>
          </View>
        </View>

        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userData.fullName}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{userData.gender}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date Of Birth</Text>
              <Text style={styles.infoValue}>{userData.dateOfBirth}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCATION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Home Address</Text>
              <Text style={styles.infoValue}>{userData.homeAddress}</Text>
            </View>
            
            <View style={styles.horizontalInfoContainer}>
              <View style={[styles.infoItem, styles.horizontalInfoItem]}>
                <Text style={styles.infoLabel}>Country</Text>
                <Text style={styles.infoValue}>{userData.country}</Text>
              </View>
              
              <View style={[styles.infoItem, styles.horizontalInfoItem]}>
                <Text style={styles.infoLabel}>Zip Code</Text>
                <Text style={styles.infoValue}>{userData.zipCode}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>College</Text>
              <Text style={styles.infoValue}>{userData.education.college}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>High School Degree</Text>
              <Text style={styles.infoValue}>{userData.education.highSchool}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Higher Secondary Education</Text>
              <Text style={styles.infoValue}>{userData.education.higherSecondary}</Text>
            </View>
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          <View style={styles.sectionContent}>
            <View style={styles.skillsContainer}>
              {userData.skills.map((skill, index) => (
                <LinearGradient 
                  key={index}
                  colors={["#623AA2", "#F97794"]} 
                  style={styles.skillItem}
                >
                  <Text style={styles.skillText}>{skill}</Text>
                </LinearGradient>
              ))}
            </View>
          </View>
        </View>

        {/* Resume Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MY RESUME</Text>
          <View style={styles.sectionContent}>
            <View style={styles.resumeContainer}>
              <View style={styles.resumeIcon}>
                <Icon name="document-text" size={24} color="#666" />
              </View>
              <View style={styles.resumeInfo}>
                <Text style={styles.resumeName}>{userData.fullName}</Text>
                <Text style={styles.resumeDate}>Updated on {userData.resume.lastUpdated}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Edit Button */}
        <View style={styles.editButtonContainer}>
           <TouchableOpacity onPress={handleEditPress}>
            <LinearGradient 
              colors={["#623AA2", "#F97794"]} 
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>EDIT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySpace: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  profileBannerContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  profileBanner: {
    width: '100%',
    height: 200,
  },
  profileInfoCard: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
  section: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  horizontalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  horizontalInfoItem: {
    width: '48%',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  skillItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    color: '#fff',
    fontWeight: '500',
  },
  resumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  resumeIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  resumeDate: {
    fontSize: 14,
    color: '#666',
  },
  editButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  editButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: 100,
    alignSelf: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UserProfile;