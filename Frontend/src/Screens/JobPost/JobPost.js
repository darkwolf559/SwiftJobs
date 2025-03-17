import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView,  TextInput,  TouchableOpacity,  SafeAreaView, StatusBar, Platform, KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions } from 'react-native';


const JobPostingPage = () => {
 
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    jobTitle: '',
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

  // Validation state
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when typing
    if (errors[field]) {
      const newErrors = {...errors};
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
    if (!formData.jobDescription) newErrors.jobDescription = 'Job description is required';
    if (!formData.payment) newErrors.payment = 'Payment information is required';
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
  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log('Form submitted:', formData);
      alert('Job posted successfully!');
      // Navigate back or clear form
    } else {
      alert('Please fill in all required fields');
    }
  };

  // Render input field
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
        keyboardType={keyboardType}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
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
      
      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            
            {/* Form Fields */}
            {renderField('Job Title', 'jobTitle', 'e.g., Web Designing')}
            {renderField('Job Description', 'jobDescription', 'Describe the job responsibilities, requirements, and other details...', true)}
            {renderField('Payment', 'payment', 'e.g., $50,000 - $70,000 a year')}
            {renderField('Location', 'location', 'e.g., Los Angeles, CA')}
            {renderField('Duration', 'duration', 'e.g., Full-time, Contract')}
            
            {renderField('Required Skills', 'requiredSkills', 'List required skills separated by commas', true)}
            {renderField('Working Hours', 'workingHours', 'e.g., 40 hours/week')}
            
            <Text style={styles.sectionTitle}>Employer Information</Text>
            
            {renderField('Employer/Company Name', 'employerName', 'e.g., Facebook Inc.')}
            {renderField('Employer Email', 'employerEmail', 'e.g., careers@facebook.com', false, 'email-address')}
            {renderField('Employer Phone', 'employerPhone', 'e.g., (123) 456-7890', false, 'phone-pad')}
            {renderField('Employer Website', 'employerWebsite', 'e.g., www.facebook.com', false, 'url')}
            {renderField('Application Deadline', 'applicationDeadline', 'e.g., April 30, 2025')}
            
            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>POST JOB</Text>
            </TouchableOpacity>
            
            {/* Bottom space */}
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
});

export default JobPostingPage;