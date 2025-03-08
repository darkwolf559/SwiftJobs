import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const { width } = Dimensions.get("window");

const TabNavigation = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => onTabPress("Home")}
        >
          <FontAwesome 
            name="home" 
            size={22} 
            color={activeTab === "Home" ? "#623AA2" : "#B0B0B0"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => onTabPress("Bookmark")}
        >
          <FontAwesome 
            name="bookmark-o" 
            size={22} 
            color={activeTab === "Bookmark" ? "#623AA2" : "#B0B0B0"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => onTabPress("Job")}
        >
          <Entypo 
            name="briefcase" 
            size={22} 
            color={activeTab === "Job" ? "#623AA2" : "#B0B0B0"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => onTabPress("Message")}
        >
          <AntDesign  
            name="message1" 
            size={22} 
            color={activeTab === "Message" ? "#623AA2" : "#B0B0B0"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => onTabPress("Profile")}
        >
          <FontAwesome5
            name="user-circle" 
            size={22} 
            color={activeTab === "Profile" ? "#623AA2" : "#B0B0B0"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    width: width,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#fff",
  },
  tabBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: "#fff",
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default TabNavigation;