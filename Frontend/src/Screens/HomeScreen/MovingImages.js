import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const images = [
    require('../../assets/slider1.jpg'),
    require('../../assets/slider2.jpg'),
    require('../../assets/slider3.jpg'),
    require('../../assets/slider4.jpg'),
  ];
  

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToOffset({ 
        offset: nextIndex * width, 
        animated: true 
      });
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  const handleImagePress = (index) => {
    if (index === 2) { 
      navigation.navigate('Chatbot');
    }else if (index === 3){
      navigation.navigate('FilterScreen');
    }
  };
  

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
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.slide}
            activeOpacity={0.9}
            onPress={() => handleImagePress(index)}
          >
            <Image source={item} style={styles.image} />
          </TouchableOpacity>
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