import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';



export default function LadiesScreen() {
    return (
        <View style={styles.container}>
            <FixedHeader />
            <SearchBar onSearch={() => {}} currentQuery="" />
           
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