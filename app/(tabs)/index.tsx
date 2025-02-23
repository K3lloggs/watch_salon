import React, { useState, useCallback, useRef } from "react";
import { View, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Text } from "react-native";
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
  const flatListRef = useRef<FlatList>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

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
      {/* Pass the scrollToTop callback to FilterButton */}
      <FilterButton onFilterSelect={scrollToTop} />
      <FlatList
        ref={flatListRef}
        data={watches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#002d4e" />
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
