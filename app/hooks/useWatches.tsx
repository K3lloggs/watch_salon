// hooks/useWatches.ts
import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
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
        let querySnapshot;

        if (searchQuery.trim()) {
          // Get all watches and filter in memory for better partial matches
          const allQuery = query(watchesRef);
          querySnapshot = await getDocs(allQuery);

          const searchTerm = searchQuery.toLowerCase().trim();
          const filteredWatches = querySnapshot.docs.filter(doc => {
            const data = doc.data();
            const brand = (data.brand || '').toString().toLowerCase();
            const model = (data.model || '').toString().toLowerCase();
            const year = (data.year || '').toString().toLowerCase();

            return (
              brand.includes(searchTerm) ||
              model.includes(searchTerm) ||
              year.includes(searchTerm)
            );
          });

          querySnapshot = { docs: filteredWatches };
        } else {
          // No search query, get all watches
          const allQuery = query(watchesRef, orderBy('brand'));
          querySnapshot = await getDocs(allQuery);
        }

        const watchesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          
          // Handle image array/object conversion
          let images: string[] = [];
          if (data.image) {
            if (Array.isArray(data.image)) {
              images = data.image;
            } else if (typeof data.image === 'object') {
              images = Object.values(data.image);
            }
          }

          return {
            id: doc.id,
            brand: data.brand || '',
            model: data.model || '',
            price: Number(data.price) || 0,
            year: data.year || '',
            image: images,
            caseMaterial: data.caseMaterial || '',
            caseDiameter: data.caseDiameter || '',
            box: data.box || false,
            papers: data.papers || false,
            newArrival: data.newArrival || false,
            movement: data.movement || '',
            powerReserve: data.powerReserve || '',
            dial: data.dial || '',
            strap: data.strap || '',
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

    // Debounce the search to prevent too many requests
    const timeoutId = setTimeout(fetchWatches, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return { watches, loading, error };
}