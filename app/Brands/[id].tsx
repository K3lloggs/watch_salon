import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  SafeAreaView,
  Platform,
  Pressable,
  Image
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { WatchCard } from '../components/WatchCard';
import { useWatches } from '../hooks/useWatches';

export default function BrandDetailScreen() {
  const params = useLocalSearchParams();
  const brandName = typeof params.brandName === 'string' ? params.brandName : '';
  const { watches, loading, error } = useWatches();
  const [refreshing, setRefreshing] = useState(false);

  // Filter watches by brand and sort by price
  const filteredWatches = useMemo(() => {
    const brandWatches = watches.filter(
      (watch) => watch.brand.toLowerCase() === brandName.toLowerCase()
    );
    return brandWatches.sort((a, b) => a.price - b.price);
  }, [brandName, watches]);

  // Pull to refresh implementation
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetch - replace with actual data refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Brand header component with minimalist Swiss design
  const BrandHeader = () => {
    return (
      <View style={styles.brandHeader}>
        <Text style={styles.brandTitle}>{brandName}</Text>
        <View style={styles.swissBorder} />
      </View>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style={styles.emptyImage} 
      />
      <Text style={styles.emptyText}>No watches found for {brandName}</Text>
      <Pressable style={styles.emptyButton}>
        <Text style={styles.emptyButtonText}>Explore Other Brands</Text>
      </Pressable>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      
      <SafeAreaView style={styles.container}>

        {loading ? (
          <View style={[styles.contentContainer, styles.centered]}>
            <ActivityIndicator size="large" color="#002d4e" />
          </View>
        ) : error ? (
          <View style={[styles.contentContainer, styles.centered]}>
            <Text style={styles.errorText}>Unable to load watches</Text>
            <Pressable style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        ) : filteredWatches.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={filteredWatches}
            renderItem={({ item }) => <WatchCard watch={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListHeaderComponent={<BrandHeader />}
            removeClippedSubviews={true}
            initialNumToRender={4}
            maxToRenderPerBatch={2}
            windowSize={5}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  contentContainer: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#002d4e',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#002d4e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  brandHeader: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 0,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#002d4e',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#002d4e',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  swissBorder: {
    height: 1,
    width: 40,
    backgroundColor: '#002d4e',
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  emptyText: {
    color: '#002d4e',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#002d4e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});