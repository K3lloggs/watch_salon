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
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites } from '../context/FavoritesContext';
import { Watch } from '../types/Watch';
import { NewArrivalBadge } from './NewArrivalBadge';
import { LinearGradient } from 'expo-linear-gradient';

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

  // Capture the width of the card so we can use it for images and snapToInterval
  const onCardLayout = (event: LayoutChangeEvent) => {
    setCardWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.cardWrapper} onLayout={onCardLayout}>
      <LinearGradient
        colors={['#002d4e', '#0056b3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      >
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
            <Text style={styles.brand}>{watch.brand}</Text>
            <Text style={styles.model}>{watch.model}</Text>
            <View style={styles.row}>
              {watch.year && <Text style={styles.year}>{watch.year}</Text>}
              <Text style={styles.price}>
                ${typeof watch.price === 'number' ? watch.price.toLocaleString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: '#fff', // necessary for shadow visibility
    // Consistent width settings:
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    // Blue shadow (matching your photo button style)
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  gradientBorder: {
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden', // Clip internal content only
  },
  imageContainer: {
    width: '100%',
    // Use aspectRatio to maintain image container's proportion.
    aspectRatio: 9 / 11,
    backgroundColor: '#F6F7F8',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: '#002d4e',
    letterSpacing: 0.5,
  },
  model: {
    fontSize: 16,
    color: '#5A5A5A',
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  year: {
    fontSize: 14,
    color: '#5A5A5A',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#002d4e',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  paginationDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
});
