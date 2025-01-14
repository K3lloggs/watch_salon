import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <TouchableOpacity 
      style={styles.iconButton}
      onPress={() => setIsFavorite(!isFavorite)}
    >
      <Ionicons 
        name={isFavorite ? "heart" : "heart-outline"} 
        size={24} 
        color={isFavorite ? "#ff4d4d" : "#000"} 
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#ffffff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#002d4e',
    },
    iconButton: {
      padding: 8,
    },
  });
