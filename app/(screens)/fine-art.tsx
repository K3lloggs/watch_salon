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
    {
        id: '2',
        title: 'Coastal Sunset',
        artist: 'William Turner',
        year: '1845',
        medium: 'Oil on Canvas',
        dimensions: '90 x 120 cm',
        description: 'A dramatic seascape showcasing Turner\'s mastery of light and atmosphere.',
        price: 'Price Upon Request'
    },
    {
        id: '3',
        title: 'Abstract Composition',
        artist: 'Wassily Kandinsky',
        year: '1925',
        medium: 'Oil and Mixed Media',
        dimensions: '100 x 100 cm',
        description: 'A vibrant exploration of color and form, exemplifying Kandinsky\'s revolutionary abstract style.',
        price: 'Price Upon Request'
    }
];

export default function FineArtScreen() {
    return (
        <View style={styles.container}>
            <FixedHeader />
            <SearchBar />
            <FlatList
                data={artData}
                renderItem={({ item }) => (
                    <ArtCard
                        art={item}
                        onPress={() => {
                            // Handle art piece selection
                            console.log('Selected artwork:', item.title);
                        }}
                    />
                )}
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