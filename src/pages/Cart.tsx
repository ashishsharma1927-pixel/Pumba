import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useCart } from '../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    discount,
    total,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Your Cart | PUMBA';
    return () => {
      document.title = 'PUMBA — Next-Generation 3D E-Commerce & Hardware Architecture';
    };
  }, []);

  // Free shipping progress calculation
  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);

    if (!promoInput.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    const result = applyPromoCode(promoInput);
    if (!result.success) {
      setPromoError(result.message);
    } else {
      setPromoInput('');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-6 sm:pt-10">
      <Container>
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-8"
        >
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-accent">Cart</span>
        </nav>

        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              Secure Bag
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Shopping Cart
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-rose-400 transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-12 sm:p-20 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/40">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mb-8 leading-relaxed">
              Explore our curated futuristic catalog and add next-generation hardware and accessories to
              your setup.
            </p>
            <Link to="/shop">
              <Button size="lg" withArrow>
                Discover Collection
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Cart Content: Item List + Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Items Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Free Shipping Progress Notification */}
              <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-white mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-accent" />
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-400 font-semibold">
                        You unlocked Free Worldwide Express Shipping!
                      </span>
                    ) : (
                      <span>
                        Add{' '}
                        <span className="text-accent font-bold">
                          ${remainingForFreeShipping}
                        </span>{' '}
                        more for Free Express Shipping
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-white/50">
                    {Math.round(shippingProgress)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedVariant || ''}`}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-[#121216] border border-white/10 shadow-lg"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 group relative"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        <div className="flex flex-col min-w-0 flex-grow">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                            {item.product.category}
                          </span>
                          <Link
                            to={`/product/${item.product.id}`}
                            className="text-base sm:text-lg font-bold text-white hover:text-accent transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>

                          {/* Selected Finish or Variant */}
                          {(item.selectedColor || item.selectedVariant) && (
                            <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                              {item.selectedColor && (
                                <span>Finish: {item.selectedColor}</span>
                              )}
                              {item.selectedColor && item.selectedVariant && (
                                <span>•</span>
                              )}
                              {item.selectedVariant && (
                                <span>{item.selectedVariant}</span>
                              )}
                            </div>
                          )}

                          <span className="text-sm font-semibold text-white/90 sm:hidden mt-1">
                            ${item.product.price}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector, Price & Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between h-10 px-2 rounded-xl bg-white/5 border border-white/10 w-28">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedColor,
                                item.selectedVariant
                              )
                            }
                            aria-label="Decrease quantity"
                            className="p-1 rounded-md text-white/60 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedColor,
                                item.selectedVariant
                              )
                            }
                            aria-label="Increase quantity"
                            className="p-1 rounded-md text-white/60 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price Column */}
                        <div className="flex flex-col items-end min-w-[70px]">
                          <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                            ${item.product.price * item.quantity}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[11px] text-white/40">
                              (${item.product.price} each)
                            </span>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.selectedColor,
                              item.selectedVariant
                            )
                          }
                          aria-label="Remove item"
                          className="p-2 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Shopping Guarantee Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">Encrypted Checkout</p>
                    <p className="text-white/50">256-bit TLS security</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">30-Day Audition</p>
                    <p className="text-white/50">Full refund guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">Authentic Hardware</p>
                    <p className="text-white/50">Factory direct warranty</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#121217]/90 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-6">
                <h3 className="text-xl font-bold text-white tracking-tight">Order Summary</h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Promotional Code
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        placeholder="Try 'PUMBA10' or 'FUTURE20'"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError(null);
                        }}
                        className="w-full h-11 pl-10 pr-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-xs transition-all border border-white/10 hover:border-white"
                    >
                      Apply
                    </button>
                  </div>

                  {promoError && (
                    <span className="text-xs text-rose-400 mt-1">{promoError}</span>
                  )}

                  {appliedPromo && (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mt-1">
                      <span>Code "{appliedPromo}" Active</span>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-xs underline hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Calculation Breakdown */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10 text-sm">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">${subtotal}</span>
                  </div>

                  <div className="flex items-center justify-between text-white/70">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-white">
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        `$${shipping}`
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Discount ({appliedPromo})</span>
                      <span className="font-mono font-semibold">-${discount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-white/70">
                    <span>Carbon Neutral Offset</span>
                    <span className="font-mono text-white/50">$0.00 (Included)</span>
                  </div>

                  {/* Total Line */}
                  <div className="flex items-baseline justify-between pt-4 border-t border-white/10 text-white">
                    <span className="text-base font-bold">Total Amount</span>
                    <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                      ${total}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Button
                  size="lg"
                  variant="primary"
                  withArrow
                  onClick={handleCheckout}
                  className="w-full h-14 font-semibold text-base shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
                >
                  Proceed to Checkout
                </Button>

                <div className="text-center">
                  <Link
                    to="/shop"
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Or continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
