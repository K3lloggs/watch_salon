// app/fine-art/index.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { ArtCard } from '../components/ArtCard';
import { useArtPiece } from '../hooks/useArtPieces';

export default function FineArtScreen() {
  const { artPieces, loading, error } = useArtPiece();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <FixedHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#002d4e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FixedHeader />
      <FlatList
        data={artPieces}
        renderItem={({ item }) => <ArtCard art={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
});