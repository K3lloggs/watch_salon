// app/screens/SearchScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  View,
  TextInput,
} from 'react-native';
import { InstantSearch, Configure, connectSearchBox, connectHits } from 'react-instantsearch-native';
import {algoliasearch} from 'algoliasearch';
import { Ionicons } from '@expo/vector-icons';
import { WatchCard } from '../components/WatchCard';
import { Watch } from '../types/Watch';

// Replace with your Algolia credentials and index name.
const searchClient = algoliasearch('I87IHZ7YY2', '842cb73293798a6486a3ecd7c70473be');
const ALGOLIA_INDEX = 'Watches';

/** Helper to transform an Algolia hit into a Watch object */
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
  // Ensure image is always an array.
  image: Array.isArray(hit.image) ? hit.image : [hit.image],
  caseMaterial: hit.caseMaterial,
  caseDiameter: hit.caseDiameter,
  box: hit.box,
  papers: hit.papers,
  newArrival: hit.newArrival,
});

/** Custom search box component */
const SearchBoxComponent = ({ currentRefinement, refine }: any) => {
  return (
    <View style={styles.searchBoxContainer}>
      <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search watches..."
        placeholderTextColor="#888"
        value={currentRefinement}
        onChangeText={(text) => refine(text)}
        returnKeyType="search"
      />
    </View>
  );
};
const ConnectedSearchBox = connectSearchBox(SearchBoxComponent);

/** Custom hits component that renders a FlatList of WatchCards */
const HitsList = ({ hits }: { hits: any[] }) => {
  return (
    <FlatList
      data={hits}
      keyExtractor={(item) => item.objectID}
      renderItem={({ item }) => <WatchCard watch={transformHit(item)} />}
      contentContainerStyle={styles.hitsList}
    />
  );
};
const ConnectedHits = connectHits(HitsList);

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <InstantSearch indexName={ALGOLIA_INDEX} searchClient={searchClient}>
          <Configure hitsPerPage={10} />
          <ConnectedSearchBox />
          <ConnectedHits />
        </InstantSearch>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  hitsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
