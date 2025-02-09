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

        {/* Details Panel – using BlurView without rounded top edges */}
        <BlurView intensity={50} tint="light" style={styles.detailsPanel}>
          <Text style={styles.brand}>{watch.brand}</Text>
          <Text style={styles.model}>{watch.model}</Text>
          <Text style={styles.price}>
            ${watch.price.toLocaleString()}
          </Text>

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

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TradeButton watch={watch} style={styles.inlineButton} />
            <MessageButton title="Message" style={styles.inlineButton} />
          </View>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // unified background
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // DETAILS PANEL – no rounded top edges so the image overlap is seamless
  detailsPanel: {
    marginTop: -20, // slight negative margin to allow the image to overlap
    padding: 24,
    // Removed borderTopLeftRadius and borderTopRightRadius:
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  brand: {
    fontSize: 30,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 4,
  },
  model: {
    fontSize: 24,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 4,
  },
  price: {
    fontSize: 26,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 16,
  },
  specsContainer: {
    marginVertical: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  specLabel: {
    fontSize: 16,
    color: '#3A3A3C',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 16,
    color: '#002d4e',
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  inlineButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
