// context/FavoritesContext.tsx
import React, { createContext, useState, useContext } from 'react';

export interface Watch {
  id: string;
  brand: string;
  model: string;
  price: number;  // Keep as number for watches
  year?: string;
  condition?: string;
}

export interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  description?: string;
  price: number | String;  // Changed to number to match Watch interface
}

type FavoriteItem = Watch | ArtPiece;

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const addFavorite = (item: FavoriteItem) => {
    // Ensure price is converted to number if it's a string
    if (typeof item.price === 'string') {
      item.price = parseFloat(item.price);
    }
    setFavorites(prev => [...prev, item]);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}