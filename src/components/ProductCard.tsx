import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { cn } from '../utils/cn';

export interface ProductCardProps {
  product: Product;
  delay?: number;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product, isWishlisted: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  delay = 0,
  onAddToCart,
  onToggleWishlist,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const [isAdded, setIsAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth 3D tilt calculations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (onToggleWishlist) {
      onToggleWishlist(product, !isWishlisted);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded) return;

    addToCart(product, 1);
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product);
    }

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="group relative flex flex-col h-full rounded-2xl sm:rounded-3xl transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus-within:ring-2 focus-within:ring-accent cursor-pointer"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative flex flex-col h-full rounded-2xl sm:rounded-3xl bg-[#121214] border border-white/10 hover:border-white/20 transition-colors duration-500 overflow-hidden"
      >
        {/* Dynamic mouse specular reflection / glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.08) 0%, transparent 60%)`
            ),
          }}
        />

        {/* Product Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-white/[0.02] flex items-center justify-center">
          {/* Zooming background image */}
          <div
            className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          />

          {/* Ambient overlay shadows */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/20 to-black/30 transition-opacity duration-500 group-hover:opacity-80" />

          {/* Badges Container (Top Left) */}
          <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 flex flex-col gap-1.5 items-start">
            {product.discountBadge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-accent/90 backdrop-blur-md text-white border border-accent/30 shadow-lg shadow-accent/20">
                {product.discountBadge}
              </span>
            )}
            {product.isNew && !product.discountBadge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/10 backdrop-blur-md text-white border border-white/20">
                New
              </span>
            )}
          </div>

          {/* Wishlist Button (Top Right) */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-90',
              isWishlisted
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 opacity-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-black/60 opacity-80 sm:opacity-0 group-hover:opacity-100 sm:translate-y-1 group-hover:translate-y-0'
            )}
          >
            <motion.div
              animate={isWishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={cn(
                  'w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors duration-200',
                  isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-current'
                )}
              />
            </motion.div>
          </button>
        </div>

        {/* Product Details */}
        <div className="relative z-20 flex flex-col flex-grow p-5 sm:p-6 justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            {/* Category & Rating Row */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-accent/90">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-white/80 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-medium text-white">{product.rating}</span>
                <span className="text-white/40 text-[10px]">({product.reviewCount})</span>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-accent transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-white/40 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCartClick}
            className={cn(
              'relative w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]',
              isAdded
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-white/10 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]'
            )}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 font-semibold"
                >
                  <Check className="w-4 h-4 text-white" />
                  Added to Cart!
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
