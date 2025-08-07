import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const Card = ({ 
  children, 
  style, 
  onPress, 
  elevation = 3, 
  shadowColor = '#8B5CF6',
  borderRadius = 15,
  padding = 20,
  ...props 
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[
        styles.card,
        {
          borderRadius,
          padding,
          shadowColor,
          elevation,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        style
      ]}
      onPress={onPress}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
});

export default Card; 