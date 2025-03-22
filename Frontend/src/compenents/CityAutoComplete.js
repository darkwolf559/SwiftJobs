import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';

// List of Sri Lankan cities
const sriLankaCities = [
  "Colombo",
  "Dehiwala-Mount Lavinia",
  "Moratuwa",
  "Jaffna",
  "Negombo",
  "Pita Kotte",
  "Sri Jayewardenepura Kotte",
  "Kandy",
  "Trincomalee",
  "Kalmunai",
  "Galle",
  "Batticaloa",
  "Anuradhapura",
  "Ratnapura",
  "Badulla",
  "Matara",
  "Puttalam",
  "Chilaw",
  "Kurunegala",
  "Gampaha",
  "Matale",
  "Kalutara",
  "Mannar",
  "Vavuniya",
  "Nuwara Eliya",
  "Hambantota",
  "Ampara",
  "Monaragala",
  "Polonnaruwa",
  "Hatton",
  "Dambulla",
  "Beruwala",
  "Weligama",
  "Nawalapitiya",
  "Bandarawela",
  "Tangalle",
  "Ambalangoda",
  "Kegalle",
  "Avissawella",
  "Kelaniya",
  "Panadura",
  "Homagama",
  "Wattala",
  "Minuwangoda",
  "Horana",
  "Kuliyapitiya",
  "Kaduwela",
  "Embilipitiya",
  "Point Pedro"
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

  // Handle city selection
  const handleCitySelect = (city) => {
    setSearchText(city);
    setShowDropdown(false);
    onCitySelect(city);
    
    // Blur the input to hide keyboard
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

      {/* Dropdown menu with absolute positioning */}
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
    top: 50, // Position below input
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