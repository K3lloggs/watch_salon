import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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

const brandsData: Brand[] = [
  { id: '1', name: 'Brand A', models: 10 },
  { id: '2', name: 'Brand B', models: 15 },
  { id: '3', name: 'Brand C', models: 8 },
];

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => (
  <TouchableOpacity style={styles.brandCard}>
    <Text style={styles.brandName}>{brand.name}</Text>
    <View style={styles.imageContainer} />
  </TouchableOpacity>
);

export default function BrandsScreen() {
  return (
    <View style={styles.container}>
      <FixedHeader/>
      <SearchBar/>
      <FlatList
        data={brandsData}
        renderItem={({ item }) => <BrandCard brand={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 24,
  },
  brandCard: {
    height: Dimensions.get('window').height / 5 - 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: '10%',
    height: '100%',
    backgroundColor: '#ffffff',
  }
});