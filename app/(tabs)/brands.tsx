import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { FavoriteButton } from '../components/FavoriteButton';

interface Brand {
  id: string;
  name: string;
  models: number;
  imageUrl?: string;
}

interface BrandCardProps {
  brand: Brand;
}

const brandsData: Brand[] = [
  { id: '1', name: 'Rolex', models: 10 },
  { id: '2', name: 'Patek Philippe', models: 15 },
  { id: '3', name: 'Audemars Piguet', models: 8 },
  { id: '4', name: 'A. Lange & Söhne', models: 12 },
  { id: '5', name: 'Vacheron Constantin', models: 9 },
];

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const router = useRouter();

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9 }
      ]}
      onPress={() => router.push(`./brand/${brand.id}`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.brandName}>{brand.name}</Text>
          <Text style={styles.modelsCount}>{brand.models} Models</Text>
        </View>
        <View style={styles.imageContainer}>
          {/* Image will be added here later */}
        </View>
      </View>
    </Pressable>
  );
};

export default function BrandsScreen() {
  return (
    <View style={styles.container}>
      <FixedHeader />
      <SearchBar />
      <FavoriteButton />
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
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        height: Dimensions.get('window').height / 6,
    },
    textContainer: {
        flex: 2,
        justifyContent: 'center',
        paddingLeft: 20,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: '#e0e0e0',
    },
    brandName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#002d4e',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    modelsCount: {
        fontSize: 16,
        color: '#666',
        letterSpacing: 0.3,
    },
});