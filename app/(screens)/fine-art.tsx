import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { ArtCard } from '../components/ArtCard';

const artData = [
    {
        id: '1',
        title: 'Summer Garden',
        artist: 'Claude Monet',
        year: '1872',
        medium: 'Oil on Canvas',
        dimensions: '60 x 80 cm',
        description: 'An impressionist masterpiece capturing the beauty of a summer garden in full bloom.',
        price: 'Price Upon Request'
    },
    // Add more art pieces...
];

export default function FineArtScreen() {
    return (
        <View style={styles.container}>
            <FixedHeader />
            <SearchBar />
            <FlatList
                data={artData}
                renderItem={({ item }) => <ArtCard art={item} />}
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