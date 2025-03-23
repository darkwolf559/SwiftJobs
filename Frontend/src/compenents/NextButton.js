import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';
import Svg, { G, Circle } from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';

const NextButton = ({ percentage , scrollTo }) => {
    const size = 128;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);

    const animateToValue = (toValue) => {
        Animated.timing(progressAnimation, {
            toValue,
            duration: 400, 
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        animateToValue(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener((value) => {
            const strokeDashoffset = circumference - (circumference * value.value) / 100;

            if (progressRef?.current) {
                progressRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }
        });

        return () => {
            progressAnimation.removeAllListeners();
        };
    }, []);


    

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={center}>
                    <Circle
                        stroke="#E6E7E8"
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        ref={progressRef}
                        stroke="#F4338F"
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        fill="none"
                        strokeLinecap="round"
                    />
                </G>
            </Svg>

            <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={0.6}>
               
                <AntDesign name="arrowright" size={32} color="#fff" style={styles.arrow} />
           
            </TouchableOpacity>



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
        backgroundColor: '#F4338F', // Pink color
        width: 80,  // Ensuring equal width and height for a perfect circle
        height: 80,
        borderRadius: 128 / 2,  // Half the width/height for a full circle
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
   
});

export default NextButton;
