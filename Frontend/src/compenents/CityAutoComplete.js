import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';

// List of Sri Lankan cities
const sriLankaCities = [
"Kudawa", "Polonnaruwa", "Anuradhapura", "Habarana", "Hiriwadunna", "Kitulgala", "Ratnapura", "Kalaoya", "Maragahawewa", "Ambepussa", "Yatiyanthota", "Weligatta", "Asgiriya", "Bandaragama", "Panadura", "Dambana", "Belihuloya", "Habaraduwa", "Talpe", "Jaffna", "Vavuniya", "Kalpitiya", "Dambadeniya", "Kurunegala", "Tangalle", "Tissamaharama", "Yoda Kandiya", "Debarawewa", "Galle", "Kosgoda", "Ahungalla", "Hikkaduwa", "Weligama", "Kataragama", "Dikwella", "Hambantota", "Kirinda", "Bentota", "Ambalangoda", "Mirissa", "Lukasgoda", "Matara", "Ahangama", "Balapitiya", "Unawatuna", "Weerawila", "Palatupana", "Koggala", "Induruwa", "Girithale", "Hingurakgoda", "Galoya", "Pallewela", "Gampaha", "Talalla", "Ranna", "Demodara", "Mannar", "Badulla", "Udawalawa", "Ella", "Gampola", "Uppuveli", "Pasikuda", "Trincomalee", "Pottuvil", "Minneriya", "Batticaloa", "Nilaveli", "Arugam Bay", "Heeloya", "Sinharagama", "Pahala Maragahawewa", "Galkadawala", "Dambulla", "Idalgashinna", "Mawanella", "Gadaladeniya", "Ohiya", "Matale", "Embekka", "Giragama", "Bandarawela", "Meemure", "Sigiriya", "Hunnasgiriya", "Kandy", "Haputale", "Kandalama", "Nanuoya", "Nuwara Eliya", "Colombo", "Ja-Ela", "Bopitiya", "Kalutara", "Wattala", "Moragalla", "Pinnawala", "Negombo", "Wadduwa", "Dehiwala-Mount Lavinia", "Katunayake", "Elakanda", "Aluthgama", "Uswetakeiyawa", "Sri Jayawardenepura Kotte", "Beruwala"
];

const { width } = Dimensions.get('window');

const CityAutocomplete = ({ onCitySelect, initialValue = '', error }) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  // Update filtered cities when searchText changes
  useEffect(() => {
    if (searchText.length >= 2) {
      const filtered = sriLankaCities.filter(
        city => city.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowDropdown(false);
    }
  }, [searchText]);


  const handleCitySelect = (city) => {
    setSearchText(city);
    setShowDropdown(false);
    onCitySelect(city);
    

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={[styles.input, error && styles.inputError]}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Enter city name"
        onFocus={() => {
          if (searchText.length >= 2 && filteredCities.length > 0) {
            setShowDropdown(true);
          }
        }}
      />

     
      {showDropdown && (
        <View style={styles.dropdown}>
          <ScrollView 
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {filteredCities.map((city) => (
              <TouchableOpacity
                key={city}
                style={styles.cityItem}
                onPress={() => handleCitySelect(city)}
              >
                <Text style={styles.cityItemText}>{city}</Text>
              </TouchableOpacity>
            ))}
            
            {filteredCities.length === 0 && searchText.length >= 2 && (
              <Text style={styles.noResultsText}>No cities found. Try a different search.</Text>
            )}
          </ScrollView>
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 999, 
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#e94b97',
  },
  errorText: {
    color: '#e94b97',
    fontSize: 14,
    marginTop: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 50, 
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollView: {
    maxHeight: 200,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cityItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cityItemText: {
    fontSize: 16,
    color: '#333',
  },
  noResultsText: {
    padding: 15,
    textAlign: 'center',
    color: '#999',
  }
});

export default CityAutocomplete;