import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => { },
  hideLoading: () => { },
});

export const useLoading = () => useContext(LoadingContext);

// Global flag to prevent loading on subsequent tab changes
let initialNavigationCompleted = false;

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback(() => {
    // Only show loading if it's the first tab navigation
    if (!initialNavigationCompleted) {
      setIsLoading(true);
    }
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    // Mark that initial navigation is complete
    initialNavigationCompleted = true;
  }, []);

  useEffect(() => {
    if (isLoading) {
      // Auto-hide loading after a short period to prevent getting stuck
      const timeout = setTimeout(() => {
        hideLoading();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, hideLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}