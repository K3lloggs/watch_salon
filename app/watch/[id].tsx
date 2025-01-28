import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWatches } from '../hooks/useWatches';
import { SecondaryCard } from '../components/SecondaryCard';
import { TradeButton } from '../components/TradeButton';
import { MessageButton } from '../components/MessageButton';
import { FixedHeader } from '../components/FixedHeader';
import { FavoriteButton } from '../components/FavoriteButton';

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
      <ScrollView>
        
        <FixedHeader/>
        
        {/* SecondaryCard might show a large image carousel or watch preview */}
        <SecondaryCard watch={watch} />

        {/* Watch Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.brand}>{watch.brand}</Text>
            <Text style={styles.model}>{watch.model}</Text>
            <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
            <TradeButton onPress={() => console.log('Trade button pressed')} style={styles.TradeButton} />
            <MessageButton onPress={() => console.log('Message button pressed')}style={styles.MessageButton} />
          </View>
          <View style={styles.rightColumn}>
            {watch.caseMaterial && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Case Material:</Text>
                <Text style={styles.specValue}>{watch.caseMaterial}</Text>
              </View>
            )}
            {watch.caseDiameter && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Diameter:</Text>
                <Text style={styles.specValue}>{watch.caseDiameter}</Text>
              </View>
            )}
            {watch.movement && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Movement:</Text>
                <Text style={styles.specValue}>{watch.movement}</Text>
              </View>
            )}
            {watch.dial && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Dial:</Text>
                <Text style={styles.specValue}>{watch.dial}</Text>
              </View>
            )}
            {watch.strap && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Strap:</Text>
                <Text style={styles.specValue}>{watch.strap}</Text>
              </View>
            )}
            {watch.year && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Year:</Text>
                <Text style={styles.specValue}>{watch.year}</Text>
              </View>
            )}
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Box:</Text>
              <Text style={styles.specValue}>{watch.box ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Papers:</Text>
              <Text style={styles.specValue}>{watch.papers ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftColumn: {
    flex: 1,
    marginRight: 16,
  },
  rightColumn: {
    flex: 1,
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 4,
  },
  model: {
    fontSize: 20,
    color: '#002d4e',
    marginBottom: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 24,
  },
  specRow: {
    marginBottom: 12,
    gap: 4,
  },
  specKey: {
    fontSize: 16,
    color: '#002d4e',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 16,
    color: '#333',
  },
  TradeButton: {
    marginBottom: 16,
  },
  
  MessageButton: {
 
  },
});
