import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

const EditProfile = ({ navigation, route }) => {
  const [userData, setUserData] = useState(route.params?.userData || {});
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const handleProfileImagePick = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets?.[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleCoverImagePick = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets?.[0]) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    console.log('Saving user data:', { ...userData, profileImage, coverImage });
    navigation.goBack();
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

  const handleResumePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      setResumeFile(result[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking document:', err);
      }
    }
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
            source={coverImage ? { uri: coverImage } : require('../../assets/20943599.jpg')}
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
              source={profileImage ? { uri: profileImage } : require('../../assets/20943599.jpg')}
              style={styles.profileImage}
            />
            <View style={styles.editProfilePhotoButton}>
              <Icon name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.fullName}</Text>
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
              value={userData.education?.college}
              onChangeText={(text) => setUserData({
                ...userData,
                education: { ...userData.education, college: text }
              })}
              placeholder="Enter your college"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>High School Degree</Text>
            <TextInput
              style={styles.input}
              value={userData.education?.highSchool}
              onChangeText={(text) => setUserData({
                ...userData,
                education: { ...userData.education, highSchool: text }
              })}
              placeholder="Enter your high school degree"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Higher Secondary Education</Text>
            <TextInput
              style={styles.input}
              value={userData.education?.higherSecondary}
              onChangeText={(text) => setUserData({
                ...userData,
                education: { ...userData.education, higherSecondary: text }
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
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <LinearGradient
            colors={["#623AA2", "#F97794"]}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>SAVE</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  coverPhotoContainer: {
    position: 'relative',
    height: 200,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPhotoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverCameraContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPhotoText: {
    color: 'white',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  profileInfoCard: {
    marginTop: -50,
    marginHorizontal: 20,
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
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  editProfilePhotoButton: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: '#623AA2',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  genderOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#623AA2',
    borderColor: '#623AA2',
  },
  genderText: {
    color: '#666',
  },
  genderTextSelected: {
    color: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  skillChip: {
    backgroundColor: '#623AA2',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  skillChipText: {
    color: 'white',
    marginRight: 5,
  },
  skillChipIcon: {
    marginLeft: 5,
  },
  addSkillContainer: {
    marginTop: 10,
  },
  skillInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  resumeUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
  },
  resumeTextContainer: {
    marginLeft: 15,
  },
  resumeUploadText: {
    fontSize: 16,
    color: '#333',
  },
  resumeFormats: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  selectedFile: {
    marginTop: 10,
    color: '#623AA2',
    fontSize: 14,
  },
  saveButton: {
    margin: 15,
    marginBottom: 30,
  },
  saveButtonGradient: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;