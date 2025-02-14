import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Text } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';
import { FavoriteButton } from '../components/FavoriteButton';
import { FilterButton } from '../components/FilterButton';
import { useWatches } from '../hooks/useWatches';
import { useSortContext } from '../context/SortContext';

export default function NewArrivalsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { sortOption } = useSortContext();
  const { watches, loading, error } = useWatches(searchQuery, sortOption);
  const [refreshing, setRefreshing] = useState(false);

  // Filter for new arrivals
  const newArrivals = useMemo(() => {
    const arrivals = watches.filter((watch) => watch.newArrival);
    if (searchQuery.trim()) {
      // Ensure proper sorting in memory when filtering
      if (sortOption === 'highToLow') {
        arrivals.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'lowToHigh') {
        arrivals.sort((a, b) => a.price - b.price);
      }
    }
    return arrivals;
  }, [watches, searchQuery, sortOption]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader title="Watch Salon" />
        <ActivityIndicator size="large" color="#002d4e" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader title="Watch Salon" />
        <Text style={styles.errorText}>Error loading watches</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FixedHeader title="Watch Salon" />
      <SearchBar currentQuery={searchQuery} onSearch={setSearchQuery} />
      <FavoriteButton />
      <FilterButton />
      <FlatList
        data={newArrivals}
        renderItem={({ item }) => <WatchCard watch={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#002d4e" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#FF0000', fontSize: 16, textAlign: 'center' },
});
