import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Slider
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from '@rneui/themed';

const FilterScreen = ({ navigation }) => {
  // State for salary range
  const [salaryRange, setSalaryRange] = useState([200000, 800000]);
  
  // State for job types
  const [jobTypes, setJobTypes] = useState({
    fullTime: true,
    partTime: false,
    contract: false,
    internship: true,
    freelance: true,
    commission: false
  });
  
  // State for experience level
  const [experienceLevel, setExperienceLevel] = useState('mid');
  
  // Handle job type toggle
  const toggleJobType = (type) => {
    setJobTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Handle experience level selection
  const selectExperienceLevel = (level) => {
    setExperienceLevel(level);
  };
  
  // Handle min salary change
  const handleMinSalaryChange = (value) => {
    setSalaryRange([value, salaryRange[1]]);
  };
  
  // Handle max salary change
  const handleMaxSalaryChange = (value) => {
    setSalaryRange([salaryRange[0], value]);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return $${value.toLocaleString()};
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient 
        colors={["#623AA2", "#F97794"]} 
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FILTER</Text>
        <View style={styles.emptySpace} />
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {/* Salary Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary Range</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1000000}
              step={10000}
              value={salaryRange[0]}
              onValueChange={handleMinSalaryChange}
              minimumTrackTintColor="#623AA2"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#623AA2"
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1000000}
              step={10000}
              value={salaryRange[1]}
              onValueChange={handleMaxSalaryChange}
              minimumTrackTintColor="#623AA2"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#623AA2"
            />
          </View>
          <View style={styles.salaryLabels}>
            <Text style={styles.salaryLabel}>Min: {formatCurrency(salaryRange[0])}</Text>
            <Text style={styles.salaryLabel}>Max: {formatCurrency(salaryRange[1])}</Text>
          </View>
        </View>
        
        {/* Job Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Type</Text>
          <View style={styles.checkboxGrid}>
            <View style={styles.checkboxRow}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={jobTypes.fullTime}
                  onPress={() => toggleJobType('fullTime')}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#623AA2"
                  containerStyle={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Full Time (52)</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={jobTypes.partTime}
                  onPress={() => toggleJobType('partTime')}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#623AA2"
                  containerStyle={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Part Time (82)</Text>
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={jobTypes.contract}
                  onPress={() => toggleJobType('contract')}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#623AA2"
                  containerStyle={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Contract (150)</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={jobTypes.internship}
                  onPress={() => toggleJobType('internship')}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#623AA2"
                  containerStyle={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Internship (180)</Text>
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={jobTypes.freelance}
                  onPress={() => toggleJobType('freelance')}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#623AA2"
                  containerStyle={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Freelance (205)</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={jobTypes.commission}
                  onPress={() => toggleJobType('commission')}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="#623AA2"
                  containerStyle={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Commission (60)</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Experience Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience Level</Text>
          <View style={styles.experienceTabs}>
            <TouchableOpacity
              style={[
                styles.experienceTab, 
                experienceLevel === 'entry' && styles.activeExperienceTab
              ]}
              onPress={() => selectExperienceLevel('entry')}
            >
              <Text style={[
                styles.experienceTabText,
                experienceLevel === 'entry' && styles.activeExperienceTabText
              ]}>Entry Level</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.experienceTab, 
                experienceLevel === 'mid' && styles.activeExperienceTab
              ]}
              onPress={() => selectExperienceLevel('mid')}
            >
              <Text style={[
                styles.experienceTabText,
                experienceLevel === 'mid' && styles.activeExperienceTabText
              ]}>Mid Level</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.experienceTab, 
                experienceLevel === 'senior' && styles.activeExperienceTab
              ]}
              onPress={() => selectExperienceLevel('senior')}
            >
              <Text style={[
                styles.experienceTabText,
                experienceLevel === 'senior' && styles.activeExperienceTabText
              ]}>Senior Level</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.showResultButton}
          onPress={() => {
            // Handle the filter submission
            const filters = {
              salaryRange,
              jobTypes,
              experienceLevel
            };
            console.log('Applied filters:', filters);
            navigation.goBack(); // Navigate back with results
          }}
        >
          <Text style={styles.showResultButtonText}>SHOW RESULT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => {
            // Reset all filters
            setSalaryRange([200000, 800000]);
            setJobTypes({
              fullTime: false,
              partTime: false,
              contract: false,
              internship: false,
              freelance: false,
              commission: false
            });
            setExperienceLevel('entry');
          }}
        >
          <Text style={styles.clearButtonText}>CLEAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
