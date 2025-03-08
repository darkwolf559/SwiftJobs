import React from "react";
import { useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Animated, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import OnboardingItem from "./onboardingItem.js";
import slides from "../../slides.js";
import Paginator from "../compenents/Paginator.js";
import NextButton from "../compenents/NextButton.js";

const Onboarding = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slideRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };
  
  const navigateToLogin = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.flatlistContainer}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slideRef}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Paginator data={slides} scrollX={scrollX} />
        
        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={navigateToLogin}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <NextButton 
            scrollTo={scrollTo} 
            percentage={(currentIndex) * (100 / (slides.length - 1))} 
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatlistContainer: {
    flex: 3,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  continueButton: {
    backgroundColor: '#F4338F',
    padding: 15,
    borderRadius: 30,
    width: 200,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default Onboarding;