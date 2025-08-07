import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Platform } from 'react-native';

const AnimatedTouchable = ({ 
  children, 
  onPress, 
  style,
  animationType = 'scale', // 'scale', 'opacity', 'bounce', 'lift'
  scaleValue = 0.95,
  opacityValue = 0.7,
  duration = 150,
  disabled = false,
  ...props 
}) => {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;

    switch (animationType) {
      case 'scale':
        Animated.spring(animatedScale, {
          toValue: scaleValue,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
        break;
      
      case 'opacity':
        Animated.timing(animatedOpacity, {
          toValue: opacityValue,
          duration: duration,
          useNativeDriver: true,
        }).start();
        break;
      
      case 'bounce':
        Animated.sequence([
          Animated.timing(animatedScale, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(animatedScale, {
            toValue: 1.05,
            useNativeDriver: true,
            tension: 300,
            friction: 8,
          }),
        ]).start();
        break;
      
      case 'lift':
        Animated.parallel([
          Animated.timing(animatedScale, {
            toValue: 1.02,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 0.9,
            duration: duration,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      
      default:
        Animated.timing(animatedValue, {
          toValue: 0.95,
          duration: duration,
          useNativeDriver: true,
        }).start();
    }
  };

  const handlePressOut = () => {
    if (disabled) return;

    switch (animationType) {
      case 'scale':
        Animated.spring(animatedScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
        break;
      
      case 'opacity':
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }).start();
        break;
      
      case 'bounce':
        Animated.spring(animatedScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 8,
        }).start();
        break;
      
      case 'lift':
        Animated.parallel([
          Animated.timing(animatedScale, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      
      default:
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }).start();
    }
  };

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'scale':
        return {
          transform: [{ scale: animatedScale }],
        };
      
      case 'opacity':
        return {
          opacity: animatedOpacity,
        };
      
      case 'bounce':
      case 'lift':
        return {
          transform: [{ scale: animatedScale }],
          opacity: animatedOpacity,
        };
      
      default:
        return {
          transform: [{ scale: animatedValue }],
        };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Animated.View style={[style, getAnimatedStyle()]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedTouchable; 