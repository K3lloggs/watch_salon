import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { FixedHeader } from '../components/FixedHeader';
import { SearchBar } from '../components/SearchBar';
import { FavoriteButton } from '../components/FavoriteButton';

/** A simple interface for brand display. */
interface Brand {
  id: string;       // We'll use the brand name as the 'id'
  name: string;
  models: number;
  image?: string;   // The single image we display for this brand
}

/** Props for the BrandCard component. */
interface BrandCardProps {
  brand: Brand;
}

/**
 * BrandCard: displays brand info in a pressable card.
 */
const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      onPress={() => router.push(`./brand/${brand.id}`)}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.brandName}>{brand.name}</Text>
          <Text style={styles.modelsCount}>{brand.models} Models</Text>
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
    </Pressable>
  );
};

/**
 * BrandsScreen: Fetches all watches, groups them by brand,
 * and displays brand cards with a representative image.
 */
export default function BrandsScreen() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const watchesCollection = collection(db, 'Watches');
        const snapshot = await getDocs(watchesCollection);

        // Convert each Firestore doc to a partial brand-like object
        const rawData = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Data might have an array of images or a single image
          const images = Array.isArray(data.image) ? data.image : [data.image];
          return {
            brandName: data.brand || '',
            // We'll store the first watch image (index 0) for brand display
            firstImage: images && images[0] ? images[0] : null,
          };
        });

        // Group by brandName and count the models
        const brandGroups: Brand[] = [];

        rawData.forEach((item) => {
          const existingBrand = brandGroups.find(
            (b) => b.name.toLowerCase() === item.brandName.toLowerCase()
          );
          if (existingBrand) {
            // Increment the model count
            existingBrand.models += 1;
            // We do NOT overwrite the brand image once it's set
          } else {
            // Create a new brand group with the brand name as ID
            brandGroups.push({
              id: item.brandName,
              name: item.brandName,
              models: 1,
              image: item.firstImage || undefined,
            });
          }
        });

        setBrands(brandGroups);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <View style={styles.container}>
      <FixedHeader />
      <SearchBar searchQuery="" setSearchQuery={() => {}} />
      <FavoriteButton />

      {/* Loading Indicator (optional) */}
      {loading && (
        <View style={{ marginVertical: 16 }}>
          <Text>Loading brands...</Text>
        </View>
      )}

      <FlatList
        data={brands}
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
    top:50,
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
    overflow: 'hidden',
  },
  brandImage: {
    width: '100%',
    height: '100%',
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
