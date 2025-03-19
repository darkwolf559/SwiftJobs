import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL - adjust based on your environment
const API_URL = 'http://192.168.43.152:5000/api'; // For Android emulator
// const API_URL = 'http://localhost:5000/api'; // For iOS simulator

const LoginScreen = () => {
  const navigation = useNavigation();  
  
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    navigation.navigate("SignUp");  
  };

  // Handle login function
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // Call the login API
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      // Store token in AsyncStorage
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        
        // Store user data if available
        if (response.data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        
        // Navigate to home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Alert.alert('Login Failed', error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.topImageContainer}>
        <Image source={require("../../assets/topVector.png")} style={styles.topImage} />
      </View>

      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Hello</Text>
      </View>

      <View>
        <Text style={styles.signinText}>Sign into your Account?</Text>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
        <TextInput 
          style={styles.textInput} 
          placeholder="Enter your email"
          placeholderTextColor="#9A9A9A" 
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgetPasswordText}>Forget Your Password?</Text>
      </TouchableOpacity>

      <View style={styles.signInButtonContainer}>
        <Text style={styles.signIn}>Sign In</Text>
      
        <TouchableOpacity onPress={handleLogin} disabled={loading}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#623AA2" />
            </View>
          ) : (
            <LinearGradient
              colors={["#623AA2", "#F97794"]}
              style={styles.linearGradient}
            >
              <AntDesign name="arrowright" size={25} color={"white"} style={styles.inputIcon} />
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.footerText}>
          {"Don't Have an Account? "}
          <Text style={{ textDecorationLine: "underline" }}>Create</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.LoginVectorContainer}>
        <ImageBackground source={require("../../assets/createPageBottom.png")} style={styles.LoginVector}></ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  topImageContainer: {},
  topImage: {
    width: "100%",
    height: 130,
  },
  helloText: {
    textAlign: "center",
    fontSize: 70,
    fontWeight: "500", 
    color: "#0f0f0f", 
  },
  signinText: {
    textAlign: "center",
    fontSize: 18,
    color: "#262626",
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    padding: 10, 
    alignItems: "center",
  },
  textInput: {
    flex: 1, 
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  forgetPasswordText: {
    color: "#BEBEBE",
    textAlign: "right",
    fontSize: 15,
    width: "90%",
  },
  signInButtonContainer: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "flex-end",
    width: "90%",
  },
  signIn: {
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
    marginTop: 68,
  },
  LoginVectorContainer: {
    position: "absolute",
    bottom:-10,
    left: -10,
  },
  LoginVector: {
    height: 250,
    width: 150,
  },
});

export default LoginScreen;