import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Titles() {
  return (
    <View style={styles.header}>
      <Text style={styles.titleText}>🌟 神秘占卜殿堂</Text>
      <TouchableOpacity>
        <Text style={styles.moreText}>全部 ></Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f5ff',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
  },
  moreText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
})
