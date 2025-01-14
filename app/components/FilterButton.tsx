import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSortContext } from '../context/SortContext';

export function FilterButton() {
    const { sortOption, setSortOption } = useSortContext();

    const handlePress = () => {
        if (!sortOption) {
            setSortOption('highToLow');
        } else if (sortOption === 'highToLow') {
            setSortOption('lowToHigh');
        } else {
            setSortOption(null);
        }
    };

    return (
        <TouchableOpacity style={styles.iconButton} onPress={handlePress}>
            <Ionicons name="filter-outline" size={24} color="#000" />
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