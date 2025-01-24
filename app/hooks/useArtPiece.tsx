// app/hooks/useArtPiece.tsx
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { ArtPiece } from '../types/ArtPiece';

export function useArtPiece(artId: string) {
  const [art, setArt] = useState<ArtPiece | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtPiece = async () => {
      // If no artId is provided, don't attempt Firestore query
      if (!artId) {
        setArt(null);
        setLoading(false);
        setError('No art ID provided.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const artRef = doc(db, 'ArtPieces', artId);
        const snapshot = await getDoc(artRef);

        if (!snapshot.exists()) {
          setArt(null);
          setError(`Art piece not found for ID: ${artId}`);
          setLoading(false);
          return;
        }

        const data = snapshot.data();

        // Handle price as number or string
        let priceValue: number | string = 'Price Upon Request';
        if (typeof data.price === 'string') {
          // If the string can be parsed as a number, do so
          if (!isNaN(Number(data.price))) {
            priceValue = parseFloat(data.price);
          } else {
            // e.g., "Price Upon Request"
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

        const artPiece: ArtPiece = {
          id: snapshot.id,
          title: data.title || 'Untitled',
          artist: data.artist || 'Unknown Artist',
          year: data.year,
          medium: data.medium,
          dimensions: data.dimensions,
          description: data.description,
          price: priceValue,
          image: images,
          newArrival: data.newArrival || false,
        };

        setArt(artPiece);
      } catch (err) {
        console.error('Error fetching art piece:', err);
        setError(err instanceof Error ? err.message : 'Error fetching art piece');
      } finally {
        setLoading(false);
      }
    };

    fetchArtPiece();
  }, [artId]);

  return { art, loading, error };
}
