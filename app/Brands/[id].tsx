import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FixedHeader } from '../components/FixedHeader';
import { WatchCard } from '../components/WatchCard';
import { useWatches } from '../hooks/useWatches';

export default function BrandDetailScreen() {
  // Retrieve the brand parameter (assumed to be the brand name)
  const { id } = useLocalSearchParams() as { id: string };

  // Load all watches from Firebase
  const { watches, loading, error } = useWatches();

  // Filter watches by matching brand (case-insensitive) and sort them by price (ascending)
  const filteredWatches = useMemo(() => {
    const brandWatches = watches.filter(
      (watch) => watch.brand.toLowerCase() === id.toLowerCase()
    );
    return brandWatches.sort((a, b) => a.price - b.price);
  }, [id, watches]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#002d4e" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error loading watches</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FixedHeader />
      <Text style={styles.title}>{id} Watches</Text>
      <FlatList
        data={filteredWatches}
        renderItem={({ item }) => <WatchCard watch={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaff',
    paddingTop: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#002d4e',
    textAlign: 'center',
    marginVertical: 16,
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
