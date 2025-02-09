// components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentQuery: string;
}

export function SearchBar({ onSearch, currentQuery }: SearchBarProps) {
  // Local state to hold the text input
  const [query, setQuery] = useState(currentQuery);

  // Keep local state in sync if parent changes currentQuery
  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  // Handler that fires only when "Search" key is pressed on keyboard
  const handleSubmit = () => {
    onSearch(query);
  };

  // If you also want a clear button, keep it:
  const clearSearch = () => {
    setQuery('');
    onSearch(''); // Clear from parent as well
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        {/* Optional: Make the search icon also trigger the search */}
        <TouchableOpacity onPress={handleSubmit}>
          <Ionicons name="search-outline" size={24} color="#888" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Search by Brand, Model, Year"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}  // Trigger search when user presses "Search" key
          autoCapitalize="none"
          autoCorrect={true}
        />
        
        {/* Clear Button */}
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close" size={24} color="#888" />
          </TouchableOpacity>
        )}
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
  clearButton: {
    padding: 4,
  },
});
