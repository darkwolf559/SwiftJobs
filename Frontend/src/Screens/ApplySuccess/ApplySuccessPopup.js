import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ApplySuccessPopup = ({ visible, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {

      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      

      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, scaleAnim, fadeAnim, onClose]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Animated.View style={{ 
              transform: [{ scale: scaleAnim }],
            }}>
              <Icon name="check-circle" size={80} color="#623AA2" />
            </Animated.View>
          </View>
          
          <Animated.Text style={[styles.successText, { opacity: fadeAnim }]}>
            Applied Successfully!
          </Animated.Text>
          
          <Animated.Text style={[styles.messageText, { opacity: fadeAnim }]}>
            Your application has been submitted.
          </Animated.Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ApplySuccessPopup;