import React, { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import { CartContext, type CartItem, type PromoCodeResult } from './cartContextDef';
import { useToast } from '../hooks/useToast';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pumba_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('pumba_promo');
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('pumba_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem('pumba_promo', appliedPromo);
      } else {
        localStorage.removeItem('pumba_promo');
      }
    } catch (e) {
      console.error('Failed to save promo to localStorage', e);
    }
  }, [appliedPromo]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedVariant?: string
  ) => {
    // Ensure safe positive quantity
    const safeQty = Math.max(1, quantity);

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedVariant === selectedVariant
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += safeQty;
        return updated;
      }

      return [...prev, { product, quantity: safeQty, selectedColor, selectedVariant }];
    });

    showToast(
      'Added to Cart',
      `${safeQty}x ${product.name} ${selectedColor ? `(${selectedColor})` : ''}`,
      'success',
      product.imageUrl
    );
  };

  const removeFromCart = (
    productId: string,
    selectedColor?: string,
    selectedVariant?: string
  ) => {
    setItems((prev) => {
      const itemToRemove = prev.find(
        (item) =>
          item.product.id === productId &&
          (selectedColor === undefined || item.selectedColor === selectedColor) &&
          (selectedVariant === undefined || item.selectedVariant === selectedVariant)
      );

      if (itemToRemove) {
        showToast('Removed from Cart', itemToRemove.product.name, 'info');
      }

      return prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (selectedColor === undefined || item.selectedColor === selectedColor) &&
            (selectedVariant === undefined || item.selectedVariant === selectedVariant)
          )
      );
    });
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedVariant?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedVariant);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          (selectedColor === undefined || item.selectedColor === selectedColor) &&
          (selectedVariant === undefined || item.selectedVariant === selectedVariant)
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  // Pricing calculations
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Free shipping on orders >= $150
  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 15;

  // Discount calculation
  let discount = 0;
  if (appliedPromo === 'PUMBA10') {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedPromo === 'FUTURE20') {
    discount = Math.round(subtotal * 0.2);
  } else if (appliedPromo === 'NEO50') {
    discount = subtotal >= 200 ? 50 : 0;
  }

  const total = Math.max(0, subtotal - discount + shipping);

  const applyPromoCode = (code: string): PromoCodeResult => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'PUMBA10') {
      setAppliedPromo('PUMBA10');
      showToast('Promo Applied', '10% discount applied to your order', 'success');
      return { success: true, message: '10% discount applied!' };
    }
    if (formatted === 'FUTURE20') {
      setAppliedPromo('FUTURE20');
      showToast('Promo Applied', '20% discount applied to your order', 'success');
      return { success: true, message: '20% discount applied!' };
    }
    if (formatted === 'NEO50') {
      if (subtotal < 200) {
        return {
          success: false,
          message: 'NEO50 requires a minimum order of $200.',
        };
      }
      setAppliedPromo('NEO50');
      showToast('Promo Applied', '$50 discount applied to your order', 'success');
      return { success: true, message: '$50 discount applied!' };
    }

    return {
      success: false,
      message: "Invalid promo code. Try 'PUMBA10' or 'FUTURE20'.",
    };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo Removed', 'Discount removed from order', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        discount,
        total,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
