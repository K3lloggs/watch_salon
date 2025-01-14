import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites, Watch } from '../context/FavoritesContext';

interface WatchCardProps {
    watch: Watch;
}

export function WatchCard({ watch }: WatchCardProps) {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const isLiked = isFavorite(watch.id);

    const toggleFavorite = () => {
        if (isLiked) {
            removeFavorite(watch.id);
        } else {
            addFavorite(watch);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer} />
            <View style={styles.details}>
                <Text style={styles.brand}>{watch.brand}</Text>
                <Text style={styles.model}>{watch.model}</Text>
                {watch.year && <Text style={styles.year}>{watch.year}</Text>}
                {watch.condition && <Text style={styles.condition}>{watch.condition}</Text>}
                <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
            </View>
            <TouchableOpacity
                style={styles.heartButton}
                onPress={toggleFavorite}
            >
                <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={24}
                    color={isLiked ? "#ff4d4d" : "#002d4e"}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginRight: 15,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    brand: {
        fontSize: 18,
        fontWeight: '600',
        color: '#002d4e',
    },
    model: {
        fontSize: 16,
        color: '#444',
        marginVertical: 4,
    },
    year: {
        fontSize: 14,
        color: '#666',
    },
    condition: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#002d4e',
        marginTop: 4,
    },
    heartButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 4,
    },
});