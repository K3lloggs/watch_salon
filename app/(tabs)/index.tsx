import React, { useState, useCallback } from "react";
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  StyleSheet, 
  Text 
} from "react-native";

import { FixedHeader } from "../components/FixedHeader";
import { SearchBar } from "../components/SearchBar";
import { WatchCard } from "../components/WatchCard";
import { FavoriteButton } from "../components/FavoriteButton";
import { FilterButton } from "../components/FilterButton";
import { useWatches } from "../hooks/useWatches";
import { useSortContext } from "../context/SortContext";
import { Watch } from "../types/Watch";

export default function AllScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { sortOption } = useSortContext();
  const { watches, loading, error } = useWatches(searchQuery, sortOption);
  const [refreshing, setRefreshing] = useState(false);

  // Since our hook now loads data once on mount and then filters in memory,
  // onRefresh here simply toggles the refresh indicator. 
  // To force a refetch, you could modify the hook to expose a refetch function.
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Watch }) => <WatchCard watch={item} />,
    []
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader title="Watch Salon" />
        <ActivityIndicator size="large" color="#002d4e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader title="Watch Salon" />
        <Text style={styles.errorText}>Error loading watches</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FixedHeader title="Watch Salon" />
      <SearchBar currentQuery={searchQuery} onSearch={setSearchQuery} />
      <FavoriteButton />
      <FilterButton />
      <FlatList
        data={watches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#002d4e"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    textAlign: "center",
  },
});
