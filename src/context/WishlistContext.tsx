import React, { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import { WishlistContext } from './wishlistContextDef';
import { useToast } from '../hooks/useToast';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pumba_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pumba_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast('Removed from Wishlist', product.name, 'info');
        return prev.filter((item) => item.id !== product.id);
      }
      showToast('Saved to Wishlist', product.name, 'success', product.imageUrl);
      return [...prev, product];
    });
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product]);
      showToast('Saved to Wishlist', product.name, 'success', product.imageUrl);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const item = wishlist.find((p) => p.id === productId);
    if (item) {
      showToast('Removed from Wishlist', item.name, 'info');
    }
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist Cleared', 'All saved items removed', 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlist: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
