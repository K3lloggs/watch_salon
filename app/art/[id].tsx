// app/art/[id].tsx (Expo Router) or app/screens/ArtDetailScreen.tsx (React Navigation)
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';  // for dynamic routes
import { useArtPiece } from '../hooks/useArtPiece';

export default function ArtDetailScreen() {
  // 1. Grab the ID from the route (Expo Router)
  const { id } = useLocalSearchParams() as { id?: string };

  // 2. If no ID is provided, show an immediate error
  if (!id) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No art ID provided.</Text>
      </View>
    );
  }

  // 3. Fetch the single doc
  const { art, loading, error } = useArtPiece(id);

  // 4. Loading state
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#002d4e" />
      </View>
    );
  }

  // 5. Error state
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // 6. Doc not found (art === null), or else no error
  if (!art) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Art piece not found.</Text>
      </View>
    );
  }

  // 7. Finally, display the retrieved art piece
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{art.title}</Text>
      <Text style={styles.artist}>by {art.artist}</Text>

      {/* Price can be numeric or string */}
      <Text style={styles.price}>
        {typeof art.price === 'number' ? `$${art.price.toLocaleString()}` : art.price}
      </Text>

      {/* Optional: show images if they exist */}
      {art.image.length > 0 && (
        <Image
          source={{ uri: art.image[0] }}
          style={styles.artImage}
          resizeMode="cover"
        />
      )}

      {/* More fields as desired: year, medium, description, etc. */}
      {art.year && <Text>Year: {art.year}</Text>}
      {art.medium && <Text>Medium: {art.medium}</Text>}
      {art.dimensions && <Text>Dimensions: {art.dimensions}</Text>}
      {art.description && <Text>Description: {art.description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artImage: {
    width: '100%',
    height: 300,
    marginVertical: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002d4e',
    marginBottom: 8,
  },
  artist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});
