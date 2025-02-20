import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Watch } from "../types/Watch";
import { SortOption } from "../context/SortContext";

export function useWatches(searchQuery: string = "", sortOption: SortOption = null) {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const watchesRef = collection(db, "Watches");
        let querySnapshot;

        if (searchQuery.trim()) {
          // When there's a search query, fetch all watches and then filter in memory.
          const allQuery = query(watchesRef);
          querySnapshot = await getDocs(allQuery);

          const searchTerm = searchQuery.toLowerCase().trim();
          let filteredDocs = querySnapshot.docs.filter((doc) => {
            const data = doc.data();
            // Convert all searchable fields to strings and handle undefined values
            const brand = String(data.brand || "").toLowerCase();
            const model = String(data.model || "").toLowerCase();
            const year = String(data.year || "").toLowerCase();

            return (
              brand.includes(searchTerm) ||
              model.includes(searchTerm) ||
              year.includes(searchTerm)
            );
          });

          // Sort in memory if sortOption is provided.
          if (sortOption === "highToLow") {
            filteredDocs.sort((a, b) => Number(b.data().price) - Number(a.data().price));
          } else if (sortOption === "lowToHigh") {
            filteredDocs.sort((a, b) => Number(a.data().price) - Number(b.data().price));
          }

          querySnapshot = { docs: filteredDocs };
        } else {
          // No search query. Use Firebase ordering.
          if (sortOption) {
            const sortDirection = sortOption === "highToLow" ? "desc" : "asc";
            const allQuery = query(watchesRef, orderBy("price", sortDirection));
            querySnapshot = await getDocs(allQuery);
          } else {
            // Default ordering (e.g., by brand)
            const allQuery = query(watchesRef, orderBy("brand"));
            querySnapshot = await getDocs(allQuery);
          }
        }

        const watchesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Convert image field to an array
          let images: string[] = [];
          if (data.image) {
            if (Array.isArray(data.image)) {
              images = data.image;
            } else if (typeof data.image === "object") {
              images = Object.values(data.image);
            }
          }

          // Convert Firestore timestamp to milliseconds
          let dateAddedMillis = 0;
          if (data.dateAdded && typeof data.dateAdded.toMillis === 'function') {
            dateAddedMillis = data.dateAdded.toMillis();
          } else {
            dateAddedMillis = Number(data.dateAdded);
          }

          // Check if the watch was added within the last 14 days (2 weeks)
          const isNewArrival = Date.now() - dateAddedMillis < 14 * 24 * 60 * 60 * 1000;

          return {
            id: doc.id,
            brand: data.brand || "",
            model: data.model || "",
            price: Number(data.price) || 0,
            year: String(data.year || ""),
            image: images,
            caseMaterial: data.caseMaterial || "",
            caseDiameter: data.caseDiameter || "",
            box: data.box || false,
            papers: data.papers || false,
            newArrival: isNewArrival,
            movement: data.movement || "",
            hold: data.hold || "",
            powerReserve: data.powerReserve || "",
            dial: data.dial || "",
            strap: data.strap || "",
            referenceNumber: data.referenceNumber || "",
            sku: data.sku || "",
            description: data.description || "",
            dateAdded: dateAddedMillis,
            likes: data.likes ?? 0,
            warranty: data.warranty || "",
            complications: data.complications || [],
            exhibitionCaseback: data.exhibitionCaseback || false,
          } as Watch;
        });

        setWatches(watchesData);
      } catch (err) {
        console.error("Error fetching watches:", err);
        setError(err instanceof Error ? err.message : "Error fetching watches");
      } finally {
        setLoading(false);
      }
    };

    // Debounce fetching to reduce rapid requests
    const timeoutId = setTimeout(fetchWatches, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, sortOption]);

  return { watches, loading, error };
}
