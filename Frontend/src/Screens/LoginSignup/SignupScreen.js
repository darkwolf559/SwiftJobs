import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/api'; // Import auth service

const SignupScreen = () => {
  const navigation = useNavigation();  
  
  // State for form fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    navigation.navigate("Login");  
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle signup function
  const handleSignup = async () => {
    // Reset error message
    setErrorMessage('');
    
    // Validate inputs
    if (!username || !fullName || !password || !email || !mobile) {
      setErrorMessage('All fields are required');
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting to register user with:', {
        username,
        email,
        mobileNumber: mobile,
      });
      
      // Call the registration API
      const response = await authService.register({
        username,
        password,
        email,
        mobileNumber: mobile,
        fullName: fullName // Using explicit fullName field
      });
      
      setLoading(false);
      
      // Show success message and navigate to login
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      setLoading(false);
      
      console.error('Registration error details:', error);
      
      // Set error message for display
      const errorMsg = error?.message || 'Could not create account. Please try again.';
      setErrorMessage(errorMsg);
      
      // Handle registration errors
      Alert.alert(
        'Registration Failed', 
        errorMsg
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Background vector image - placed first so it stays at the bottom */}
      <View style={styles.LoginVectorContainer}>
        <ImageBackground source={require("../../assets/createPageBottom.png")} style={styles.LoginVector}></ImageBackground>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.topImageContainer}>
            <Image source={require("../../assets/topVector.png")} style={styles.topImage} />
          </View>

          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>Create Account </Text>
          </View>

          {/* Display error message if any */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
            <TextInput 
              style={styles.textInput} 
              placeholder="Enter your username" 
              placeholderTextColor="#9A9A9A" 
              value={username}
              onChangeText={setUsername}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <FontAwesome name="id-card" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
            <TextInput 
              style={styles.textInput} 
              placeholder="Enter your full name" 
              placeholderTextColor="#9A9A9A" 
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Fontisto name="locked" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
            <TextInput 
              style={styles.textInput} 
              placeholder="Enter your Password" 
              placeholderTextColor="#9A9A9A"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="mail" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
            <TextInput 
              style={styles.textInput} 
              placeholder="Enter your Email" 
              placeholderTextColor="#9A9A9A"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="mobile1" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
            <TextInput 
              style={styles.textInput} 
              placeholder="Enter your Mobile" 
              placeholderTextColor="#9A9A9A"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <View style={styles.createButtonContainer}>
            <Text style={styles.create}>Create</Text>

            <TouchableOpacity onPress={handleSignup} disabled={loading}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#623AA2" />
                </View>
              ) : (
                <LinearGradient
                  colors={["#623AA2", "#F97794"]}
                  style={styles.linearGradient}
                >
                  <AntDesign name="arrowright" size={24} color={"white"} style={styles.inputIcon} />
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.footerText}>
                Already have an account? <Text style={{ textDecorationLine: "underline" }}>Login</Text>
              </Text>
            </TouchableOpacity>

            <Text style={[styles.footerText, { marginTop: 20 }]}>
              or create Account using Social Media
            </Text>

            <View style={styles.socialMediaContainer}>
              <View style={styles.socialIconWrapper}>
                <Entypo name="facebook-with-circle" size={30} color={"#3b5998"} />
              </View>
              <View style={styles.socialIconWrapper}>
                <Entypo name="twitter-with-circle" size={30} color={"#1DA1F2"} />
              </View>
              <View style={styles.socialIconWrapper}>
                <AntDesign name="google" size={30} color={"#DB4437"} />
              </View>
            </View>
          </View>
          
          {/* Add extra space at the bottom to prevent content from being hidden behind the vector */}
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topImageContainer: {},
  topImage: {
    width: "100%",
    height: 130,
  },
  createAccountContainer: {
    marginVertical: 10,
  },
  createAccountText: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold", 
    color: "#0f0f0f",
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 40,
    marginBottom: 15,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: 14,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 15,
    padding: 10, 
    alignItems: "center",
  },
  textInput: {
    flex: 1, 
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  inputIcon: {
    marginHorizontal: 5,
  },
  LoginVectorContainer: {
    position: "absolute",
    bottom: -10,
    left: -10,
    zIndex: -1, // Make sure it stays behind other content
  },
  LoginVector: {
    height: 250,
    width: 150,
  },
  createButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "flex-end",
    width: "90%",
  },
  create: {
    color: "#262626",
    fontSize: 25,
    fontWeight: "bold",
  },
  linearGradient: {
    height: 34,
    width: 56,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  loadingContainer: {
    height: 34,
    width: 56,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  footerText: {
    color: "#262626",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 15,
  },
  footerContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIconWrapper: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    elevation: 10,
  },
});

export default SignupScreen;