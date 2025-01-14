import React, { createContext, useState, useContext } from 'react';

type SortOption = 'highToLow' | 'lowToHigh' | null;

interface SortContextType {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export function SortProvider({ children }: { children: React.ReactNode }) {
  const [sortOption, setSortOption] = useState<SortOption>(null);

  return (
    <SortContext.Provider value={{ sortOption, setSortOption }}>
      {children}
    </SortContext.Provider>
  );
}

export function useSortContext() {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error('useSortContext must be used within a SortProvider');
  }
  return context;
}