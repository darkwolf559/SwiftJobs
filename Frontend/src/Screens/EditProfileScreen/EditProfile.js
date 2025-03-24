import React, { useState } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,TextInput,Image,ActivityIndicator,Alert,Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import ImageResizer from 'react-native-image-resizer';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {API_URL} from '../../config/constants';


const EditProfile = ({ navigation, route }) => {
  const [userData, setUserData] = useState(route.params?.userData || {});
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageBase64, setProfileImageBase64] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageBase64, setCoverImageBase64] = useState(null);
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeBase64, setResumeBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  

  const [dateOfBirth, setDateOfBirth] = useState(
    userData.dateOfBirth ? new Date(userData.dateOfBirth) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);


  const processImage = async (uri) => {
    try {
 
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        600, 
        600, 
        'JPEG',
        60, 
        0,
        null, 
        false 
      );

      const base64 = await convertImageToBase64(resizedImage.uri);
      return {
        uri: resizedImage.uri,
        base64: base64
      };
    } catch (error) {
      console.error('Error processing image:', error);
      return { uri: uri, base64: null };
    }
  };

  // Function to convert image to base64
  const convertImageToBase64 = async (uri) => {
    try {
      const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
      
  
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          const reader = new FileReader();
          reader.onloadend = function() {
            resolve(reader.result);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  const fileToBase64 = async (uri, type) => {
    try {
      const base64Data = await RNFS.readFile(uri, 'base64');
      return `data:${type};base64,${base64Data}`;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      return null;
    }
  };

  const handleProfileImagePick = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.6,
      includeBase64: false,
    };

    try {
      const result = await launchImageLibrary(options);
      
      if (!result.didCancel && result.assets?.[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        

        const processedImage = await processImage(imageUri);
        setProfileImageBase64(processedImage.base64);
      }
    } catch (error) {
      console.error('Error picking profile image:', error);
      Alert.alert('Error', 'There was a problem selecting the image.');
    }
  };

  const handleCoverImagePick = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.6,
      includeBase64: false,
    };

    try {
      const result = await launchImageLibrary(options);
      
      if (!result.didCancel && result.assets?.[0]) {
        const imageUri = result.assets[0].uri;
        setCoverImage(imageUri);
        
        const processedImage = await processImage(imageUri);
        setCoverImageBase64(processedImage.base64);
      }
    } catch (error) {
      console.error('Error picking cover image:', error);
      Alert.alert('Error', 'There was a problem selecting the image.');
    }
  };

  const handleResumePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      
      const file = result[0];
      setResumeFile(file);
      
      try {
        const base64Data = await fileToBase64(file.uri, file.type);
        setResumeBase64(base64Data);
      } catch (error) {
        console.error('Error converting resume to base64:', error);
        Alert.alert('Error', 'There was a problem processing the resume file.');
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'There was a problem selecting the resume file.');
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setUpdateProgress(0);
      
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Error', 'You need to be logged in');
        navigation.navigate('Login');
        return;
      }

      setUpdateProgress(10);
      const basicData = {
        fullName: userData.fullName,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        homeAddress: userData.homeAddress,
        country: userData.country,
        zipCode: userData.zipCode,
        college: userData.college,
        highSchool: userData.highSchool,
        higherSecondaryEducation: userData.higherSecondaryEducation,
        skills: skills
      };
      
      if (dateOfBirth) {
        basicData.dateOfBirth = dateOfBirth.toISOString();
      }
      
      console.log('Updating basic profile data');
      await axios.put(`${API_URL}/profile`, basicData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000 
      });
      
      setUpdateProgress(30);
      
      if (resumeBase64 && resumeFile) {
        console.log('Updating resume');
        const resumeData = {
          resumeBase64: resumeBase64,
          resumeType: resumeFile.type,
          resumeName: resumeFile.name
        };
        
        await axios.put(`${API_URL}/profile/resume`, resumeData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000
        });
      }
      
      setUpdateProgress(50);
      
      if (profileImageBase64) {
        console.log('Updating profile photo');
        const profilePhotoData = {
          profilePhotoBase64: profileImageBase64,
          profilePhotoType: 'image/jpeg'
        };
        
        await axios.put(`${API_URL}/profile/profile-photo`, profilePhotoData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        });
      }
      
      setUpdateProgress(75);
      
      if (coverImageBase64) {
        console.log('Updating cover photo');
        const coverPhotoData = {
          coverPhotoBase64: coverImageBase64,
          coverPhotoType: 'image/jpeg'
        };
        
        await axios.put(`${API_URL}/profile/cover-photo`, coverPhotoData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        });
      }
      
      setUpdateProgress(90);
      
      console.log('Fetching updated user data');
      const finalUserResponse = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await AsyncStorage.setItem('userData', JSON.stringify(finalUserResponse.data));
      
      setUpdateProgress(100);
      
      Alert.alert('Success', 'Profile updated successfully');
      
      // Navigate back to profile screen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response) {
        Alert.alert('Update Failed', error.response.data.message || 'Failed to update profile');
      } else if (error.request) {
        Alert.alert('Network Error', 'Could not connect to the server. Check your internet connection or try again later.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setUpdateProgress(0);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim().toUpperCase()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
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
        <Text style={styles.headerTitle}>EDIT PROFILE</Text>
        <View style={styles.emptySpace} />
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* Cover Photo Section */}
        <View style={styles.coverPhotoContainer}>
          <Image 
            source={coverImage 
              ? { uri: coverImage } 
              : userData.coverPhotoUrl 
                ? { uri: userData.coverPhotoUrl } 
                : require('../../assets/20943599.jpg')}
            style={styles.coverPhoto}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.coverPhotoOverlay}
            onPress={handleCoverImagePick}
          >
            <View style={styles.coverCameraContainer}>
              <Icon name="camera" size={24} color="white" />
              <Text style={styles.coverPhotoText}>Change Cover Photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Info Card */}
        <View style={styles.profileInfoCard}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleProfileImagePick}
          >
            <Image 
              source={profileImage 
                ? { uri: profileImage } 
                : userData.profilePhotoUrl 
                  ? { uri: userData.profilePhotoUrl } 
                  : require('../../assets/20943599.jpg')}
              style={styles.profileImage}
            />
            <View style={styles.editProfilePhotoButton}>
              <Icon name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.fullName || userData.username}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={userData.fullName}
              onChangeText={(text) => setUserData({ ...userData, fullName: text })}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity 
                style={[
                  styles.genderOption,
                  userData.gender === 'Male' && styles.genderSelected
                ]}
                onPress={() => setUserData({ ...userData, gender: 'Male' })}
              >
                <Text style={[
                  styles.genderText,
                  userData.gender === 'Male' && styles.genderTextSelected
                ]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.genderOption,
                  userData.gender === 'Female' && styles.genderSelected
                ]}
                onPress={() => setUserData({ ...userData, gender: 'Female' })}
              >
                <Text style={[
                  styles.genderText,
                  userData.gender === 'Female' && styles.genderTextSelected
                ]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Select Date of Birth'}
              </Text>
              <Icon name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()} 
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={userData.phoneNumber}
              onChangeText={(text) => setUserData({ ...userData, phoneNumber: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCATION</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Home Address</Text>
            <TextInput
              style={styles.input}
              value={userData.homeAddress}
              onChangeText={(text) => setUserData({ ...userData, homeAddress: text })}
              placeholder="Enter your home address"
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={userData.country}
                onChangeText={(text) => setUserData({ ...userData, country: text })}
                placeholder="Country"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Zip Code</Text>
              <TextInput
                style={styles.input}
                value={userData.zipCode}
                onChangeText={(text) => setUserData({ ...userData, zipCode: text })}
                placeholder="Zip Code"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>College</Text>
            <TextInput
              style={styles.input}
              value={userData.college}
              onChangeText={(text) => setUserData({
                ...userData,
                college: text
              })}
              placeholder="Enter your college"
            />

            <Text style={styles.label}>High School</Text>
            <TextInput
              style={styles.input}
              value={userData.highSchool}
              onChangeText={(text) => setUserData({
                ...userData,
                highSchool: text
              })}
              placeholder="Enter your high school degree"
            />

            <Text style={styles.label}>Higher Secondary Education</Text>
            <TextInput
              style={styles.input}
              value={userData.higherSecondaryEducation}
              onChangeText={(text) => setUserData({
                ...userData,
                higherSecondaryEducation: text
              })}
              placeholder="Enter your higher secondary education"
            />
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <TouchableOpacity
                key={index}
                style={styles.skillChip}
                onPress={() => handleRemoveSkill(skill)}
              >
                <Text style={styles.skillChipText}>{skill}</Text>
                <Icon name="close" size={16} color="white" style={styles.skillChipIcon} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.addSkillContainer}>
            <TextInput
              style={styles.skillInput}
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="Type and Enter"
              onSubmitEditing={handleAddSkill}
            />
            <TouchableOpacity
              style={styles.addSkillButton}
              onPress={handleAddSkill}
            >
              <Icon name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resume */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MY RESUME</Text>
          <TouchableOpacity 
            style={styles.resumeUploadContainer}
            onPress={handleResumePick}
          >
            <Icon name="add" size={24} color="#666" />
            <View style={styles.resumeTextContainer}>
              <Text style={styles.resumeUploadText}>Attach File From Phone</Text>
              <Text style={styles.resumeFormats}>.pdf .doc .txt .cdr .rtf accepted</Text>
            </View>
          </TouchableOpacity>
          {resumeFile && (
            <Text style={styles.selectedFile}>
              Selected: {resumeFile.name}
            </Text>
          )}
          {userData.resumeName && !resumeFile && (
            <Text style={styles.selectedFile}>
              Current Resume: {userData.resumeName}
            </Text>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity 
           style={styles.saveButton}
           onPress={handleSave}
           disabled={isLoading}
        >
          <LinearGradient
             colors={["#623AA2", "#F97794"]}
             style={styles.saveButtonGradient}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.saveButtonText}>
                  Updating ({updateProgress}%)
                </Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>SAVE</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  backButton: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptySpace: { width: 24 },
  scrollView: { flex: 1 },
  coverPhotoContainer: { position: 'relative', height: 200 },
  coverPhoto: { width: '100%', height: '100%' },
  coverPhotoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  coverCameraContainer: { alignItems: 'center', justifyContent: 'center' },
  coverPhotoText: { color: 'white', marginTop: 8, fontSize: 16, fontWeight: '500' },
  profileInfoCard: { marginTop: -50, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'row', padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  profileImageContainer: { position: 'relative', marginRight: 15 },
  profileImage: { width: 60, height: 60, borderRadius: 10 },
  editProfilePhotoButton: { position: 'absolute', right: -5, bottom: -5, backgroundColor: '#623AA2', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  profileInfo: { justifyContent: 'center' },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  profileEmail: { fontSize: 14, color: '#777', marginTop: 3 },
  section: { marginTop: 15, padding: 15, backgroundColor: 'white', marginBottom: 15, borderRadius: 10, marginHorizontal: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16 },
  genderContainer: { flexDirection: 'row', marginTop: 5 },
  genderOption: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 10, alignItems: 'center' },
  genderSelected: { backgroundColor: '#623AA2', borderColor: '#623AA2' },
  genderText: { color: '#666' },
  genderTextSelected: { color: 'white' },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  skillChip: { backgroundColor: '#623AA2', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10 },
  skillChipText: { color: 'white', marginRight: 5 },
  skillChipIcon: { marginLeft: 5 },
  addSkillContainer: { marginTop: 10, position: 'relative' },
  skillInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  resumeUploadContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15 },
  resumeTextContainer: { marginLeft: 15 },
  resumeUploadText: { fontSize: 16, color: '#333' },
  resumeFormats: { fontSize: 12, color: '#666', marginTop: 5 },
  selectedFile: { marginTop: 10, color: '#623AA2', fontSize: 14 },
  saveButton: { margin: 15, marginBottom: 30 },
  saveButtonGradient: { borderRadius: 8, padding: 15, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  datePickerButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  dateText: { fontSize: 16, color: '#333' },
  addSkillButton: { backgroundColor: '#623AA2', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10, top: 5 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  progressBarContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginTop: 8, width: '100%' },
  progressBar: { height: '100%', backgroundColor: '#fff', borderRadius: 2 }
});

export default EditProfile;