// app/hooks/useWatches.ts
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, or } from 'firebase/firestore';
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
          // (Brand & Model partial matches only if stored in lowercase)
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
        const watchesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          brand: doc.data().brand?.toString() || '',
          model: doc.data().model?.toString() || '',
          price: Number(doc.data().price) || 0,
          year: doc.data().year?.toString() || '',
          image: Array.isArray(doc.data().image) ? doc.data().image : [],
          caseMaterial: doc.data().caseMaterial?.toString() || '',
          caseDiameter: doc.data().caseDiameter?.toString() || '',
          box: doc.data().box || false,
          papers: doc.data().papers || false,
          newArrival: doc.data().newArrival || false,
        })) as Watch[];

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
