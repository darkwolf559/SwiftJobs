import React, { useState, useCallback, useMemo } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  PanResponder,
  Animated
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import CityAutocomplete from "../compenents/CityAutoComplete";

// Custom Range Slider Component with dual thumbs
const RangeSlider = ({ 
  minimumValue, 
  maximumValue, 
  initialMinValue,
  initialMaxValue,
  step,
  onValueChange,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor
}) => {
  const [sliderWidth, setSliderWidth] = useState(1);
  const [minValue, setMinValue] = useState(initialMinValue);
  const [maxValue, setMaxValue] = useState(initialMaxValue);
  
  const minThumbX = useMemo(() => new Animated.Value(0), []);
  const maxThumbX = useMemo(() => new Animated.Value(0), []);
  
  // Calculate position from value
  const getPositionFromValue = (value) => {
    const range = maximumValue - minimumValue;
    const percentage = (value - minimumValue) / range;
    return percentage * sliderWidth;
  };
  
  // Calculate value from position
  const getValueFromPosition = (position) => {
    const range = maximumValue - minimumValue;
    const percentage = position / sliderWidth;
    return percentage * range + minimumValue;
  };
  
  // Apply step to value
  const applyStep = (value) => {
    if (!step || step <= 0) return value;
    return Math.round(value / step) * step;
  };
  
  // Set initial positions
  React.useEffect(() => {
    if (sliderWidth > 1) {
      minThumbX.setValue(getPositionFromValue(minValue));
      maxThumbX.setValue(getPositionFromValue(maxValue));
    }
  }, [sliderWidth, minValue, maxValue, minThumbX, maxThumbX]);
  
  // Min thumb pan responder
  const minThumbPanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      minThumbX.setOffset(minThumbX._value);
      minThumbX.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      let newX = gestureState.dx;
      
      // Constrain within slider bounds and max thumb
      const maxThumbPosition = maxThumbX._value + maxThumbX._offset;
      if (minThumbX._offset + newX < 0) {
        newX = -minThumbX._offset;
      } else if (minThumbX._offset + newX > maxThumbPosition - 20) { // 20 is thumb width
        newX = maxThumbPosition - minThumbX._offset - 20;
      }
      
      minThumbX.setValue(newX);
    },
    onPanResponderRelease: () => {
      minThumbX.flattenOffset();
      
      // Update value based on position
      const newMinValue = applyStep(getValueFromPosition(minThumbX._value));
      setMinValue(newMinValue);
      
      // Snap to stepped position
      Animated.timing(minThumbX, {
        toValue: getPositionFromValue(newMinValue),
        duration: 100,
        useNativeDriver: true
      }).start();
      
      // Notify parent
      onValueChange({ min: newMinValue, max: maxValue });
    }
  }), [sliderWidth, minValue, maxValue, minThumbX, maxThumbX]);
  
  // Max thumb pan responder
  const maxThumbPanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      maxThumbX.setOffset(maxThumbX._value);
      maxThumbX.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      let newX = gestureState.dx;
      
      // Constrain within slider bounds and min thumb
      const minThumbPosition = minThumbX._value + minThumbX._offset;
      if (maxThumbX._offset + newX < minThumbPosition + 20) { // 20 is thumb width
        newX = minThumbPosition - maxThumbX._offset + 20;
      } else if (maxThumbX._offset + newX > sliderWidth) {
        newX = sliderWidth - maxThumbX._offset;
      }
      
      maxThumbX.setValue(newX);
    },
    onPanResponderRelease: () => {
      maxThumbX.flattenOffset();
      
      // Update value based on position
      const newMaxValue = applyStep(getValueFromPosition(maxThumbX._value));
      setMaxValue(newMaxValue);
      
      // Snap to stepped position
      Animated.timing(maxThumbX, {
        toValue: getPositionFromValue(newMaxValue),
        duration: 100,
        useNativeDriver: true
      }).start();
      
      // Notify parent
      onValueChange({ min: minValue, max: newMaxValue });
    }
  }), [sliderWidth, minValue, maxValue, minThumbX, maxThumbX]);
  
  // Handle track press
  const handleTrackPress = (event) => {
    const { locationX } = event.nativeEvent;
    
    // Determine which thumb to move (closest one)
    const minThumbPosition = minThumbX._value;
    const maxThumbPosition = maxThumbX._value;
    
    const distanceToMin = Math.abs(locationX - minThumbPosition);
    const distanceToMax = Math.abs(locationX - maxThumbPosition);
    
    if (distanceToMin <= distanceToMax) {
      // Move min thumb
      const newMinValue = applyStep(getValueFromPosition(locationX));
      if (newMinValue < maxValue) {
        setMinValue(newMinValue);
        Animated.timing(minThumbX, {
          toValue: getPositionFromValue(newMinValue),
          duration: 150,
          useNativeDriver: true
        }).start();
        onValueChange({ min: newMinValue, max: maxValue });
      }
    } else {
      // Move max thumb
      const newMaxValue = applyStep(getValueFromPosition(locationX));
      if (newMaxValue > minValue) {
        setMaxValue(newMaxValue);
        Animated.timing(maxThumbX, {
          toValue: getPositionFromValue(newMaxValue),
          duration: 150,
          useNativeDriver: true
        }).start();
        onValueChange({ min: minValue, max: newMaxValue });
      }
    }
  };
  
  return (
    <View 
      style={styles.sliderContainer}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setSliderWidth(width - 20); // Adjust for thumb width
      }}
    >
      {/* Track background */}
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.sliderTrack,
          { backgroundColor: maximumTrackTintColor }
        ]}
        onPress={handleTrackPress}
      />
      
      {/* Active track fill */}
      <Animated.View
        style={[
          styles.sliderFill,
          { 
            backgroundColor: minimumTrackTintColor,
            left: minThumbX,
            right: Animated.subtract(sliderWidth, maxThumbX)
          }
        ]}
      />
      
      {/* Min thumb */}
      <Animated.View
        style={[
          styles.sliderThumb,
          { 
            backgroundColor: thumbTintColor,
            transform: [{ translateX: minThumbX }],
            zIndex: 1
          }
        ]}
        {...minThumbPanResponder.panHandlers}
      />
      
      {/* Max thumb */}
      <Animated.View
        style={[
          styles.sliderThumb,
          { 
            backgroundColor: thumbTintColor,
            transform: [{ translateX: maxThumbX }],
            zIndex: 1
          }
        ]}
        {...maxThumbPanResponder.panHandlers}
      />
    </View>
  );
};

