// app/(tabs)/newArrivals.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';
import { FavoriteButton } from '../components/FavoriteButton';
import { FilterButton } from '../components/FilterButton';

const newArrivalsData = [
    { 
        id: '1', 
        brand: 'Rolex', 
        model: 'Daytona', 
        price: 45000, 
        year: '2024' 
    },
    { 
        id: '2', 
        brand: 'Vacheron Constantin', 
        model: 'Overseas', 
        price: 89500, 
        year: '2024' 
    },
    { 
        id: '3', 
        brand: 'Patek Philippe', 
        model: 'Nautilus', 
        price: 185000, 
        year: '2024' 
    }
];

export default function NewArrivalsScreen() {
    return (
        <View style={styles.container}>
            <FilterButton />
            <FavoriteButton />
            <FixedHeader />
            <SearchBar />
            <FlatList
                data={newArrivalsData}
                renderItem={({item}) => <WatchCard watch={item} />}
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
    }
});