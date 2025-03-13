import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import Slider from "@react-native-community/slider";
import { CheckBox, Button, Avatar, Image } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
const FilterScreen = () => {
  const [salaryRange, setSalaryRange] = useState({ min: 200000, max: 800000 });
  const navigation = useNavigation();
  const initialJobTypes = {
    fullTime: true,
    partTime: false,
    contract: false,
    internship: true,
    freelance: false,
    commission: false,
  };
  const [jobTypes, setJobTypes] = useState(initialJobTypes);
  const [experience, setExperience] = useState("Mid Level");

  const toggleJobType = (type) => {
    setJobTypes((prevJobTypes) => ({
      ...prevJobTypes,
      [type]: !prevJobTypes[type],
    }));
  };

  const clearFilters = () => {
    setSalaryRange({ min: 200000, max: 800000 });
    setJobTypes(initialJobTypes);
    setExperience("Mid Level");
  };

  const handleSearch = () => {
    const filters = {
      salaryRange,
      jobTypes,
      experience,
    };
    console.log("Filters:", filters);
    Alert.alert("Filters Applied", JSON.stringify(filters, null, 2));
  };

  const jobTypeLabels = {
    fullTime: "Full Time",
    partTime: "Part Time",
    contract: "Contract",
    internship: "Internship",
    freelance: "Freelance",
    commission: "Commission",
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

      <ScrollView contentContainerStyle={[styles.filterBox, { paddingBottom: 100 }]} showsVerticalScrollIndicator={true}>
        <Text style={styles.label}>Salary Range</Text>
        <Text style={styles.salaryText}>Min: ${salaryRange.min.toLocaleString()}</Text>
        <Slider
          style={styles.slider}
          minimumValue={50000}
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
        <Text style={styles.salaryText}>Max: ${salaryRange.max.toLocaleString()}</Text>
        <Slider
          style={styles.slider}
          minimumValue={50000}
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

        <Text style={styles.label}>Job Type</Text>
        <View style={styles.jobTypeContainer}>
          {Object.keys(jobTypes).map((type) => (
            <CheckBox
              key={type}
              title={`${jobTypeLabels[type]} (${Math.floor(Math.random() * 200) + 50})`}
              checked={jobTypes[type]}
              onPress={() => toggleJobType(type)}
              checkedColor="#6a11cb"
              containerStyle={styles.checkBox}
            />
          ))}
        </View>

        <Text style={styles.label}>Experience Level</Text>
        <View style={styles.experienceContainer}>
          {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
            <TouchableOpacity key={level} onPress={() => setExperience(level)}>
              <Text style={[styles.experience, experience === level && styles.selectedExperience]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setExperience("")}> 
            <Text style={styles.experience}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
        <LinearGradient colors={["#601cd6", "#601cd6"]} style={styles.gradientButton}>
        <Button title="SHOW RESULT" buttonStyle={styles.searchButton} onPress={handleSearch} />
      </LinearGradient>

      <Button title="CLEAR" type="outline" buttonStyle={styles.clearButton} titleStyle={{ color: "#601cd6" }} onPress={clearFilters} 
/>

        </View>
      </ScrollView>

      <Avatar rounded source={{ uri: "https://randomuser.me/api/portraits/women/57.jpg" }} size="medium" containerStyle={styles.avatar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  filterBox: { backgroundColor: "white", margin: 10, padding: 20, borderRadius: 10, elevation: 3 },
  label: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  salaryText: { fontSize: 14, marginBottom: 5 },
  slider: { width: "100%", height: 40 },
  jobTypeContainer: { flexWrap: "wrap", flexDirection: "row", justifyContent: "space-between" },
  checkBox: { backgroundColor: "transparent", borderWidth: 0, padding: 0 },
  experienceContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  experience: { fontSize: 16, padding: 10, color: "gray" },
  selectedExperience: { color: "#6a11cb", fontWeight: "bold", textDecorationLine: "underline" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  avatar: { position: "absolute", bottom: 20, right: 20 },
  header: {height: 60,flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingHorizontal: 15,},
  backButton: {padding: 10,},
  headerTitle: {color: '#fff',fontSize: 18,fontWeight: 'bold',},
  searchButton:{color:"#6a11cb"},
  gradientButton: {borderRadius: 5,overflow: "hidden",marginBottom: 10,},
  searchButton: {backgroundColor: "transparent", paddingVertical: 12,},
  clearButton: {borderColor: "#601cd6", borderWidth: 2,  paddingVertical: 12,backgroundColor: "transparent",},
  
});

export default FilterScreen;