import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Swipers() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardEmoji}>🔮</Text>
        <Text style={styles.cardTitle}>每日塔罗</Text>
        <Text style={styles.cardSubtitle}>探索内心的声音</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: "95%",
    height: "85%",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 20,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '400',
  },
})
