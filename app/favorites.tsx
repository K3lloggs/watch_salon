// app/favorites.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFavorites, Watch, ArtPiece } from './context/FavoritesContext';
import { WatchCard } from './components/WatchCard';
import { ArtCard } from './components/ArtCard';
import { FixedHeader } from './components/FixedHeader';

// Use the imported types
type FavoriteItem = Watch | ArtPiece;

export default function FavoritesScreen() {
    const { favorites } = useFavorites();

    const isWatch = (item: FavoriteItem): item is Watch => {
        return 'brand' in item && 'model' in item;
    };

    const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => {
        if (isWatch(item)) {
            return <WatchCard watch={item} />;
        } else {
            return <ArtCard art={item} />;
        }
    };

    if (favorites.length === 0) {
        return (
            <View style={styles.container}>
                
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
                renderItem={renderFavoriteItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    list: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
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