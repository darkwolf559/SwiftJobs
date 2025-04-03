import React from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/appIcon.jpeg')} 
        style={styles.image} 
      />
      <ActivityIndicator size="large" color="#623AA2" />
      <Text style={styles.text}>Swift Jobs</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#623AA2',
    fontWeight: 'bold',
  },
});

export default SplashScreen;