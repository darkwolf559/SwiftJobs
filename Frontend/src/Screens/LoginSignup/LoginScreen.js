import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Make sure to install axios: npm install axios

// Replace with your actual backend URL
const API_URL = 'http://your-backend-url/api/login';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    navigation.navigate("SignUp");
  };

  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);
      
      // Make API call to the backend login endpoint
      const response = await axios.post(API_URL, {
        username: username,
        password: password
      });

      // Handle successful login
      if (response.data && response.data.success) {
        // You might want to store the token/user data in AsyncStorage
        // AsyncStorage.setItem('userToken', response.data.token);
        
        // Navigate to home screen
        navigation.navigate("Home");
      } else {
        // Handle server response with error message
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      // Handle network or server errors
      console.error('Login error:', error);
      
      if (error.response) {
        // Server responded with an error
        Alert.alert('Login Failed', error.response.data.message || 'Authentication failed');
      } else {
        // Network error or other issues
        Alert.alert('Error', 'Unable to connect to the server. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false);
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
          placeholder="Enter your username"   
          placeholderTextColor="#9A9A9A"
          value={username}
          onChangeText={setUsername}
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

      <Text style={styles.forgetPasswordText}>Forget Your Password?</Text>

      <View style={styles.signInButtonContainer}>
        <Text style={styles.signIn}>Sign In</Text>
      
        <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
          <LinearGradient
            colors={["#623AA2", "#F97794"]}
            style={[styles.linearGradient, isLoading && styles.disabledButton]}
          >
            {isLoading ? (
              <Text style={{color: 'white'}}>...</Text>
            ) : (
              <AntDesign name="arrowright" size={25} color={"white"} style={styles.inputIcon} />
            )}
          </LinearGradient>
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
  disabledButton: {
    opacity: 0.7,
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
