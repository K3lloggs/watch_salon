import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Watch } from '../types/Watch';
import { NewArrivalBadge } from './NewArrivalBadge';
import { Pagination } from './Pagination';
import LikeCounter from './LikeCounter';

interface WatchCardProps {
  watch: Watch;
  disableNavigation?: boolean;
}

const WatchCardComponent: React.FC<WatchCardProps> = ({ watch, disableNavigation = false }) => {
  const [cardWidth, setCardWidth] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const images = Array.isArray(watch.image) ? watch.image : [watch.image];
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (!disableNavigation) {
      router.push(`/watch/${watch.id}`);
    }
  }, [disableNavigation, router, watch.id]);

  const onCardLayout = useCallback((event: LayoutChangeEvent) => {
    setCardWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View style={styles.cardWrapper} onLayout={onCardLayout}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
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
          </Animated.ScrollView>

          {watch.newArrival && <NewArrivalBadge />}

          <LikeCounter watch={watch} initialLikes={watch.likes || 0} />

          {images.length > 1 && (
            <Pagination
              scrollX={scrollX}
              cardWidth={cardWidth || 400}
              totalItems={images.length}
            />
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
};

export default React.memo(WatchCardComponent);

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
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
