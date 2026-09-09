import { createContext } from 'react';
import type { Product } from '../types/product';

export interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  totalWishlist: number;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
