import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  or,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Watch } from '../types/Watch';

export function useWatches(searchQuery: string = '') {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const watchesRef = collection(db, 'Watches');
        let snapshot;

        if (searchQuery.trim()) {
          const lowercasedQuery = searchQuery.toLowerCase();

          // Firestore OR query for partial prefix matches
          const searchQ = query(
            watchesRef,
            or(
              where('brand', '>=', lowercasedQuery),
              where('model', '>=', lowercasedQuery),
              where('year', '==', lowercasedQuery)
            )
          );

          snapshot = await getDocs(searchQ);
        } else {
          // No search -> fetch all
          const allQuery = query(watchesRef);
          snapshot = await getDocs(allQuery);
        }

        // Convert snapshot docs to Watch objects
        const watchesData = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Convert the `image` field (map or array) to an array of strings
          let images: string[] = [];
          if (data.image) {
            if (Array.isArray(data.image)) {
              // Old approach (array)
              images = data.image;
            } else if (typeof data.image === 'object') {
              // New approach (map) -> convert map values to array
              images = Object.values(data.image);
            }
          }

          return {
            id: doc.id,
            brand: data.brand?.toString() || '',
            model: data.model?.toString() || '',
            price: Number(data.price) || 0,
            year: data.year?.toString() || '',
            image: images,
            caseMaterial: data.caseMaterial?.toString() || '',
            caseDiameter: data.caseDiameter?.toString() || '',
            box: data.box || false,
            papers: data.papers || false,
            newArrival: data.newArrival || false,
            movement: data.movement?.toString() || '',
            powerReserve: data.powerReserve?.toString() || '',
            dial: data.dial?.toString() || '',
            strap: data.strap?.toString() || '',
          } as Watch;
        });

        setWatches(watchesData);
      } catch (err) {
        console.error('Error fetching watches:', err);
        setError(err instanceof Error ? err.message : 'Error fetching watches');
      } finally {
        setLoading(false);
      }
    };

    fetchWatches();
  }, [searchQuery]);

  return { watches, loading, error };
}
