// app/watch/[id].tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWatches } from '../hooks/useWatches';
import { SecondaryCard } from '../components/SecondaryCard';
import { Ionicons } from '@expo/vector-icons';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { watches, loading } = useWatches();
  const watch = watches.find((w) => w.id === id);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#002d4e" />
      </SafeAreaView>
    );
  }

  if (!watch) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Watch not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#002d4e" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* SecondaryCard might show a large image carousel or watch preview */}
        <SecondaryCard watch={watch} />

        {/* Watch Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.brand}>{watch.brand}</Text>
            <Text style={styles.model}>{watch.model}</Text>
            <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
          </View>
          <View style={styles.rightColumn}>
            {watch.caseMaterial && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Case Material:</Text>
                <Text style={styles.specValue}>{watch.caseMaterial}</Text>
              </View>
            )}
            {watch.caseDiameter && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Diameter:</Text>
                <Text style={styles.specValue}>{watch.caseDiameter}</Text>
              </View>
            )}
            {watch.year && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Year:</Text>
                <Text style={styles.specValue}>{watch.year}</Text>
              </View>
            )}
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Box:</Text>
              <Text style={styles.specValue}>{watch.box ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Papers:</Text>
              <Text style={styles.specValue}>{watch.papers ? 'Yes' : 'No'}</Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftColumn: {
    flex: 1,
    marginRight: 16,
  },
  rightColumn: {
    flex: 1,
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 4,
  },
  model: {
    fontSize: 20,
    color: '#002d4e',
    marginBottom: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 24,
  },
  specRow: {
    marginBottom: 12,
  },
  specKey: {
    fontSize: 16,
    color: '#002d4e',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 16,
    color: '#333',
  },
});
