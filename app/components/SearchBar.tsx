// components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentQuery: string;
  debounceDelay?: number; // Optional prop to customize debounce delay
}

export function SearchBar({ onSearch, currentQuery, debounceDelay = 500 }: SearchBarProps) {
  const [query, setQuery] = useState(currentQuery);

  // Sync with currentQuery prop updates
  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  // Debounced effect: triggers onSearch after the user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);

    // Cleanup: clear the timeout if query changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceDelay, onSearch]);

  // Immediate search on submit (e.g. search button or keyboard submit)
  const handleSubmit = () => {
    // Clear any pending debounce
    onSearch(query);
  };

  // Clear the search input.
  // We update the local state immediately and let the debounce trigger onSearch.
  const clearSearch = () => {
    setQuery('');
    // No immediate onSearch call to avoid abrupt refresh; debounce handles it.
  };

  return (
    <View style={styles.searchBarWrapper}>
      <TouchableOpacity onPress={handleSubmit}>
        <Ionicons name="search-outline" size={24} color="#888" />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Brand, Model, Year"
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        autoCapitalize="none"
        autoCorrect
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Ionicons name="close" size={24} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#002d4e',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#444',
    padding: 8,
  },
  clearButton: {
    padding: 4,
  },
});
