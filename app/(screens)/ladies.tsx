import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';

const ladiesWatchesData = [
    {
        id: '1',
        brand: 'Cartier',
        model: 'Tank Française',
        price: 25000,
        type: 'Ladies',
        dial: 'Silver',
        movement: 'Automatic',
        powerReserve: '48 hours',
        strap: 'Leather',
        image: 'url_to_image'
    },
    {
        id: '2',
        brand: 'Rolex',
        model: 'Lady-Datejust',
        price: 35000,
        type: 'Ladies'
    },
    {
        id: '3',
        brand: 'Patek Philippe',
        model: 'Twenty~4',
        price: 45000,
        type: 'Ladies'
    },
];

export default function LadiesScreen() {
    return (
        <View style={styles.container}>
            <FixedHeader />
            <SearchBar />
            <FlatList
                data={ladiesWatchesData}
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
});