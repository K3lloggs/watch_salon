import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWatches } from '../hooks/useWatches';
import { SecondaryCard } from '../components/SecondaryCard';
import { TradeButton } from '../components/TradeButton';
import { MessageButton } from '../components/MessageButton';
import { FixedHeader } from '../components/FixedHeader';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { watches, loading } = useWatches();
  const watch = watches.find((w) => w.id === id);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#002d4e" />
      </SafeAreaView>
    );
  }

  if (!watch) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Watch not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Main scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FixedHeader />
        <SecondaryCard watch={watch} />

        {/* Details Card: Contains descriptive text and specs */}
        <View style={styles.detailsWrapper}>
          <View style={styles.detailsContent}>
            <Text style={styles.brand}>{watch.brand}</Text>
            <Text style={styles.model}>{watch.model}</Text>
            <Text style={styles.price}>
              ${watch.price.toLocaleString()}
            </Text>
            <View style={styles.buttonsContainer}>
              <TradeButton onPress={() => console.log('Trade button pressed')} />
              <MessageButton onPress={() => console.log('Message button pressed')} />
            </View>
            <View style={styles.specs}>
              {watch.caseMaterial && (
                <Text style={styles.specText}>
                  Case Material: {watch.caseMaterial}
                </Text>
              )}
              {watch.caseDiameter && (
                <Text style={styles.specText}>
                  Diameter: {watch.caseDiameter}
                </Text>
              )}
              {watch.movement && (
                <Text style={styles.specText}>
                  Movement: {watch.movement}
                </Text>
              )}
              {watch.dial && (
                <Text style={styles.specText}>
                  Dial: {watch.dial}
                </Text>
              )}
              {watch.strap && (
                <Text style={styles.specText}>
                  Strap: {watch.strap}
                </Text>
              )}
              {watch.year && (
                <Text style={styles.specText}>
                  Year: {watch.year}
                </Text>
              )}
              <Text style={styles.specText}>
                Box: {watch.box ? 'Yes' : 'No'}
              </Text>
              <Text style={styles.specText}>
                Papers: {watch.papers ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom action buttons */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 100, // Add bottom padding so content isn’t hidden behind the buttons
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
  },
  // The detailsWrapper is styled as a card with rounded top corners.
  detailsWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20, // Overlap slightly with the image for a card-like effect
    elevation: 5,
  },
  detailsContent: {
    marginBottom: 20,
  },
  brand: {
    fontSize: 26,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 8,
  },
  model: {
    fontSize: 20,
    color: '#002d4e',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 12,
  },
  specs: {
    marginTop: 12,
  },
  specText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  // Bottom buttons container with a subtle top border.
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 100,
    borderTopWidth: 0,
    borderColor: '#eee',
  },
});
