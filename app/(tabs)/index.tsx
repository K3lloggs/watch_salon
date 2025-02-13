import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';
import { FavoriteButton } from '../components/FavoriteButton';
import { FilterButton } from '../components/FilterButton';
import { useWatches } from '../hooks/useWatches';
import { useSortContext } from '../context/SortContext';

export default function AllScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { watches, loading, error } = useWatches(searchQuery);
  const { sortOption } = useSortContext();

  // Log the current sort option for debugging
  useEffect(() => {
    console.log('Current sort option:', sortOption);
  }, [sortOption]);

  // Sort the watches based on the sort option.
  const sortedWatches = useMemo(() => {
    const sorted = [...watches];
    if (sortOption === 'highToLow') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'lowToHigh') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    return sorted;
  }, [watches, sortOption]);

  // Debug: Log the first sorted watch if available.
  useEffect(() => {
    if (sortedWatches.length > 0) {
      console.log(
        'First sorted watch:',
        sortedWatches[0].brand,
        'Price:',
        sortedWatches[0].price
      );
    }
  }, [sortedWatches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Insert your re-fetch logic here.
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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
      <SearchBar currentQuery={searchQuery} onSearch={setSearchQuery} />
      <FlatList
        data={sortedWatches}
        renderItem={({ item }) => <WatchCard watch={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#002d4e"
          />
        }
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
