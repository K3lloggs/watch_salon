// app/(tabs)/newArrivals.tsx
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';
import { FavoriteButton } from '../components/FavoriteButton';
import { FilterButton } from '../components/FilterButton';
import { useWatches } from '../hooks/useWatches';

export default function NewArrivalsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { watches, loading, error } = useWatches(searchQuery);

  // Filter for new arrivals and apply search if any
  const newArrivals = watches.filter((watch) => watch.newArrival);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader />
        <ActivityIndicator size="large" color="#002d4e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader />
        <Text style={styles.errorText}>Error loading watches</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FixedHeader />
      <View style={styles.buttonContainer}>
        <FavoriteButton />
        <FilterButton />
      </View>
      <SearchBar onSearch={setSearchQuery} />
      <FlatList
        data={newArrivals}
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
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 55,
  },
  list: {
    paddingHorizontal: 8,
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
});