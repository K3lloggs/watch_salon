// app/(screens)/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import {SearchBar} from '../components/SearchBar';
import WatchCard from '../components/WatchCard';
import FadeInView from '../components/FadeInView';
import { Watch } from '../types/Watch';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function SearchScreen() {
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryText.trim() === '') {
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Assuming the "brand" field is stored in lowercase for case-insensitive search
        const watchesRef = collection(db, 'watches');
        const q = query(
          watchesRef,
          where('brand', '>=', queryText.toLowerCase()),
          where('brand', '<=', queryText.toLowerCase() + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        const watches: Watch[] = [];
        querySnapshot.forEach((doc) => {
          watches.push({ id: doc.id, ...doc.data() } as Watch);
        });
        setResults(watches);
      } catch (error) {
        console.error('Error fetching watches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [queryText]);

  const renderItem = ({ item }: { item: Watch }) => (
    <FadeInView style={styles.fadeContainer}>
      <WatchCard watch={item} disableNavigation={false} />
    </FadeInView>
  );

  return (
    <View style={styles.container}>
      <SearchBar onSearch={setQueryText} currentQuery={queryText} />
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { paddingVertical: 16 },
  loader: { marginTop: 20 },
  fadeContainer: { marginBottom: 16 },
  emptyContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
