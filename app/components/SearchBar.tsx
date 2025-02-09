// components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentQuery: string;
}

export function SearchBar({ onSearch, currentQuery }: SearchBarProps) {
  // Use local state so we don't call onSearch on every keystroke immediately
  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    // Set a debounce timer so that onSearch is only called when the user pauses typing
    const debounceTimeout = setTimeout(() => {
      onSearch(query);
    }, 300); // Adjust delay (in milliseconds) as needed

    // Cleanup the timer if the component unmounts or if query changes before timeout
    return () => clearTimeout(debounceTimeout);
  }, [query, onSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={24} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Search by Brand, Model, Year"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery} // Update local state
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 8,
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
    padding: 8,
  },
});
