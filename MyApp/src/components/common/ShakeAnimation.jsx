import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Animated } from 'react-native';

const ShakeAnimation = forwardRef(({ 
  children, 
  style,
  duration = 500,
  intensity = 10,
  direction = 'horizontal', // 'horizontal', 'vertical'
  ...props 
}, ref) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const shake = () => {
    // 重置动画值
    animatedValue.setValue(0);

    // 创建摇摆动画序列
    const shakeSequence = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: intensity,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -intensity,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: intensity * 0.8,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -intensity * 0.6,
        duration: duration / 4,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: intensity * 0.4,
        duration: duration / 8,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 8,
        useNativeDriver: true,
      }),
    ]);

    shakeSequence.start();
  };

  // 暴露shake方法给父组件
  useImperativeHandle(ref, () => ({
    shake,
  }));

  const getAnimatedStyle = () => {
    const translateKey = direction === 'horizontal' ? 'translateX' : 'translateY';
    
    return {
      transform: [
        {
          [translateKey]: animatedValue
        }
      ]
    };
  };

  return (
    <Animated.View style={[style, getAnimatedStyle()]} {...props}>
      {children}
    </Animated.View>
  );
});

ShakeAnimation.displayName = 'ShakeAnimation';

export default ShakeAnimation; 