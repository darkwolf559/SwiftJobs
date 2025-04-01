import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from '../../config/constants';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, verificationCode } = route.params;
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleResetPassword = async () => {
  if (!newPassword || !confirmPassword) {
    Alert.alert('Error', 'Please enter and confirm your new password');
    return;
  }
  
  if (newPassword.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters long');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }
  
  setLoading(true);

  try {
    const response = await axios.post(`${API_URL}/reset-password/reset`, {
      email,
      verificationCode,
      newPassword
    });
    
    setLoading(false);
    
    Alert.alert(
      'Success',
      'Your password has been reset successfully',
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('Login') 
        }
      ]
    );
    
  } catch (error) {
    setLoading(false);
    console.log('Reset password error:', error.message);
    
    let errorMessage = 'Failed to reset password. Please try again.';
    
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
        <Text style={styles.headerText}>Reset Password</Text>
      </View>

      <View>
        <Text style={styles.instructionText}>
          Please create a new password for your account
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Fontisto name="locked" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
        <TextInput 
          style={styles.textInput} 
          placeholder="New Password"
          placeholderTextColor="#9A9A9A" 
          secureTextEntry={!showPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Feather 
            name={showPassword ? "eye" : "eye-off"} 
            size={24} 
            color="#9A9A9A" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Fontisto name="locked" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
        <TextInput 
          style={styles.textInput} 
          placeholder="Confirm Password"
          placeholderTextColor="#9A9A9A" 
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Feather 
            name={showConfirmPassword ? "eye" : "eye-off"} 
            size={24} 
            color="#9A9A9A" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordRulesContainer}>
        <Text style={styles.passwordRulesText}>
          Password must be at least 6 characters long
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={handleResetPassword}
          disabled={loading || !newPassword || !confirmPassword}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={["#623AA2", "#F97794"]}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </LinearGradient>
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
    marginBottom: 30,
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
  eyeIcon: {
    padding: 5,
  },
  passwordRulesContainer: {
    marginHorizontal: 40,
    marginTop: 5,
  },
  passwordRulesText: {
    fontSize: 12,
    color: "#666",
    fontStyle: 'italic',
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

export default ResetPasswordScreen;