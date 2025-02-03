// components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentQuery: string;
}

export function SearchBar({ onSearch, currentQuery }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={24} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Search by Brand, Model, Year"
          placeholderTextColor="#999"
          value={currentQuery}
          onChangeText={onSearch}
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