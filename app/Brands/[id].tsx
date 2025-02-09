import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FixedHeader } from '../components/FixedHeader';
import { WatchCard } from '../components/WatchCard';
import { useWatches } from '../hooks/useWatches';

export default function BrandDetailScreen() {
  const { id, brandName } = useLocalSearchParams() as { id: string; brandName: string };
  const { watches, loading, error } = useWatches();

  const filteredWatches = useMemo(() => {
    const brandWatches = watches.filter(
      (watch) => watch.brand.toLowerCase() === id.toLowerCase()
    );
    return brandWatches.sort((a, b) => a.price - b.price);
  }, [id, watches]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
     
        <View style={[styles.contentContainer, styles.centered]}>
          <ActivityIndicator size="large" color="#002d4e" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
       
        <View style={[styles.contentContainer, styles.centered]}>
          <Text style={styles.errorText}>Error loading watches</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <FlatList
        data={filteredWatches}
        renderItem={({ item }) => <WatchCard watch={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
  },
});