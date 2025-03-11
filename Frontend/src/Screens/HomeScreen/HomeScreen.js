import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from "@react-navigation/native";
import TabNavigation from "../../compenents/TabNavigation";
import CustomDrawer from "../../compenents/CustomDrawerContent";

const HomeScreen = () => {
  
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Home");
  const [isDrawerVisible, setIsDrawerVisible] = useState (false);

  
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    
  };

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#623AA2", "#F97794"]} style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleDrawer}>
          <Icon name="menu-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>HOME</Text>
        </View>


      
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="sliders" size={24} color="white" />
        </TouchableOpacity>

      </LinearGradient>

      <View style={styles.content}>
        <Text>Welcome to Home Screen</Text>
      </View>

      {/*imported tab navigation bar */}
      <TabNavigation 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      <CustomDrawer isVisible={isDrawerVisible}
      onClose = {()=>setIsDrawerVisible(false)}
      navigation={navigation}>

      </CustomDrawer>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default HomeScreen;