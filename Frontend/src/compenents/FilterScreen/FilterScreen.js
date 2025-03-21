import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import Slider from "@react-native-community/slider";
import { Button, Avatar } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import CityAutocomplete from "../compenents/CityAutoComplete";

const FilterScreen = () => {
  const [salaryRange, setSalaryRange] = useState({ min: 200000, max: 800000 });
  const navigation = useNavigation();
  

  const initialCategories = {
    technology: false,
    healthcare: false,
    education: false,
    agriculture: false,
    financial: false,
    transportation: false,
    construction: false,
    domesticWorks: false,
    others: false,
  };
  
  const [categories, setCategories] = useState(initialCategories);
  const [location, setLocation] = useState('');

 
  const toggleCategory = (category) => {
    setCategories((prevCategories) => ({
      ...prevCategories,
      [category]: !prevCategories[category],
    }));
  };

  
  const clearFilters = () => {
    setSalaryRange({ min: 200000, max: 800000 });
    setCategories(initialCategories);
    setLocation('');
  };

  const handleSearch = () => {
    let minSalary = Number(salaryRange.min);
    let maxSalary = Number(salaryRange.max);
    
    if (minSalary > maxSalary) {
      const temp = minSalary;
      minSalary = maxSalary;
      maxSalary = temp;
    }
    
    const selectedCategories = Object.keys(categories).filter(cat => categories[cat]);
    
    
    const filters = {
      salaryRange: {
        min: isNaN(minSalary) ? 0 : minSalary,
        max: isNaN(maxSalary) ? 1000000 : maxSalary
      },
      categories: selectedCategories,
      location: location || '',
    };
    
    if (selectedCategories.length === 0 && !location && 
        minSalary === 200000 && maxSalary === 800000) {
      Alert.alert(
        "No Filters Applied", 
        "You haven't selected any specific filters. All jobs will be shown.",
        [{ 
          text: "OK",
          onPress: () => {
            navigation.navigate('AllJobsScreen', { filters });
          }
        }]
      );
    } else {
      navigation.navigate('AllJobsScreen', { filters });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={["#623AA2", "#F97794"]} 
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FILTER</Text>
        <View style={{ width: 24 }}/>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={[styles.filterBox, { paddingBottom: 100 }]} 
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.label}>Salary Range</Text>
        <Text style={styles.salaryText}>Min: LKR {salaryRange.min.toLocaleString()}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1000}
          maximumValue={1000000}
          step={10000}
          value={salaryRange.min}
          onValueChange={(value) => {
            if (value <= salaryRange.max) {
              setSalaryRange({ ...salaryRange, min: value });
            }
          }}
          minimumTrackTintColor="#6a11cb"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#6a11cb"
        />
        <Text style={styles.salaryText}>Max: LKR {salaryRange.max.toLocaleString()}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1000}
          maximumValue={1000000}
          step={10000}
          value={salaryRange.max}
          onValueChange={(value) => {
            if (value >= salaryRange.min) {
              setSalaryRange({ ...salaryRange, max: value });
            }
          }}
          minimumTrackTintColor="#6a11cb"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#6a11cb"
        />

        <Text style={styles.label}>Location</Text>
        <CityAutocomplete 
          onCitySelect={(city) => setLocation(city)}
          initialValue={location}
        />

        <Text style={styles.label}>Job Categories</Text>
        <View style={styles.categoriesContainer}>
          {Object.keys(categories).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton, 
                categories[category] && styles.selectedCategory
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText, 
                categories[category] && styles.selectedCategoryText
              ]}>
                {categoryLabels[category]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <LinearGradient 
            colors={["#601cd6", "#601cd6"]} 
            style={styles.gradientButton}
          >
            <Button 
              title="SHOW RESULT" 
              buttonStyle={styles.searchButton} 
              onPress={handleSearch} 
            />
          </LinearGradient>

          <Button 
            title="CLEAR" 
            type="outline" 
            buttonStyle={styles.clearButton} 
            titleStyle={{ color: "#601cd6" }} 
            onPress={clearFilters} 
          />
        </View>
      </ScrollView>
    </View>
  );
};

const categoryLabels = {
  technology: "TECHNOLOGY",
  healthcare: "HEALTHCARE",
  education: "EDUCATION",
  agriculture: "AGRICULTURE",
  financial: "FINANCIAL",
  transportation: "TRANSPORTATION",
  construction: "CONSTRUCTION",
  domesticWorks: "DOMESTIC WORKS",
  others: "OTHERS",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  filterBox: { backgroundColor: "white", margin: 10, padding: 20, borderRadius: 10, elevation: 3 },
  label: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  salaryText: { fontSize: 14, marginBottom: 5 },
  slider: { width: "100%", height: 40 },
  categoriesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  categoryButton: {
    width: '30%',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#6a11cb',
    borderColor: '#6a11cb',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: 'white',
  },
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 20 
  },
  avatar: { position: "absolute", bottom: 20, right: 20 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backButton: { padding: 10 },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  gradientButton: { 
    borderRadius: 5, 
    overflow: "hidden", 
    marginBottom: 10 
  },
  searchButton: { 
    backgroundColor: "transparent", 
    paddingVertical: 12 
  },
  clearButton: { 
    borderColor: "#601cd6", 
    borderWidth: 2,  
    paddingVertical: 12, 
    backgroundColor: "transparent" 
  },
});

export default FilterScreen;