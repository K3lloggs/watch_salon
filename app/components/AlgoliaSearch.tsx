// app/components/AlgoliaSearch.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import {algoliasearch} from 'algoliasearch';
import {
  InstantSearch,
  Configure,
  connectSearchBox,
  connectHits,
} from 'react-instantsearch-native';
import { Ionicons } from '@expo/vector-icons';
import { WatchCard } from './WatchCard';
import { Watch } from '../types/Watch';

// Replace these with your actual Algolia credentials and index name.
const searchClient = algoliasearch('I87IHZ7YY2', '842cb73293798a6486a3ecd7c70473be');
const ALGOLIA_INDEX = 'Watches';

interface AlgoliaSearchProps {
  query: string;
}

/** 
 * Helper: Transform an Algolia hit into a Watch object.
 * We provide defaults so required fields (like price) aren’t undefined.
 */
const transformHit = (hit: any): Watch => ({
  id: hit.objectID,
  brand: hit.brand ?? '',
  model: hit.model ?? '',
  dial: hit.dial ?? '',
  movement: hit.movement ?? '',
  powerReserve: hit.powerReserve ?? '',
  strap: hit.strap ?? '',
  price: hit.price !== undefined ? Number(hit.price) : 0,
  year: hit.year,
  image: Array.isArray(hit.image) ? hit.image : [hit.image],
  caseMaterial: hit.caseMaterial,
  caseDiameter: hit.caseDiameter,
  box: hit.box,
  papers: hit.papers,
  newArrival: hit.newArrival,
});

/** 
 * A custom search box that shows an icon and an input field.
 * (The connected SearchBox automatically updates the Algolia query.)
 */
const SearchBox = ({ currentRefinement, refine }: any) => {
  return (
    <View style={styles.searchBoxContainer}>
      <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search watches..."
        value={currentRefinement}
        onChangeText={(text) => refine(text)}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
};
const ConnectedSearchBox = connectSearchBox(SearchBox);

/** 
 * The Hits component maps over Algolia’s hits and renders each using WatchCard.
 */
const Hits = ({ hits }: { hits: any[] }) => {
  return (
    <View style={styles.hitsContainer}>
      {hits.map((hit) => (
        <WatchCard key={hit.objectID} watch={transformHit(hit)} />
      ))}
    </View>
  );
};
const ConnectedHits = connectHits(Hits);

/**
 * AlgoliaSearch Component  
 * Accepts a `query` prop which is passed to the <Configure> component.
 */
export function AlgoliaSearch({ query }: AlgoliaSearchProps) {
  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX}>
      <Configure query={query} hitsPerPage={10} />
      <View style={styles.container}>
        <ConnectedSearchBox />
        <ConnectedHits />
      </View>
    </InstantSearch>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 8,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#444',
  },
  hitsContainer: {
    marginTop: 8,
  },
});
