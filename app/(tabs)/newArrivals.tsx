import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { useFavorites } from '../context/FavoritesContext';
import { FavoriteButton } from '../components/FavoriteButton';
import { FilterButton } from '../components/FilterButton';

interface Watch {
    id: string;
    brand: string;
    model: string;
    price: number;
    condition: string;
    dateAdded: string;
}

interface WatchCardProps {
    watch: Watch;
}

const newArrivalsData: Watch[] = [
    {
        id: '1',
        brand: 'Rolex',
        model: 'Daytona',
        price: 45000,
        condition: 'New',
        dateAdded: '2024-01-14'
    },
    {
        id: '2',
        brand: 'Vacheron Constantin',
        model: 'Daytona',
        price: 30000,
        condition: 'New',
        dateAdded: '2024-01-14'
    },
    {
        id: '3',
        brand: 'Patek Philippe',
        model: 'Nautilus',
        price: 185000,
        condition: 'Like New',
        dateAdded: '2024-01-13'
    },
   
];



const WatchCard: React.FC<WatchCardProps> = ({ watch }) => {
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
        <TouchableOpacity style={styles.watchCard}>
            <View style={styles.watchImagePlaceholder} />
            <View style={styles.watchInfo}>
                <View style={styles.topRow}>
                    <Text style={styles.newTag}>NEW</Text>
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
                <Text style={styles.brandName}>{watch.brand}</Text>
                <Text style={styles.modelName}>{watch.model}</Text>
                <Text style={styles.condition}>{watch.condition}</Text>
                <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default function NewArrivalsScreen() {
    return (
        <View style={styles.container}>
            <FixedHeader />
            <FavoriteButton/>
            <FilterButton/>
            <SearchBar />
            <FlatList
                data={newArrivalsData}
                renderItem={({ item }) => <WatchCard watch={item} />}
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
    watchCard: {
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
    watchImagePlaceholder: {
        width: 120,
        height: 120,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginRight: 15,
    },
    watchInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    newTag: {
        color: '#00a86b',
        fontSize: 12,
        fontWeight: '600',
    },
    favoriteButton: {
        padding: 4,
    },
    brandName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#002d4e',
        marginBottom: 4,
    },
    modelName: {
        fontSize: 16,
        color: '#444',
        marginBottom: 4,
    },
    condition: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: '#002d4e',
    },
});