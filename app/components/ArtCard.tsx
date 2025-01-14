import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites, ArtPiece } from '../context/FavoritesContext';

interface ArtCardProps {
    art: ArtPiece;
    onPress?: () => void;
}

export function ArtCard({ art, onPress }: ArtCardProps) {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const isLiked = isFavorite(art.id);

    const toggleFavorite = (e: any) => {
        e.stopPropagation();
        if (isLiked) {
            removeFavorite(art.id);
        } else {
            addFavorite(art);
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.imageContainer} />
            <View style={styles.details}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{art.title}</Text>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                    >
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={24}
                            color={isLiked ? "#ff4d4d" : "#002d4e"}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.artist}>{art.artist}</Text>

                <View style={styles.infoRow}>
                    {art.year && <Text style={styles.year}>{art.year}</Text>}
                    {art.medium && <Text style={styles.medium}>{art.medium}</Text>}
                </View>

                {art.dimensions && (
                    <Text style={styles.dimensions}>{art.dimensions}</Text>
                )}

                {art.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {art.description}
                    </Text>
                )}

                <Text style={styles.price}>
                    {art.price || 'Price Upon Request'}
                </Text>
            </View>
        </TouchableOpacity>
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
        width: 120,
        height: 120,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginRight: 15,
    },
    details: {
        flex: 1,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#002d4e',
        flex: 1,
        marginRight: 8,
    },
    favoriteButton: {
        padding: 4,
    },
    artist: {
        fontSize: 16,
        color: '#444',
        marginBottom: 4,
        fontStyle: 'italic',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    year: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    medium: {
        fontSize: 14,
        color: '#666',
    },
    dimensions: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#002d4e',
        marginTop: 4,
    },
});