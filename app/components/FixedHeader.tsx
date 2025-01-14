import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { FavoriteButton } from './FavoriteButton';
import { FilterButton } from './FilterButton';

export function FixedHeader() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <FavoriteButton />
                <Text style={styles.title}>Watch Salon</Text>
                <FilterButton />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#002d4e',
    },
});