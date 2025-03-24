import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, Modal, FlatList, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jobService } from '../../services/api';
import CityAutocomplete from '../../compenents/CityAutoComplete';

const { width } = Dimensions.get('window');

const JobPostingPage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  

  const [formData, setFormData] = useState({
    jobTitle: '',
    category: 'Select Category',
    jobDescription: '',
    payment: '',
    location: '',
    duration: '',
    requiredSkills: '',
    workingHours: '',
    employerName: '',
    employerEmail: '',
    employerPhone: '',
    employerWebsite: '',
    applicationDeadline: ''
  });
  
  const categoryOptions = [
    { id: '1', label: 'TECHNOLOGY' },
    { id: '2', label: 'HEALTHCARE' },
    { id: '3', label: 'EDUCATION' },
    { id: '4', label: 'AGRICULTURE' },
    { id: '5', label: 'FINANCIAL' },
    { id: '6', label: 'TRANSPORTATION' },
    { id: '7', label: 'CONSTRUCTION' },
    { id: '8', label: 'DOMESTIC WORKS' },
    { id: '9', label: 'OTHERS' }
  ];

  const [errors, setErrors] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);
          
 
          setFormData(prevData => ({
            ...prevData,
            employerName: parsedUserData.fullName || '',
            employerEmail: parsedUserData.email || ''
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handleChange = (field, value) => {
    if (field === 'payment') {

      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData({
        ...formData,
        [field]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
    
    // Clear error when typing
    if (errors[field]) {
      const newErrors = {...errors};
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Handle city selection from autocomplete
  const handleCitySelect = (city) => {
    handleChange('location', city);
  };

  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category: category.label,
      categoryId: category.id // Store the category ID for the backend
    });
    setShowCategoryDropdown(false);
    
    // Clear error for category if exists
    if (errors.category) {
      const newErrors = {...errors};
      delete newErrors.category;
      setErrors(newErrors);
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
    if (formData.category === 'Select Category') newErrors.category = 'Category is required';
    if (!formData.jobDescription) newErrors.jobDescription = 'Job description is required';
    
    // Validate payment
    if (!formData.payment) {
      newErrors.payment = 'Payment is required';
    } else {
      const paymentNum = parseFloat(formData.payment);
      if (isNaN(paymentNum) || paymentNum <= 0) {
        newErrors.payment = 'Please enter a valid positive number';
      }
    }

    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.requiredSkills) newErrors.requiredSkills = 'Required skills are required';
    if (!formData.workingHours) newErrors.workingHours = 'Working hours are required';
    if (!formData.employerEmail) newErrors.employerEmail = 'Contact email is required';
    if (!formData.applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        
        const selectedCategory = categoryOptions.find(
          cat => cat.label === formData.category
        );
        
        if (!selectedCategory) {
          Alert.alert('Error', 'Please select a valid category');
          setLoading(false);
          return;
        }
        
        const paymentNum = parseFloat(formData.payment);

        const jobData = {
          ...formData,
          jobCategory: selectedCategory.id,
          payment: paymentNum 
        };
        
        const response = await jobService.createJob(jobData);
        
        Alert.alert(
          'Success', 
          'Job posted successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        console.error('Error posting job:', error);
        Alert.alert(
          'Error',
          error.message || 'Failed to post job. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please fill in all required fields correctly');
    }
  };


  const renderField = (label, field, placeholder, multiline = false, keyboardType = 'default', required = true) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={styles.requiredStar}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multilineInput,
          errors[field] && styles.errorInput
        ]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(text) => handleChange(field, text)}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType === 'numeric' ? 'numeric' : keyboardType}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  const renderCitySelector = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        City <Text style={styles.requiredStar}>*</Text>
      </Text>
      <CityAutocomplete
        initialValue={formData.location}
        onCitySelect={handleCitySelect}
        error={errors.location}
      />
      {errors.location && (
        <Text style={styles.errorText}>{errors.location}</Text>
      )}
    </View>
  );

  const renderCategoryDropdown = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        Category <Text style={styles.requiredStar}>*</Text>
      </Text>
      <TouchableOpacity 
        style={[
          styles.dropdownButton,
          errors.category && styles.errorInput
        ]} 
        onPress={() => setShowCategoryDropdown(true)}
      >
        <Text style={formData.category === 'Select Category' ? styles.dropdownPlaceholder : styles.dropdownText}>
          {formData.category}
        </Text>
        <Icon name="arrow-drop-down" size={24} color="#555" />
      </TouchableOpacity>
      {errors.category && (
        <Text style={styles.errorText}>{errors.category}</Text>
      )}
      
      <Modal
        visible={showCategoryDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowCategoryDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <FlatList
              data={categoryOptions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8a4bff" barStyle="light-content" />
      
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
          <Text style={styles.headerTitle}>POST JOB</Text>
        </View>
      </LinearGradient>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            
            {renderField('Job Title', 'jobTitle', 'e.g., Web Designing')}
            {renderCategoryDropdown()}
            {renderField('Job Description', 'jobDescription', 'Describe the job responsibilities, requirements, and other details...', true)}
            {renderField('Payment', 'payment', 'e.g., 50000', false, 'numeric')}
            
            {renderCitySelector()}
            
            {renderField('Duration', 'duration', 'e.g., Full-time, Contract')}
            {renderField('Required Skills', 'requiredSkills', 'List required skills separated by commas', true)}
            {renderField('Working Hours', 'workingHours', 'e.g., 40 hours/week')}
            
            <Text style={styles.sectionTitle}>Employer Information</Text>
            
            {renderField('Employer/Company Name', 'employerName', 'e.g., Facebook Inc.')}
            {renderField('Employer Email', 'employerEmail', 'e.g., careers@facebook.com', false, 'email-address')}
            {renderField('Employer Phone', 'employerPhone', 'e.g., (123) 456-7890', false, 'phone-pad')}
            {renderField('Employer Website', 'employerWebsite', 'e.g., www.facebook.com', false, 'url', false)}
            {renderField('Application Deadline', 'applicationDeadline', 'e.g., April 30, 2025')}
            

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>POST JOB</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.bottomSpace} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  keyboardAvoid: {
    flex: 1,
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
    padding: 5
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#e94b97',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#e94b97',
  },
  errorText: {
    color: '#e94b97',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#673ab7',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 50,
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownModal: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: width * 0.8,
    maxHeight: 300,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  }
});

export default JobPostingPage;