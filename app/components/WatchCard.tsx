// app/components/WatchCard.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites } from '../context/FavoritesContext';
import { Watch } from '../types/Watch';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WatchCardProps {
    watch: Watch;
}

export function WatchCard({ watch }: WatchCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = Array.isArray(watch.image) ? watch.image : [watch.image];
    const router = useRouter();

    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const isLiked = isFavorite(watch.id);

    const handleScroll = (event: any) => {
        const offset = event.nativeEvent.contentOffset.x;
        const pageIndex = Math.round(offset / (SCREEN_WIDTH - 32));
        setCurrentImageIndex(pageIndex);
    };

    const handlePress = () => {
        router.push(`/watch/${watch.id}`);
    };

    const toggleFavorite = (event: any) => {
        event.stopPropagation();
        if (isLiked) {
            removeFavorite(watch.id);
        } else {
            addFavorite(watch);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                    style={styles.scrollView}
                    snapToInterval={SCREEN_WIDTH - 32}
                    decelerationRate="fast"
                    snapToAlignment="center"
                >
                    {images.map((imageUrl, index) => (
                        <Pressable
                            key={index}
                            onPress={handlePress}
                            style={{ width: SCREEN_WIDTH - 32 }}
                        >
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </Pressable>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
                    <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={25}
                        color={isLiked ? '#ff4d4d' : '#ffffff'}
                    />
                </TouchableOpacity>
            </View>

            {/* Overlay bottom info (brand, model, price, pagination, etc.) */}
            <View style={styles.bottomContainer}>
                <View style={styles.textOverlay}>
                    <Text style={styles.brand}>{watch.brand}</Text>
                    <Text style={styles.model}>{watch.model}</Text>
                    <View style={styles.infoRow}>
                        {watch.year && <Text style={styles.year}>{watch.year}</Text>}
                        <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
                    </View>
                </View>

                {images.length > 1 && (
                    <View style={styles.pagination}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === currentImageIndex && styles.paginationDotActive,
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginVertical: 20,
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 9 / 11, // Adjusted ratio for larger card
        backgroundColor: '#e0e0e0',
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    image: {
        width: SCREEN_WIDTH - 32,
        height: '100%',
    },
    bottomContainer: {
        padding: 0,
        position: 'absolute',
        bottom: 16,
        left: 1,
        right: 16,
        flexDirection: 'column',
        gap: 2,
    },
    textOverlay: {
        width: '100%',
        left:10,
    },
    brand: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -3, height: 3 },
        textShadowRadius: 8,
        left:0,
    },
    model: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
    },
    year: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        padding: 4,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginRight: 4,
    },
    paginationDotActive: {
        backgroundColor: '#ffffff',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    heartButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
