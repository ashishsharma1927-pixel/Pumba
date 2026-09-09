import { createContext } from 'react';
import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedVariant?: string;
}

export interface PromoCodeResult {
  success: boolean;
  message: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedVariant?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedVariant?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => PromoCodeResult;
  removePromoCode: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
