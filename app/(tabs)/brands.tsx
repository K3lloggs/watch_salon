import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { FavoriteButton } from '../components/FavoriteButton';

interface Brand {
  id: string;
  name: string;
  models: number;
  image?: string;
}

interface BrandCardProps {
  brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardWrapper,
        pressed && { opacity: 0.9 },
      ]}
      onPress={() =>
        router.push({
          pathname: `../Brands/${brand.id}`,
          params: { brandName: brand.name },
        })
      }
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.brandName} numberOfLines={1}>
              {brand.name}
            </Text>
            <Text style={styles.modelsCount}>
              {brand.models} Models
            </Text>
          </View>
          <View style={styles.imageContainer}>
            {brand.image && (
              <Image
                source={{ uri: brand.image }}
                style={styles.brandImage}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default function BrandsScreen() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBrands = async () => {
    try {
      const watchesCollection = collection(db, 'Watches');
      const snapshot = await getDocs(watchesCollection);

      const rawData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const images = Array.isArray(data.image) ? data.image : [data.image];
        return {
          brandName: data.brand || '',
          firstImage: images && images[0] ? images[0] : null,
        };
      });

      const brandGroups: Brand[] = [];
      rawData.forEach((item) => {
        const existingBrand = brandGroups.find(
          (b) => b.name.toLowerCase() === item.brandName.toLowerCase()
        );
        if (existingBrand) {
          existingBrand.models += 1;
        } else {
          brandGroups.push({
            id: item.brandName,
            name: item.brandName,
            models: 1,
            image: item.firstImage || undefined,
          });
        }
      });

      setBrands(brandGroups);
      setFilteredBrands(brandGroups);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBrands(brands);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(query)
    );
    setFilteredBrands(filtered);
  }, [searchQuery, brands]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <FixedHeader />
        <ActivityIndicator size="large" color="#002d4e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FixedHeader />
      <SearchBar currentQuery={searchQuery} onSearch={setSearchQuery} />
      <FavoriteButton />
      <FlatList
        data={filteredBrands}
        renderItem={({ item }) => <BrandCard brand={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    backgroundColor: '#ffffff' 
  },
  listContent: { 
    padding: 10 
  },
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#003366', // lighter navy blue shadow
    shadowOpacity: .5, // full opacity
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    height: Dimensions.get('window').height / 6,
  },
  textContainer: {
    flex: 3, // increased space for text
    justifyContent: 'center',
    paddingLeft: 10, // reduced padding to allow more room
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#F6F7F8',
    overflow: 'hidden',
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    fontSize: 22, // reduced from 24
    fontWeight: '700',
    color: '#002d4e',
    letterSpacing: 0.2, // reduced letter spacing
  },
  modelsCount: {
    fontSize: 16,
    color: '#666',
    letterSpacing: 0.3,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});