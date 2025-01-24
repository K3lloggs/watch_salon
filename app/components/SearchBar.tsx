// app/components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWatches } from '../hooks/useWatches';

interface SearchBarProps {
  // Optionally pass a callback so parent can get the search query
  onSearchChange?: (query: string) => void;
}

/**
 * A pinned SearchBar that stays in its original "margin: 10" position,
 * but won't scroll under WatchCard or other content.
 */
export function SearchBar({ onSearchChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { watches, loading, error } = useWatches(searchQuery);

  // Optional: pass query changes to parent
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
  }, [searchQuery, onSearchChange]);

  // Just log errors/loading instead of printing them on screen
  if (error) {
    console.log('Search error:', error);
  }
  if (loading) {
    console.log('Searching for watches...');
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.pinnedContainer}>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Search by Brand, Model, Year"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pinnedContainer: {
    // Keep the same "margin: 10" feel, but fix the position so it doesn't scroll
    position: 'absolute',
    top:100,
    left: 0,
    right: 0,
    margin: 10,
    zIndex: 999, // ensures it stays above other content
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
});
