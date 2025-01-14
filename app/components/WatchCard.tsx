import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WatchCardProps {
    watch: {
        brand: string;
        model: string;
        price: number;
        year?: string;
    };
}

export function WatchCard({ watch }: WatchCardProps) {
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.imageContainer} />
            <View style={styles.details}>
                <Text style={styles.brand}>{watch.brand}</Text>
                <Text style={styles.model}>{watch.model}</Text>
                <View style={styles.infoRow}>
                    {watch.year && <Text style={styles.year}>{watch.year}</Text>}
                    <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        width: '100%',
        height: 450,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 12,
    },
    details: {
        padding: 8,
    },
    brand: {
        fontSize: 18,
        fontWeight: '600',
        color: '#002d4e',
    },
    model: {
        fontSize: 16,
        color: '#444',
        marginVertical: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    year: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#002d4e',
    },
});