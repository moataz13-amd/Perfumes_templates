import { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/helpers';

const RecentlyViewedContext = createContext(null);

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage(
    STORAGE_KEYS.recentlyViewed,
    []
  );

  const addRecentlyViewed = useCallback(
    (product) => {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((p) => p.id !== product.id);
        return [
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images[0],
          },
          ...filtered,
        ].slice(0, 10);
      });
    },
    [setRecentlyViewed]
  );

  const clearRecentlyViewed = useCallback(() => setRecentlyViewed([]), [setRecentlyViewed]);

  const value = useMemo(
    () => ({ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }),
    [recentlyViewed, addRecentlyViewed, clearRecentlyViewed]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx)
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
};

export default RecentlyViewedContext;