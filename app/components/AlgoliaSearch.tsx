// app/components/AlgoliaSearch.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {algoliasearch} from 'algoliasearch';
import {
  InstantSearch,
  Configure,
  connectSearchBox,
  connectHits,
  connectHighlight,
} from 'react-instantsearch-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Replace with your actual Algolia credentials and index name.
const searchClient = algoliasearch('I87IHZ7YY2', '842cb73293798a6486a3ecd7c70473be');
const ALGOLIA_INDEX = 'Watches';

/* --- 1. Custom Search Box Using connectSearchBox --- */
const CustomSearchBox = ({ currentRefinement, refine }: any) => (
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
const ConnectedSearchBox = connectSearchBox(CustomSearchBox);

/* --- 2. Custom Hits List Using connectHits --- */
const CustomHits = ({ hits, hitComponent: HitComponent }: { hits: any[]; hitComponent: React.ComponentType<any> }) => (
  <View style={styles.hitsContainer}>
    {hits.map((hit) => (
      <HitComponent key={hit.objectID} hit={hit} />
    ))}
  </View>
);
const ConnectedHits = connectHits(CustomHits);

/* --- 3. Custom Highlight for Matched Text --- */
const CustomHighlight = ({ attribute, hit, highlight }: any) => {
  const parts = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });
  return (
    <Text>
      {parts.map((part: any, index: number) =>
        part.isHighlighted ? (
          <Text key={index} style={styles.highlight}>
            {part.value}
          </Text>
        ) : (
          <Text key={index}>{part.value}</Text>
        )
      )}
    </Text>
  );
};
const Highlight = connectHighlight(CustomHighlight);

/* --- 4. Custom Hit Component with Clickable Navigation --- */
const Hit = ({ hit }: { hit: any }) => {
  const router = useRouter();

  const handlePress = () => {
    // Assuming the watch ID is stored as 'objectID' in your Algolia index.
    router.push(`/watch/${hit.objectID}`);
  };

  return (
    <TouchableOpacity style={styles.hitItem} onPress={handlePress}>
      <Text style={styles.hitTitle}>
        <Highlight attribute="brand" hit={hit} />
      </Text>
      <Text style={styles.hitSubtitle}>
        <Highlight attribute="model" hit={hit} /> • <Highlight attribute="year" hit={hit} />
      </Text>
    </TouchableOpacity>
  );
};

/* --- 5. Main AlgoliaSearch Component --- */
export function AlgoliaSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX}>
      <Configure hitsPerPage={10} />
      <View style={styles.card}>
        <ConnectedSearchBox />
        <ConnectedHits hitComponent={Hit} />
      </View>
    </InstantSearch>
  );
}

/* --- 6. Styles --- */
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 8,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#444',
  },
  hitsContainer: {
    marginTop: 8,
  },
  hitItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  hitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  hitSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  highlight: {
    fontWeight: 'bold',
  },
});