const FilterScreen = () => {
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 300000 });
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

  const handleSalaryRangeChange = useCallback((range) => {
    setSalaryRange(range);
  }, []);
 
  const toggleCategory = useCallback((category) => {
    setCategories((prevCategories) => ({
      ...prevCategories,
      [category]: !prevCategories[category],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSalaryRange({ min: 0, max: 300000 });
    setCategories(initialCategories);
    setLocation('');
  }, [initialCategories]);

  // Handle search with applied filters
  const handleSearch = useCallback(() => {
    const filters = {
      salaryRange: salaryRange,
      categories: Object.keys(categories).filter(cat => categories[cat]),
      location,
    };
    
    navigation.navigate('AllJobsScreen', { 
      filters: filters 
    });
  }, [salaryRange, categories, location, navigation]);

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
        contentContainerStyle={styles.filterBox} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Salary Range</Text>
        <View style={styles.rangeTextContainer}>
          <Text style={styles.rangeText}>Min: LKR {salaryRange.min.toLocaleString()}</Text>
          <Text style={styles.rangeText}>Max: LKR {salaryRange.max.toLocaleString()}</Text>
        </View>
        
        <RangeSlider 
          minimumValue={0}
          maximumValue={500000}
          initialMinValue={salaryRange.min}
          initialMaxValue={salaryRange.max}
          step={5000}
          onValueChange={handleSalaryRangeChange}
          minimumTrackTintColor="#6a11cb"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#6a11cb"
        />
        
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMinLabel}>0</Text>
          <Text style={styles.sliderMaxLabel}>500k</Text>
        </View>

        <Text style={styles.label}>Location</Text>
        <CityAutocomplete 
          onCitySelect={setLocation}
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
          <TouchableOpacity
            style={styles.searchButtonContainer}
            onPress={handleSearch}
            activeOpacity={0.8}
          >
            <LinearGradient 
              colors={["#601cd6", "#601cd6"]} 
              style={styles.gradientButton}
            >
              <Text style={styles.searchButtonText}>SHOW RESULT</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButtonContainer}
            onPress={clearFilters}
            activeOpacity={0.8}
          >
            <Text style={styles.clearButtonText}>CLEAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  filterBox: { 
    backgroundColor: "white", 
    margin: 10, 
    padding: 20, 
    borderRadius: 10, 
    elevation: 3,
    paddingBottom: 100 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginVertical: 15 
  },
  rangeTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  rangeText: {
    fontSize: 14,
    color: '#444'
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    marginVertical: 10
  },
  sliderTrack: {
    position: 'absolute',
    height: 4,
    width: '100%',
    borderRadius: 2
  },
  sliderFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  sliderMinLabel: {
    fontSize: 14,
    color: '#666'
  },
  sliderMaxLabel: {
    fontSize: 14,
    color: '#666'
  },
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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backButton: { 
    padding: 10 
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  searchButtonContainer: {
    flex: 1,
    marginRight: 10,
    height: 45
  },
  gradientButton: { 
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  clearButtonContainer: {
    width: '40%',
    height: 45,
    borderWidth: 2,
    borderColor: "#601cd6",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  clearButtonText: {
    color: "#601cd6",
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default FilterScreen;