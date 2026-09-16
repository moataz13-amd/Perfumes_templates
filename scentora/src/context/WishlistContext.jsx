import { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/helpers';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage(STORAGE_KEYS.wishlist, []);

  const toggleWishlist = useCallback(
    (product) => {
      const id = product.id;
      let added = false;
      setWishlist((prev) => {
        const exists = prev.some((p) => p.id === id);
        added = !exists;
        return exists
          ? prev.filter((p) => p.id !== id)
          : [
              ...prev,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                image: product.images[0],
                rating: product.rating,
                reviewCount: product.reviewCount,
                size: product.size?.[0],
              },
            ];
      });
      return added;
    },
    [setWishlist]
  );

  const isInWishlist = useCallback(
    (productId) => wishlist.some((p) => p.id === productId),
    [wishlist]
  );

  const removeFromWishlist = useCallback(
    (productId) => setWishlist((prev) => prev.filter((p) => p.id !== productId)),
    [setWishlist]
  );

  const clearWishlist = useCallback(() => setWishlist([]), [setWishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [wishlist, toggleWishlist, isInWishlist, removeFromWishlist, clearWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

export default WishlistContext;