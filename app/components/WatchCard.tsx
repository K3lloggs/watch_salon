// app/components/WatchCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Watch } from '../types/Watch';
import { NewArrivalBadge } from './NewArrivalBadge';
import { Pagination } from './Pagination';
import  LikeCounter  from './LikeCounter';

interface WatchCardProps {
  watch: Watch;
  disableNavigation?: boolean;
}

export function WatchCard({ watch, disableNavigation = false }: WatchCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const images = Array.isArray(watch.image) ? watch.image : [watch.image];
  const router = useRouter();

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
              <Pressable key={index} onPress={handlePress} style={{ width: cardWidth || 400 }}>
                <Image
                  source={{ uri: imageUrl }}
                  style={[styles.image, { width: cardWidth || 400 }]}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </ScrollView>

          {watch.newArrival && <NewArrivalBadge />}

          {/* Pass the full watch object so LikeCounter can update favorites */}
          <LikeCounter watch={watch} initialLikes={watch.likes || 0} />

          {images.length > 1 && (
            <Pagination currentIndex={currentImageIndex} totalItems={images.length} />
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.brand} numberOfLines={1}>
            {watch.brand}
          </Text>
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
    shadowColor: '#003366',
    shadowOpacity: 0.45,
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
  infoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002d4e',
    letterSpacing: 0.5,
  },
  modelPriceContainer: {
    position: 'relative',
    marginTop: 4,
    minHeight: 24,
  },
  model: {
    fontSize: 20,
    fontWeight: '500',
    color: '#002d4e',
    letterSpacing: 0.5,
    paddingRight: 90,
  },
  price: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 18,
    fontWeight: '700',
    color: '#002d4e',
    letterSpacing: 0.5,
  },
});

export default WatchCard;