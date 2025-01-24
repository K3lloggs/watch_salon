import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function FavoriteButton() {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={[styles.iconButton, styles.favoriteButton]}
            onPress={() => router.push('./favorites')}
        >
            <Ionicons
                name="heart-outline"
                size={25} // Increased size by 5%
                color="#000" // Black outline for visibility
            />
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
    favoriteButton: {
        left: 16,
    },
});
