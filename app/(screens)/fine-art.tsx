// app/hooks/useArtPiece.tsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { ArtPiece } from '../types/ArtPiece';

/**
 * Fetches ALL art documents from the 'ArtPieces' collection.
 * Returns an array of ArtPiece, plus loading/error states.
 */
export function useArtPiece() {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtPieces = async () => {
      setLoading(true);
      setError(null);

      try {
        const colRef = collection(db, 'ArtPieces');
        const snapshot = await getDocs(colRef);

        // Convert each Firestore doc to our ArtPiece shape
        const items = snapshot.docs.map((doc) => {
          const data = doc.data();

          // Handle price, which can be a number or string
          let priceValue: number | string = 'Price Upon Request';
          if (typeof data.price === 'string') {
            // If it's a numeric string, parse to number; otherwise keep as text
            if (!isNaN(Number(data.price))) {
              priceValue = parseFloat(data.price);
            } else {
              priceValue = data.price;
            }
          } else if (typeof data.price === 'number') {
            priceValue = data.price;
          }

          // Ensure `image` is always an array
          let images: string[] = [];
          if (Array.isArray(data.image)) {
            images = data.image;
          } else if (typeof data.image === 'string') {
            images = [data.image];
          }

          return {
            id: doc.id,
            title: data.title || 'Untitled',
            artist: data.artist || 'Unknown Artist',
            year: data.year,
            medium: data.medium,
            dimensions: data.dimensions,
            description: data.description,
            price: priceValue,
            image: images,
            newArrival: data.newArrival || false,
          } as ArtPiece;
        });

        setArtPieces(items);
      } catch (err) {
        console.error('Error fetching art pieces:', err);
        setError(err instanceof Error ? err.message : 'Error fetching art pieces');
      } finally {
        setLoading(false);
      }
    };

    fetchArtPieces();
  }, []);

  return { artPieces, loading, error };
}
