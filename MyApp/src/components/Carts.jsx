import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Carts() {
  const categories = [
    { id: 1, name: '塔罗占卜', icon: '🔮' },
    { id: 2, name: '星座运势', icon: '⭐' },
    { id: 3, name: '月相占卜', icon: '🌙' },
  ]

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={styles.card}>
          <Text style={styles.iconText}>{category.icon}</Text>
          <Text style={styles.cardText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '30%',
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 15,
  },
  iconText: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
})
