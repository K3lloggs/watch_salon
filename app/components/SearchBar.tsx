// components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentQuery: string;
}

export function SearchBar({ onSearch, currentQuery }: SearchBarProps) {
  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const handleSubmit = () => onSearch(query);
  const clearSearch = () => {
    setQuery('');
    onSearch('');
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
    // Consistent width settings:
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    // Blue-hued shadow (matching your photo button style)
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