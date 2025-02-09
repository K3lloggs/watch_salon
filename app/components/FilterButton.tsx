// app/components/FilterButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function FilterButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/FilterScreen');
  };

  return (
    <TouchableOpacity style={[styles.iconButton, styles.filterButton]} onPress={handlePress}>
      <Ionicons name="filter-outline" size={24} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    position: 'absolute',
    top: 55, // Adjust for your safe area
    zIndex: 1,
  },
  filterButton: {
    right: 16,
  },
});
