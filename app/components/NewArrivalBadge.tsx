// components/NewArrivalBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function NewArrivalBadge() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.text}>NEW</Text>
      </View>
      <View style={styles.triangle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  badge: {
    backgroundColor: '#002d4e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  triangle: {
    position: 'absolute',
    right: -6,
    top: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderRightColor: 'transparent',
    borderTopColor: '#001f36', // Slightly darker shade for 3D effect
  },
});