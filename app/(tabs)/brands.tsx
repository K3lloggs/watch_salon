import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';

interface Brand {
  id: string;
  name: string;
  models: number;
}

interface BrandCardProps {
  brand: Brand;
}

// Mock data for brands
const brandsData: Brand[] = [
  { id: '1', name: 'Rolex', models: 42 },
  { id: '2', name: 'Patek Philippe', models: 28 },
  { id: '3', name: 'Audemars Piguet', models: 35 },
  { id: '4', name: 'Omega', models: 38 },
  { id: '5', name: 'Cartier', models: 31 },
];

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => (
  <TouchableOpacity style={styles.brandCard}>
    <View style={styles.brandLogoContainer}>
      {/* Placeholder for brand logo */}
      <View style={styles.brandLogo} />
    </View>
    <Text style={styles.brandName}>{brand.name}</Text>
    <Text style={styles.modelCount}>{brand.models} Models</Text>
  </TouchableOpacity>
);

export default function BrandsScreen() {
  return (
    <View style={styles.container}>
      <FixedHeader />
      <SearchBar />
      <FlatList
        data={brandsData}
        renderItem={({ item }) => <BrandCard brand={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  brandCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  brandLogoContainer: {
    width: 80,
    height: 80,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e0e0e0',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 4,
  },
  modelCount: {
    fontSize: 12,
    color: '#666',
  },
});