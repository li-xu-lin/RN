import React, { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';

const PulseAnimation = ({ 
  children, 
  style,
  duration = 2000,
  minScale = 0.95,
  maxScale = 1.05,
  minOpacity = 0.7,
  maxOpacity = 1,
  pulseType = 'scale', // 'scale', 'opacity', 'both'
  autoStart = true,
  loop = true,
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const createPulseAnimation = () => {
    const animations = [];

    if (pulseType === 'scale' || pulseType === 'both') {
      animations.push(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: maxScale,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: minScale,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ])
      );
    }

    if (pulseType === 'opacity' || pulseType === 'both') {
      animations.push(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: minOpacity,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: maxOpacity,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ])
      );
    }

    return animations.length === 1 ? animations[0] : Animated.parallel(animations);
  };

  const startPulse = () => {
    const animation = createPulseAnimation();
    
    if (loop) {
      Animated.loop(animation).start();
    } else {
      animation.start();
    }
  };

  const stopPulse = () => {
    scaleAnim.stopAnimation();
    opacityAnim.stopAnimation();
    
    // 重置到初始值
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (autoStart) {
      startPulse();
    }

    return () => {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [autoStart]);

  const getAnimatedStyle = () => {
    let animatedStyle = {};

    if (pulseType === 'scale' || pulseType === 'both') {
      animatedStyle.transform = [{ scale: scaleAnim }];
    }

    if (pulseType === 'opacity' || pulseType === 'both') {
      animatedStyle.opacity = opacityAnim;
    }

    return animatedStyle;
  };

  return (
    <Animated.View style={[style, getAnimatedStyle()]} {...props}>
      {children}
    </Animated.View>
  );
};

export default PulseAnimation; 