import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  ListRenderItemInfo,
  Platform,
} from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { WatchCard } from '../components/WatchCard';
import { FilterDropdown } from '../components/FilterButton';
import { useWatches } from '../hooks/useWatches';
import { useSortContext } from '../context/SortContext';
import { Watch } from '../types/Watch';

// Estimate item height for more accurate getItemLayout function
const ITEM_HEIGHT = 420; // Adjusted based on card dimensions and margins

export default function NewArrivalsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { sortOption, setSortOption } = useSortContext();
  const { watches, loading, error } = useWatches(searchQuery, sortOption);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Cache the new arrivals list and memoize for performance
  const newArrivals = useMemo(() => {
    const arrivals = watches.filter((watch) => watch.newArrival);
    if (sortOption === 'highToLow') {
      return [...arrivals].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'lowToHigh') {
      return [...arrivals].sort((a, b) => a.price - b.price);
    }
    return arrivals;
  }, [watches, sortOption]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Optimize item layout calculation for smoother scrolling
  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  // Memoize the render function to prevent unnecessary rerenders
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Watch>) => (
    <WatchCard watch={item} />
  ), []);

  const scrollToTop = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [flatListRef]);

  const toggleFilterDropdown = useCallback(() => {
    setShowFilterDropdown(prev => !prev);
  }, []);

  const handleFilterSelect = useCallback((option: "lowToHigh" | "highToLow" | null) => {
    setSortOption(option);
    setShowFilterDropdown(false);
    scrollToTop();
  }, [setSortOption, scrollToTop]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const keyExtractor = useCallback((item: Watch) => item.id, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader 
          title="New Arrivals" 
          showSearch={true}
          showFavorites={true}
          showFilter={false}
        />
        <ActivityIndicator size="large" color="#002d4e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader 
          title="New Arrivals" 
          showSearch={true}
          showFavorites={true}
          showFilter={false}
        />
        <Text style={styles.errorText}>Error loading watches</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FixedHeader 
        title="New Arrivals"
        showSearch={true}
        showFavorites={true}
        showFilter={true}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterToggle={toggleFilterDropdown}
        currentScreen="newArrivals"
      />
      
      <FilterDropdown 
        isVisible={showFilterDropdown}
        onSelect={handleFilterSelect}
        onClose={() => setShowFilterDropdown(false)}
      />
      
      <FlatList
        ref={flatListRef}
        data={newArrivals}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={Platform.OS === 'android'}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#002d4e" 
          />
        }
        showsVerticalScrollIndicator={false}
        // Pre-calculate heights for better performance
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  centered: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    color: '#FF0000', 
    fontSize: 16, 
    textAlign: 'center' 
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 20,
  }
});