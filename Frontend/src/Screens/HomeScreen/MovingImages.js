import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  
  // You'll replace these with your actual asset imports
  const images = [
    require('../../assets/slider1.jpg'),
    require('../../assets/slider2.jpg'),
    require('../../assets/slider3.jpeg'),
    require('../../assets/slider4.png'),
  ];
  
  // Auto play
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToOffset({ 
        offset: nextIndex * width, 
        animated: true 
      });
    }, 3000); // Change images every 3 seconds
    
    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(ev) => {
          const newIndex = Math.round(ev.nativeEvent.contentOffset.x / width);
          setActiveIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item} style={styles.image} />
          </View>
        )}
      />
      
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        height: 200, 
        width: width, 
      },
      slide: {
        width: width,
        height: '100%',
      },
      image: {
        width: width,
        height: '100%',
        resizeMode: 'cover',
      },
      pagination: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
      },
      activeDot: {
        backgroundColor: 'white',
      },
    });

export default ImageCarousel;