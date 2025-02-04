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
import { NewArrivalBadge } from './NewArrivalBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WatchCardProps {
  watch: Watch;
  disableNavigation?: boolean;
}

export function WatchCard({ watch, disableNavigation = false }: WatchCardProps) {
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
    if (!disableNavigation) {
      router.push(`/watch/${watch.id}`);
    }
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
            <Pressable key={index} onPress={handlePress} style={{ width: SCREEN_WIDTH - 32 }}>
              <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
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
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 8,
   
    overflow: 'hidden',
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 9 / 11,
    backgroundColor: '#e0e0e0',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: SCREEN_WIDTH - 32,
    height: '100%',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  model: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  year: {
    fontSize: 14,
    color: '#777',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});