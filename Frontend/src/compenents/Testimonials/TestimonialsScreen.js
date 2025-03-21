import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { testimonials } from './Testimonials';

const { width } = Dimensions.get('window');

const TestimonialsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={["#623AA2", "#F97794"]} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>TESTIMONIALS</Text>
        </View>
        <View style={styles.iconButton}>
          {/* Empty view for spacing */}
        </View>
      </LinearGradient>

      {/* Testimonials List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.testimonialsContainer}
      >
        {testimonials.map((testimonial) => (
          <View key={testimonial.id} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <Image 
                source={{ uri: testimonial.image }}
                style={styles.testimonialImage}
              />
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              </View>
            </View>
            <Text style={styles.testimonialText}>{testimonial.text}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    width: 34, // Fixed width for proper alignment
  },
  testimonialsContainer: {
    padding: 16,
  },
  testimonialCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  testimonialRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  testimonialText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

export default TestimonialsScreen;