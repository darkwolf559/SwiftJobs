import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '../../config/constants';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const handleRequestReset = async () => {
  if (!email) {
    Alert.alert('Error', 'Please enter your email address');
    return;
  }

  if (!validateEmail(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  setLoading(true);
  
  try {
    const response = await axios.post(`${API_URL}/reset-password/request`, { email });
    
    setLoading(false);
    setEmailSent(true);
    
    Alert.alert(
      'Success', 
      'A verification code has been sent to your email.',
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('VerifyCode', { email }) 
        }
      ]
    );
  } catch (error) {
    setLoading(false);
    
    console.log('Request reset error:', error.message);
    
    let errorMessage = 'Failed to send verification code. Please try again.';
    
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    Alert.alert('Error', errorMessage);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image source={require("../../assets/topVector.png")} style={styles.topImage} />
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Forgot Password</Text>
      </View>

      <View>
        <Text style={styles.instructionText}>
          Enter your email address. We'll send you a verification code to reset your password.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <AntDesign name="mail" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={handleRequestReset}
          disabled={loading}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={["#623AA2", "#F97794"]}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Verification Code</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.backToLoginButton}
      >
        <Text style={styles.backToLoginText}>Back to Login</Text>
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  headerContainer: {
    marginVertical: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f0f0f",
  },
  instructionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginHorizontal: 40,
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
  inputIcon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '70%',
  },
  button: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginButton: {
    marginTop: 20,
  },
  backToLoginText: {
    textAlign: 'center',
    color: '#623AA2',
    fontSize: 16,
  },
  LoginVectorContainer: {
    position: "absolute",
    bottom: -10,
    left: -10,
  },
  LoginVector: {
    height: 250,
    width: 150,
  },
});

export default ForgotPasswordScreen;