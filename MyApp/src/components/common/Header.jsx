import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = ({
  title,
  showBack = true,
  rightComponent,
  onBackPress,
  backgroundColor = '#8B5CF6',
  textColor = '#fff',
  style,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor }, style]}>
      <View style={styles.headerContent}>
        {showBack && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
            <Text style={[styles.backIcon, { color: textColor }]}>←</Text>
          </TouchableOpacity>
        )}
        
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'center',
  },
});

export default Header; 