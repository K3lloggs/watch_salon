import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFavorites, Watch, ArtPiece } from './context/FavoritesContext';
import { WatchCard } from './components/WatchCard';
import { ArtCard } from './components/ArtCard';
import { FixedHeader } from './components/FixedHeader';

export default function FavoritesScreen() {
    const { favorites } = useFavorites();

    const renderItem = ({ item }: { item: Watch | ArtPiece }) => {
        // Check if item is a Watch by looking for watch-specific properties
        if ('brand' in item && 'model' in item) {
            return <WatchCard watch={item as Watch} />;
        } else {
            return <ArtCard art={item as ArtPiece} />;
        }
    };

    if (favorites.length === 0) {
        return (
            <View style={styles.container}>
                <FixedHeader />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                    <Text style={styles.emptyText}>
                        Tap the heart icon on any item to add it to your favorites
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FixedHeader />
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    listContent: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#002d4e',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
});