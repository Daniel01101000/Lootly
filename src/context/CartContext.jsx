import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cart.service';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await cartService.getCart();
      setItems(res.data?.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (productId) => {
    if (!user) throw new Error('LOGIN_REQUIRED');
    await cartService.addToCart(productId);
    await fetchCart();
  }, [user, fetchCart]);

  const removeItem = useCallback(async (productId) => {
    await cartService.removeFromCart(productId);
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) return;
    await cartService.updateCartItem(productId, quantity);
    setItems((prev) =>
      prev.map((i) =>
        i.product_id === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(async () => {
    await cartService.clearCart();
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (productId) => items.some((i) => i.product_id === productId),
    [items]
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + (i.current_price || 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items, loading, fetchCart,
        addItem, removeItem, updateQuantity, clearCart, isInCart,
        totalItems, totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
