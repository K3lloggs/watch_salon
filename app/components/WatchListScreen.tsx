// WatchListScreen.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { useWatches } from '../hooks/useWatches';
import { WatchCard } from '../components/WatchCard';

export default function WatchListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { watches, loading, error } = useWatches(searchQuery);

  // Sort watches by brand (or use any other criteria)
  const sortedWatches = [...watches].sort((a, b) =>
    a.brand.localeCompare(b.brand)
  );

  return (
    <View style={styles.container}>
      {/* Pass the state updater down so SearchBar can update the query */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {loading && <ActivityIndicator size="large" color="#002d4e" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <ScrollView>
        {sortedWatches.map((watch) => (
          <WatchCard key={watch.id} watch={watch} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
});
