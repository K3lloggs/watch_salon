import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function SearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#888" />
      <TextInput
        style={styles.input}
        placeholder="Search by Brand, Model, Keywords"
        placeholderTextColor="#888"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    margin: 10,
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