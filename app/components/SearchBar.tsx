import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWatches } from '../hooks/useWatches';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  // We still fetch watchers if needed, but won't show them or errors here
  const { loading, error } = useWatches(searchQuery);

  // Log errors/loading instead of displaying them
  if (error) {
    console.log('Search error:', error);
  }
  if (loading) {
    console.log('Searching for watchers...');
  }

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={24} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Search by Brand, Model, Year"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    // Luxurious card-like background with shadow
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 8,

    // Subtle shadow/elevation for a premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#444',
  },
});
