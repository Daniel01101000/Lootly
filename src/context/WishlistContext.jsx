import { createContext, useContext, useState, useCallback } from 'react';
import * as wishlistService from '../services/wishlist.service';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await wishlistService.getWishlist();
      setItems(res.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addItem = async (productId) => {
    await wishlistService.addToWishlist(productId);
    await fetchWishlist();
  };

  const removeItem = async (productId) => {
    await wishlistService.removeFromWishlist(productId);
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const isWishlisted = (productId) => items.some((i) => i.id === productId);

  return (
    <WishlistContext.Provider value={{ items, loading, fetchWishlist, addItem, removeItem, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
