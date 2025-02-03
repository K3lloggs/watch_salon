// app/(tabs)/index.tsx
import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { WatchCard } from '../components/WatchCard';
import { useSortContext } from '../context/SortContext';
import { FavoriteButton } from '../components/FavoriteButton';
import { FilterButton } from '../components/FilterButton';
import { useWatches } from '../hooks/useWatches';
import { AlgoliaSearch } from '../components/AlgoliaSearch';

export default function AllScreen() {
  const { sortOption } = useSortContext();
  const { watches, loading, error } = useWatches();

  const sortedWatches = useMemo(() => {
    if (!watches) return [];
    if (!sortOption) return watches;
    return [...watches].sort((a, b) => {
      if (sortOption === 'highToLow') {
        return b.price - a.price;
      }
      return a.price - b.price;
    });
  }, [sortOption, watches]);

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
      <FilterButton />
      <FavoriteButton />
      <FixedHeader />
      {/* Algolia search bar integrated like your custom card */}
      <AlgoliaSearch />
      <FlatList
        data={sortedWatches}
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
  },
  list: {
    padding: 8,
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
