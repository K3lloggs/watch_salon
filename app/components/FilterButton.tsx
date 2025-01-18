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
        <TouchableOpacity 
            style={[styles.iconButton, styles.filterButton]} 
            onPress={handlePress}
        >
            <Ionicons name="filter-outline" size={24} color="#000" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        padding: 8,
        position: 'absolute',
        top: 55, // Adjust based on your safe area
        zIndex: 1,
    },
    filterButton: {
        right: 16,
    },
});