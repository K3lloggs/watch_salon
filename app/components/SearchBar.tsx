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
    <View style={styles.searchBarContainer}>
      <TouchableOpacity onPress={handleSubmit} style={styles.iconContainer}>
        <Ionicons name="search-outline" size={24} color="#888" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
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
        <TouchableOpacity onPress={clearSearch} style={styles.iconContainer}>
          <Ionicons name="close" size={24} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25, // increased rounding for a modern look
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    // A subtle shadow to elevate it from the background:
    shadowColor: '#002d4e',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    padding: 4,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#444',
  },
});
