import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SecondaryCard } from '../components/SecondaryCard';
import { TradeButton } from '../components/TradeButton';
import { MessageButton } from '../components/MessageButton';
import { FixedHeader } from '../components/FixedHeader';
import { useWatches } from '../hooks/useWatches';
import { useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const { watches, loading } = useWatches();
  const watch = watches.find((w) => w.id === id);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (!watch) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Watch not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FixedHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Carousel */}
        <SecondaryCard watch={watch} />

        {/* Details Panel */}
        <BlurView intensity={50} tint="light" style={styles.detailsPanel}>
          <Text style={styles.brand}>{watch.brand}</Text>
          <Text style={styles.model}>{watch.model}</Text>
          <Text style={styles.price}>
            ${watch.price.toLocaleString()}
          </Text>

          {/* Action Buttons - Now vertically stacked */}
          <View style={styles.buttonContainer}>
            <TradeButton watch={watch} />
            <MessageButton title="Inquire about this watch" />
          </View>

          {/* Watch Specs */}
          <View style={styles.specsContainer}>
            {watch.caseMaterial && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Case Material</Text>
                <Text style={styles.specValue}>{watch.caseMaterial}</Text>
              </View>
            )}
            {watch.caseDiameter && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Diameter</Text>
                <Text style={styles.specValue}>{watch.caseDiameter}</Text>
              </View>
            )}
            {watch.movement && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Movement</Text>
                <Text style={styles.specValue}>{watch.movement}</Text>
              </View>
            )}
            {watch.dial && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Dial</Text>
                <Text style={styles.specValue}>{watch.dial}</Text>
              </View>
            )}
            {watch.strap && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Strap</Text>
                <Text style={styles.specValue}>{watch.strap}</Text>
              </View>
            )}
            {watch.year && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Year</Text>
                <Text style={styles.specValue}>{watch.year}</Text>
              </View>
            )}
          </View>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsPanel: {
    marginTop: -20,
    padding: 24,
    overflow: 'hidden',
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    color: '#002d4e',
    marginBottom: 4,
  },
  model: {
    fontSize: 24,
    fontWeight: '500',
    color: '#002d4e',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 32,
    gap: 12,
  },
  specsContainer: {
    marginTop: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  specLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  specValue: {
    fontSize: 16,
    color: '#002d4e',
    fontWeight: '500',
  },
});