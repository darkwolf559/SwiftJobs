import { View, Text, StyleSheet, Image, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../HomeScreen/HomeScreen';

const LoginScreen = () => {
  const navigation = useNavigation();  

  const handleRegister = () => {
    navigation.navigate("SignUp");  
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
        <TextInput style={styles.textInput} placeholder="Enter your username"   placeholderTextColor="#9A9A9A" />
      </View>

      <View style={styles.inputContainer}>
        <Fontisto name="locked" size={24} color={"#9A9A9A"} style={styles.inputIcon} />
        <TextInput style={styles.textInput} placeholder="Enter your Password"   placeholderTextColor="#9A9A9A" secureTextEntry />
      </View>

      <Text style={styles.forgetPasswordText}>Forget Your Password?</Text>

      <View style={styles.signInButtonContainer}>
        <Text style={styles.signIn}>Sign In</Text>
      
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <LinearGradient
          colors={["#623AA2", "#F97794"]}
          style={styles.linearGradient}
        >
          <AntDesign name="arrowright" size={25} color={"white"} style={styles.inputIcon}  />
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
