import { createContext, useContext, useMemo, useCallback, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/helpers';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.cart, []);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (product, { size = null, quantity = 1, variantLabel = null } = {}) => {
      setItems((prev) => {
        const resolvedSize = size || product.size?.[0] || 'Standard';
        const existing = prev.find(
          (i) => i.id === product.id && i.size === resolvedSize
        );
        if (existing) {
          return prev.map((i) =>
            i.id === product.id && i.size === resolvedSize
              ? { ...i, quantity: Math.min(i.quantity + quantity, 99) }
              : i
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.images[0],
            size: resolvedSize,
            quantity,
            variantLabel,
          },
        ];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (id, size) => {
      setItems((prev) =>
        prev.filter((i) => !(i.id === id && i.size === size))
      );
    },
    [setItems]
  );

  const updateQuantity = useCallback(
    (id, size, quantity) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === id && i.size === size ? { ...i, quantity: Math.min(quantity, 99) } : i
        )
      );
    },
    [setItems]
  );

  const updateVariant = useCallback(
    (id, oldSize, newSize) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id && i.size === oldSize);
        if (!item) return prev;
        const without = prev.filter((i) => !(i.id === id && i.size === oldSize));
        const existing = without.find((i) => i.id === id && i.size === newSize);
        if (existing) {
          return without.map((i) =>
            i.id === id && i.size === newSize
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }
        return [...without, { ...item, size: newSize }];
      });
    },
    [setItems]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const itemsCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      updateVariant,
      clearCart,
      itemsCount,
      subtotal,
    }),
    [
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      updateVariant,
      clearCart,
      itemsCount,
      subtotal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;