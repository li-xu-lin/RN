import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = '加载中...', 
  color = '#8B5CF6',
  style 
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    
    spinAnimation.start();
    
    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 40;
      case 'large': return 60;
      default: return 40;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: getSize(),
            height: getSize(),
            borderColor: `${color}20`,
            borderTopColor: color,
            transform: [{ rotate: spin }],
          },
        ]}
      />
      {text && <Text style={[styles.text, { color }]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    borderWidth: 4,
    borderRadius: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingSpinner; 