// app/components/WatchCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites } from '../context/FavoritesContext';
import { Watch } from '../types/Watch';
import { NewArrivalBadge } from './NewArrivalBadge';

interface WatchCardProps {
  watch: Watch;
  disableNavigation?: boolean;
}

export function WatchCard({ watch, disableNavigation = false }: WatchCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const images = Array.isArray(watch.image) ? watch.image : [watch.image];
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isLiked = isFavorite(watch.id);

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offset / (cardWidth || 400));
    setCurrentImageIndex(pageIndex);
  };

  const handlePress = () => {
    if (!disableNavigation) {
      router.push(`/watch/${watch.id}`);
    }
  };

  const toggleFavorite = (event: any) => {
    event.stopPropagation();
    isLiked ? removeFavorite(watch.id) : addFavorite(watch);
  };

  // Capture the width of the card so we can use it for images and snapping
  const onCardLayout = (event: LayoutChangeEvent) => {
    setCardWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.cardWrapper} onLayout={onCardLayout}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            snapToInterval={cardWidth || 400}
            decelerationRate="fast"
            snapToAlignment="center"
          >
            {images.map((imageUrl, index) => (
              <Pressable
                key={index}
                onPress={handlePress}
                style={{ width: cardWidth || 400 }}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={[styles.image, { width: cardWidth || 400 }]}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </ScrollView>

          {watch.newArrival && <NewArrivalBadge />}

          <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={25}
              color={isLiked ? '#ff4d4d' : '#000'}
            />
          </TouchableOpacity>

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

        <View style={styles.infoContainer}>
          <Text style={styles.brand} numberOfLines={1}>
            {watch.brand}
          </Text>
          {/* Container with relative positioning for model and price */}
          <View style={styles.modelPriceContainer}>
            <Text style={styles.model} numberOfLines={2}>
              {watch.model}
            </Text>
            <Text style={styles.price}>
              ${typeof watch.price === 'number' ? watch.price.toLocaleString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 9 / 11,
    backgroundColor: '#F6F7F8',
    position: 'relative',
  },
  image: {
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 10,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002d4e', // updated color
    letterSpacing: 0.5,
  },
  modelPriceContainer: {
    position: 'relative',
    marginTop: 4,
    minHeight: 24, // ensures enough room for both texts
  },
  model: {
    fontSize: 20,
    fontWeight: '500',
    color: '#002d4e', // updated color
    letterSpacing: 0.5,
    paddingRight: 90, // reserve space for the price
  },
  price: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 18,
    fontWeight: '700',
    color: '#002d4e', // updated color
    letterSpacing: 0.5,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginRight: 4,
    borderWidth: 0,
  },
  paginationDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 0,
  },
});

export default WatchCard;
