import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';

const complicationsData = [
    {
        id: '1',
        brand: 'Patek Philippe',
        model: 'Perpetual Calendar',
        price: 185000,
        year: '2023',
    },
    {
        id: '2',
        brand: 'A. Lange & Söhne',
        model: 'Datograph',
        price: 145000,
        year: '2023',
    },
    {
        id: '3',
        brand: 'Vacheron Constantin',
        model: 'Traditionnelle',
        price: 165000,
        year: '2023',
    },
];

export default function ComplicationsScreen() {
    return (
        <View style={styles.container}>
            <FixedHeader />
            <SearchBar />
            <FlatList
                data={complicationsData}
                renderItem={({ item }) => <WatchCard watch={item} />}
                keyExtractor={item => item.id}
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