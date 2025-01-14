import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { WatchCard } from '../components/WatchCard';
import { useSortContext } from '../context/SortContext';

const mockWatches = [
  { id: '1', brand: 'Rolex', model: 'Submariner', price: 15000, year: '2020' },
  { id: '2', brand: 'Patek Philippe', model: 'Nautilus', price: 75000, year: '2019' },
  {id: '3',brand: 'Vacheron Constantin',model: 'Traditionnelle',price: 165000,year: '2023',}
  // Add more watches
];

export default function AllScreen() {
  const { sortOption } = useSortContext();

  const sortedWatches = useMemo(() => {
    if (!sortOption) return mockWatches;

    return [...mockWatches].sort((a, b) => {
      if (sortOption === 'highToLow') {
        return b.price - a.price;
      }
      return a.price - b.price;
    });
  }, [sortOption]);

  return (
    <View style={styles.container}>
      <FixedHeader />
      <SearchBar />
      <FlatList
      
        data={sortedWatches}
        renderItem={({ item }) => <WatchCard watch={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  list: {
    padding: 16,
  },
});