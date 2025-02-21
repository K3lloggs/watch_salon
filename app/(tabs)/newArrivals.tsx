import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  ListRenderItemInfo,
} from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';
import { FavoriteButton } from '../components/FavoriteButton';
import { FilterButton } from '../components/FilterButton';
import { useWatches } from '../hooks/useWatches';
import { useSortContext } from '../context/SortContext';

const ITEM_HEIGHT = 500; // Adjust as needed

export default function NewArrivalsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { sortOption } = useSortContext();
  const { watches, loading, error } = useWatches(searchQuery, sortOption);
  const [refreshing, setRefreshing] = useState(false);

  // Cache the new arrivals list so that filtering runs only when watches, searchQuery, or sortOption change.
  const newArrivals = useMemo(() => {
    const arrivals = watches.filter((watch) => watch.newArrival);
    if (sortOption === 'highToLow') {
      arrivals.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'lowToHigh') {
      arrivals.sort((a, b) => a.price - b.price);
    }
    return arrivals;
  }, [watches, sortOption]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Replace with your actual refresh logic if needed.
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(({ item }: ListRenderItemInfo<any>) => {
    return <WatchCard watch={item} />;
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
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={6}
        windowSize={5}
        getItemLayout={getItemLayout}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#002d4e" />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#FF0000', fontSize: 16, textAlign: 'center' },
});
