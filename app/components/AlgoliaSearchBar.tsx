// app/components/AlgoliaSearchBar.tsx
import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { connectSearchBox, connectHits } from 'react-instantsearch-native';
import { Ionicons } from '@expo/vector-icons';

type SearchBarProps = {
  currentRefinement: string;
  refine: (value: string) => void;
};

type AlgoliaSearchBarProps = {
  onSearchStateChange: (results: any[]) => void;
};

const SearchBox = ({ currentRefinement, refine }: SearchBarProps) => (
  <View style={styles.searchBarContainer}>
    <Ionicons name="search-outline" size={24} color="#888" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search by Brand, Model, Year..."
      placeholderTextColor="#999"
      value={currentRefinement}
      onChangeText={refine}
      returnKeyType="search"
      autoCapitalize="none"
      autoCorrect={false}
    />
  </View>
);

const ConnectedSearchBox = connectSearchBox(SearchBox);

const HitsManager = ({ hits, onSearchStateChange }: { hits: any[], onSearchStateChange: (results: any[]) => void }) => {
  const memoizedOnSearchStateChange = useCallback((results: any[]) => {
    onSearchStateChange(results);
  }, [onSearchStateChange]);

  React.useEffect(() => {
    if (Array.isArray(hits)) {
      memoizedOnSearchStateChange(hits);
    }
  }, [hits, memoizedOnSearchStateChange]);

  return null;
};

const ConnectedHitsManager = connectHits(HitsManager);

export function AlgoliaSearchBar({ onSearchStateChange }: AlgoliaSearchBarProps) {
  const memoizedOnSearchStateChange = useCallback((results: any[]) => {
    onSearchStateChange(results);
  }, [onSearchStateChange]);

  return (
    <>
      <ConnectedSearchBox />
      <ConnectedHitsManager onSearchStateChange={memoizedOnSearchStateChange} />
    </>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#444',
  },
});