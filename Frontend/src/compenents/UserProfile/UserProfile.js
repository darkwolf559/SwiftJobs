import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://192.168.43.152:5000/api';

const UserProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserData(response.data);
      
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
      
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        Alert.alert(
          'Session Expired', 
          'Your session has expired. Please log in again.',
          [{ text: 'OK', onPress: () => handleLogout() }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleOpenResume = async () => {
    if (userData && userData.resumeUrl) {
      try {

        Alert.alert('Resume Available', 
          `Resume "${userData.resumeName}" is available in your profile.`,
          [
            { text: 'OK' }
          ]
        );
      } catch (error) {
        console.error('Error opening resume:', error);
        Alert.alert('Error', 'Could not open resume file');
      }
    } else {
      Alert.alert('No Resume', 'No resume has been uploaded yet');
    }
  };

  // Load user profile on component mount
  useEffect(() => {
    fetchUserProfile();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserProfile();
    });
    
    return unsubscribe;
  }, [navigation]);

  const handleEditPress = () => {
    navigation.navigate('EditProfile', { userData });
  };

  if (loading) {
    return (
      <View style={styles.container}>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#623AA2" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
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
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={70} color="#f97794" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchUserProfile}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
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
        <View style={styles.emptyStateContainer}>
          <Icon name="person-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateText}>No profile data available</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.createProfileButton}
          >
            <Text style={styles.createProfileButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
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
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: handleLogout }
              ]
            );
          }}
        >
          <Icon name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
    
        <View style={styles.profileBannerContainer}>
          <Image 
            source={userData.coverPhotoUrl 
              ? { uri: userData.coverPhotoUrl } 
              : require('../../assets/20943599.jpg')}
            style={styles.profileBanner}
            resizeMode="cover"
          />
          
          <View style={styles.profileInfoCard}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={userData.profilePhotoUrl 
                  ? { uri: userData.profilePhotoUrl } 
                  : require('../../assets/20943599.jpg')}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.fullName || userData.username}</Text>
              <Text style={styles.profileEmail}>{userData.email}</Text>
            </View>
          </View>
        </View>

       
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userData.fullName || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>{userData.username}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{userData.gender || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date Of Birth</Text>
              <Text style={styles.infoValue}>
                {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{userData.phoneNumber || userData.mobileNumber || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </View>
        </View>

    
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCATION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Home Address</Text>
              <Text style={styles.infoValue}>{userData.homeAddress || 'Not provided'}</Text>
            </View>
            
            <View style={styles.horizontalInfoContainer}>
              <View style={[styles.infoItem, styles.horizontalInfoItem]}>
                <Text style={styles.infoLabel}>Country</Text>
                <Text style={styles.infoValue}>{userData.country || 'Not provided'}</Text>
              </View>
              
              <View style={[styles.infoItem, styles.horizontalInfoItem]}>
                <Text style={styles.infoLabel}>Zip Code</Text>
                <Text style={styles.infoValue}>{userData.zipCode || 'Not provided'}</Text>
              </View>
            </View>
          </View>
        </View>

   
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>College</Text>
              <Text style={styles.infoValue}>{userData.college || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>High School Degree</Text>
              <Text style={styles.infoValue}>{userData.highSchool || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Higher Secondary Education</Text>
              <Text style={styles.infoValue}>{userData.higherSecondaryEducation || 'Not provided'}</Text>
            </View>
          </View>
        </View>

        {/* Skills Section */}
        {userData.skills && userData.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.sectionContent}>
              <View style={styles.skillsContainer}>
                {userData.skills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Resume Section */}
        {userData.resumeName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MY RESUME</Text>
            <View style={styles.sectionContent}>
              <View style={styles.resumeContainer}>
                <View style={styles.resumeIconContainer}>
                  <Icon name="document-text" size={32} color="#623AA2" />
                </View>
                <View style={styles.resumeInfo}>
                  <Text style={styles.resumeName}>{userData.resumeName}</Text>
                  <TouchableOpacity 
                    onPress={handleOpenResume}
                    style={styles.viewResumeButton}
                  >
                    <Text style={styles.viewResumeText}>View Resume</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Account Created</Text>
              <Text style={styles.infoValue}>
                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
              </Text>
            </View>
          </View>
        </View>

    
        <View style={styles.editButtonContainer}>
          <TouchableOpacity onPress={handleEditPress}>
            <LinearGradient 
              colors={["#623AA2", "#F97794"]} 
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>EDIT PROFILE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 15 },
  retryButton: { backgroundColor: '#623AA2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontSize: 16 },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyStateText: { fontSize: 16, color: '#666', marginVertical: 15 },
  createProfileButton: { backgroundColor: '#623AA2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  createProfileButtonText: { color: '#fff', fontSize: 16 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  menuButton: { padding: 5 },
  logoutButton: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptySpace: { width: 24 },
  scrollView: { flex: 1 },
  profileBannerContainer: { position: 'relative', marginBottom: 60 },
  profileBanner: { width: '100%', height: 200 },
  profileInfoCard: { position: 'absolute', bottom: -50, left: 20, right: 20, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'row', padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  profileImageContainer: { marginRight: 15 },
  profileImage: { width: 60, height: 60, borderRadius: 10 },
  profileInfo: { justifyContent: 'center' },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  profileEmail: { fontSize: 14, color: '#777', marginTop: 3 },
  section: { marginTop: 15, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  sectionContent: { backgroundColor: '#fff', borderRadius: 10, padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2.22, elevation: 3 },
  infoItem: { marginBottom: 15 },
  infoLabel: { fontSize: 14, color: '#777', marginBottom: 5 },
  infoValue: { fontSize: 16, color: '#333' },
  horizontalInfoContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  horizontalInfoItem: { width: '48%' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  skillChip: { backgroundColor: '#623AA2', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, margin: 5 },
  skillChipText: { color: 'white', fontSize: 14 },
  resumeContainer: { flexDirection: 'row', alignItems: 'center' },
  resumeIconContainer: { marginRight: 15 },
  resumeInfo: { flex: 1 },
  resumeName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  viewResumeButton: { backgroundColor: '#f0f0f0', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, alignSelf: 'flex-start' },
  viewResumeText: { color: '#623AA2', fontSize: 14 },
  editButtonContainer: { paddingHorizontal: 20, paddingVertical: 20, marginBottom: 20 },
  editButton: { borderRadius: 8, padding: 12, alignItems: 'center' },
  editButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});

export default UserProfile;