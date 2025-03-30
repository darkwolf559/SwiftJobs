import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '../../config/constants';

const VerifyCodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [resendDisabled, setResendDisabled] = useState(true);
  
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  useEffect(() => {
    // Start countdown timer
    const timerInterval = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          setResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(timerInterval);
    };
  }, []); // Empty dependency array means this runs once on mount

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (text, index) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

// Fix the VerifyCodeScreen.js
const handleVerifyCode = async () => {
  const verificationCode = code.join('');
  
  if (verificationCode.length !== 6) {
    Alert.alert('Error', 'Please enter the 6-digit verification code');
    return;
  }
  
  setLoading(true);
  
  try {
    // Verify that the code is valid by making a request to check
    const response = await axios.post(`${API_URL}/reset-password/verify-code`, {
      email,
      verificationCode
    });
    
    setLoading(false);
    
    // If code is valid, navigate to reset password screen
    navigation.navigate('ResetPassword', { 
      email, 
      verificationCode 
    });
    
  } catch (error) {
    setLoading(false);
    
    // Safe error logging
    console.log('Verify code error:', error.message);
    
    let errorMessage = 'Invalid verification code. Please try again.';
    
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    Alert.alert('Error', errorMessage);
  }
};

  const handleResendCode = async () => {
    setLoading(true);
    
    // For testing: use mock response instead of actual API call
    setTimeout(() => {
      setLoading(false);
      setTimeRemaining(900);
      setResendDisabled(true);
      
      Alert.alert('Success', 'A new verification code has been sent to your email');
    
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current.focus();
    }, 1500);
    
   
    try {
      await axios.post(`${API_URL}/reset-password/request`, { email });
      
      setLoading(false);
      setTimeRemaining(900);
      setResendDisabled(true);
      
      Alert.alert('Success', 'A new verification code has been sent to your email');
    
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current.focus();
      
    } catch (error) {
      setLoading(false);
      // Safe error logging
      console.log('Resend code error:', error.message);
      
      let errorMessage = 'Failed to resend verification code. Please try again.';
      
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
        <Text style={styles.headerText}>Verification Code</Text>
      </View>

      <View>
        <Text style={styles.instructionText}>
          Enter the 6-digit verification code sent to:
        </Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>
      
      <View style={styles.timerContainer}>
        {/* Use inline styling for dynamic color based on timeRemaining */}
        <Text style={[
          styles.timerText, 
          { color: timeRemaining < 60 ? '#f97794' : '#666' }
        ]}>
          Code expires in: {formatTime(timeRemaining)}
        </Text>
      </View>

      <View style={styles.codeInputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectionColor="#623AA2"
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={handleVerifyCode}
          disabled={loading || code.some(digit => !digit)}
          style={[
            styles.buttonWrapper,
            code.some(digit => !digit) && styles.disabledButton
          ]}
        >
          <LinearGradient
            colors={["#623AA2", "#F97794"]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Verify Code</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity 
          onPress={handleResendCode}
          disabled={resendDisabled || loading}
        >
          <Text style={[
            styles.resendButtonText,
            resendDisabled && styles.disabledText
          ]}>
            {loading ? 'Sending...' : 'Resend'}
          </Text>
        </TouchableOpacity>
      </View>

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
  },
  emailText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#623AA2",
    marginTop: 5,
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 14,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
    marginVertical: 20,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
    elevation: 3,
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
  disabledButton: {
    opacity: 0.7,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendButtonText: {
    fontSize: 14,
    color: '#623AA2',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
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

export default VerifyCodeScreen;