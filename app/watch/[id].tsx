import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    SafeAreaView,
    useWindowDimensions,
    Pressable
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

interface WatchDetails {
    reference: string;
    diameter: string;
    movement: string;
    caseMaterial: string;
    bracelet: string;
    dial: string;
    waterResistance: string;
    powerReserve: string;
    box: boolean;
    papers: boolean;
    condition: string;
}

interface Watch {
    id: string;
    brand: string;
    model: string;
    year: string;
    price: number;
    details: WatchDetails;
}

export default function WatchDetail() {
    const { id } = useLocalSearchParams();
    const { width: screenWidth } = useWindowDimensions();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const router = useRouter();

    // Replace with your actual watch data fetching
    const watch: Watch = {
        id: id as string,
        brand: "Rolex",
        model: "Submariner",
        year: "2020",
        price: 15000,
        details: {
            reference: "126610LN",
            diameter: "41mm",
            movement: "Automatic",
            caseMaterial: "Stainless Steel",
            bracelet: "Oyster",
            dial: "Black",
            waterResistance: "300m",
            powerReserve: "70 hours",
            box: true,
            papers: true,
            condition: "Excellent"
        }
    };

    const isLiked = isFavorite(watch.id);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.imageContainer, { height: screenWidth * 1.2 }]}>
                    <Pressable 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={24} color="#002d4e" />
                    </Pressable>
                    <TouchableOpacity
                        style={styles.heartButton}
                        onPress={() => isLiked ? removeFavorite(watch.id) : addFavorite(watch)}
                    >
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={24}
                            color={isLiked ? "#ff4d4d" : "#002d4e"}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.brand}>{watch.brand}</Text>
                    <Text style={styles.model}>{watch.model}</Text>
                    <Text style={styles.reference}>{watch.details.reference}</Text>
                    <Text style={styles.price}>${watch.price.toLocaleString()}</Text>

                    <View style={styles.specsGrid}>
                        {Object.entries(watch.details).map(([key, value]) => (
                            <View key={key} style={styles.specItem}>
                                <Text style={styles.specLabel}>
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </Text>
                                <Text style={styles.specValue}>
                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.messageButton}>
                            <Text style={styles.messageText}>Message Us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tradeButton}>
                            <Text style={styles.tradeText}>Trade</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: '100%',
        backgroundColor: '#e0e0e0',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 8,
    },
    heartButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 8,
    },
    content: {
        padding: 24,
    },
    brand: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
        color: '#002d4e',
    },
    model: {
        fontSize: 20,
        marginBottom: 4,
        color: '#002d4e',
    },
    reference: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    price: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        color: '#002d4e',
    },
    specsGrid: {
        marginBottom: 24,
    },
    specItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    specLabel: {
        fontSize: 16,
        color: '#666',
    },
    specValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#002d4e',
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    messageButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#002d4e',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    messageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#002d4e',
    },
    tradeButton: {
        flex: 1,
        backgroundColor: '#002d4e',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    tradeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});