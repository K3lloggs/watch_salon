// WatchCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites, Watch } from '../context/FavoritesContext';
import { useRouter } from 'expo-router';

interface WatchCardProps {
  watch: Watch;
}

export function WatchCard({ watch }: WatchCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isLiked = isFavorite(watch.id);
  const router = useRouter();

  const toggleFavorite = (event: any) => {
    event.stopPropagation();
    if (isLiked) {
      removeFavorite(watch.id);
    } else {
      addFavorite(watch);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9 }
      ]}
      onPress={() => router.push({
        pathname: "/watch/[id]",
        params: { id: watch.id }
      })}
    >
      <View style={styles.imageContainer}>
        <View style={styles.textOverlay}>
          <Text style={styles.brand}>{watch.brand}</Text>
          <Text style={styles.model}>{watch.model}</Text>
          <View style={styles.infoRow}>
            {watch.year && <Text style={styles.year}>{watch.year}</Text>}
            <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={toggleFavorite}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "#ff4d4d" : "#002d4e"}
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 9 / 10,
    backgroundColor: '#e0e0e0',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.4,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  model: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002d4e',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002d4e',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});