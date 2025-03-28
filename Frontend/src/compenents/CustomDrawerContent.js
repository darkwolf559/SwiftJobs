import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import UserProfile from './UserProfile/UserProfile';

import { useRoute } from '@react-navigation/native';
const CustomDrawer = ({ isVisible, onClose, navigation }) => {

  if (!isVisible) return null;

  const menuItems = [
    { id: 1, title: 'View Profile', icon: 'person-outline', type: 'Ionicons' },
    { id: 2, title: 'Categories', icon: 'sitemap', type: 'FontAwesome' },
    { id: 3, title: 'Notification', icon: 'notifications-outline', type: 'Ionicons' },
    { id: 4, title: 'Bookmark', icon: 'bookmark-outline', type: 'Ionicons' },
    { id: 5, title: 'View Jobs', icon: 'briefcase-outline', type: 'Ionicons' },
    { id: 6, title: 'Applied Jobs', icon: 'bag-check', type: 'Ionicons' },
    { id: 7, title: 'Job Applications', icon: 'document', type: 'Ionicons' },
    { id: 8, title: 'Post a Job', icon: 'bag-add', type: 'Ionicons' },
    { id: 9, title: 'Log Out', icon: 'log-out-outline', type: 'Ionicons' }
  ];

  const handleMenuItemPress = (title) => {
 
    switch(title) {
      case 'View Profile':
        navigation?.navigate('UserProfile');
        break;
      case 'Categories':
        navigation?.navigate('CategoryScreen');
        break;
          
          case 'Invite Friend':
            navigation?.navigate('InviteFriend');
            break;

            case 'Post a Job':
              navigation?.navigate('JobPostingPage');
              break;    

              case 'View Jobs':
                navigation?.navigate('AllJobsScreen');
                break; 

                case 'Applied Jobs':
                  navigation?.navigate('AppliedJobsScreen');
                  break;

                  case 'Job Applications':
                    navigation?.navigate('ApplicationsScreen');
                    break;
                
                case 'Bookmark':
                  navigation?.navigate('BookmarksScreen');
                  break;

                  case 'Notification':
                    navigation?.navigate('NotificationsScreen');
                    break;

                  
          
      
      case 'Log Out':

        console.log('Logging out...');
        navigation?.navigate('Login');
        break;
      default:
        navigation?.navigate(title);
    }
    onClose();
  };

  return (
    <View style={styles.container}>

      <View style={styles.drawer}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.menuItems}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.title)}
            >
              <LinearGradient 
                colors={["#623AA2", "#F97794"]} 
                style={styles.iconContainer}
              >
                {item.type === 'Ionicons' ? (
                  <Icon name={item.icon} size={24} color="#fff" />
                ) : (
                  <FontAwesome name={item.icon} size={24} color="#fff" />
                )}
              </LinearGradient>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      

      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1000,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: width * 0.75, 
    height: height,
    backgroundColor: '#fff',
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default CustomDrawer;