'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  loading: boolean;
  syncCart: () => Promise<void>;
  user: User | null;
  login: (email: string, firstName?: string, lastName?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate or get session ID for cart tracking
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('cartSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cartSessionId', sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  // Initialize session ID and user on mount
  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
    
    // Check for saved user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch cart from MongoDB on mount
  const syncCart = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await response.json();

      if (data.success && data.cart) {
        // Convert MongoDB cart format to CartItem format
        const cartItems: CartItem[] = data.cart.items.map((item: any) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          quantity: item.quantity
        }));
        setCart(cartItems);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      syncCart();
    }
  }, [sessionId]);

  // Backup to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  const addToCart = async (item: CartItem) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          item: {
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size,
            quantity: item.quantity
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        await syncCart(); // Refresh cart from server
      } else {
        // Fallback to local state
        setCart((prevCart) => {
          const existingItem = prevCart.find((i) => i.id === item.id && i.size === item.size);
          
          if (existingItem) {
            return prevCart.map((i) =>
              i.id === item.id && i.size === item.size 
                ? { ...i, quantity: i.quantity + item.quantity } 
                : i
            );
          }
          
          return [...prevCart, item];
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local state
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i.id === item.id && i.size === item.size);
        
        if (existingItem) {
          return prevCart.map((i) =>
            i.id === item.id && i.size === item.size 
              ? { ...i, quantity: i.quantity + item.quantity } 
              : i
          );
        }
        
        return [...prevCart, item];
      });
    }
  };

  const removeFromCart = async (id: string, size: string) => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}&productId=${id}&size=${size}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await syncCart(); // Refresh cart from server
      } else {
        // Fallback to local state
        setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.size === size)));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to local state
      setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.size === size)));
    }
  };

  const updateQuantity = async (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId: id,
          size,
          quantity
        })
      });

      const data = await response.json();

      if (data.success) {
        await syncCart(); // Refresh cart from server
      } else {
        // Fallback to local state
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Fallback to local state
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id && item.size === size ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setCart([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setCart([]);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const login = (email: string, firstName?: string, lastName?: string) => {
    const userData: User = { email, firstName, lastName };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = user !== null;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        loading,
        syncCart,
        user,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
