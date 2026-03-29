import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCart, updateCartItem, removeCartItem, addToCart } from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  const refreshCartCount = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetchCart();
      const items = res.data?.data?.items || [];
      const count = items.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartItems(items);
      setCartCount(count);
    } catch (err) {
      console.error('Failed to refresh cart count', err);
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  const updateQuantity = async (productId, newQty) => {
    // Find item id from cartItems
    const item = cartItems.find(i => i.product_id === productId);
    if (!item) {
        if (newQty > 0) {
            await addToCart(productId, newQty);
            await refreshCartCount();
        }
        return;
    }
    
    if (newQty <= 0) {
        await removeCartItem(item.id);
    } else {
        await updateCartItem(item.id, newQty);
    }
    await refreshCartCount();
  };

  // Refresh count when user logs in/out
  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, refreshCartCount, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
