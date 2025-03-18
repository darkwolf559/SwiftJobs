import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Make sure to install axios: npm install axios

const API_URL = 'http://YOUR_BACKEND_URL/api/users'; // Replace with your actual backend URL

const SignupScreen = () => {
  const navigation = useNavigation();
  
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Navigate to login screen
  const handleNavigateToLogin = () => {
    navigation.navigate("Login");
  };

  // Handle the registration process
  const handleRegister = async () => {
    // Basic validation
    if (!username || !password || !email || !mobile) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation (at least 6 characters)
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      // Send registration request to backend
      const response = await axios.post(API_URL, {
        username,
        password,
        email,
        mobile
      });

      // If successful, show success message and navigate to login
      Alert.alert(
        'Success',
        'Account created successfully! Please login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      // Handle errors from the API
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="mobile1" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
            <TextInput 
              style={styles.textInput} 
              placeholder="Enter your Mobile"   
              placeholderTextColor="#9A9A9A"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.createButtonContainer}>
            <Text style={styles.create}>Create</Text>

            <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
              <LinearGradient
                colors={["#623AA2", "#F97794"]}
                style={styles.linearGradient}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <AntDesign name="arrowright" size={24} color={"white"} style={styles.inputIcon} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={handleNavigateToLogin}>
              <Text style={styles.footerText}>
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
            </TouchableOpacity>
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