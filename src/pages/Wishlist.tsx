import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
} from 'lucide-react';
import type { Product } from '../types/product';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'My Wishlist | PUMBA';
    return () => {
      document.title = 'PUMBA — Next-Generation 3D E-Commerce & Hardware Architecture';
    };
  }, []);

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    showToast('Moved to Cart', `${product.name} is now in your shopping bag`, 'success', product.imageUrl);
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
          <span className="text-accent">Wishlist</span>
        </nav>

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              Saved Artifacts
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              My Wishlist
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-2">
              Keep track of products you want to acquire or reserve for upcoming drops.
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-rose-400 transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All ({wishlist.length})
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-12 sm:p-20 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 text-rose-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mb-8 leading-relaxed">
              Explore our collection and click the heart icon on any product to save it to your personal
              curation.
            </p>
            <Link to="/shop">
              <Button size="lg" withArrow>
                Explore Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7"
          >
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col rounded-3xl bg-[#121216] border border-white/10 overflow-hidden shadow-xl group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Remove Button (Top Right) */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/60 hover:text-rose-400 hover:border-rose-500/40 flex items-center justify-center transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Category / Discount Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      {product.discountBadge ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase bg-accent text-white border border-accent/40 shadow-lg">
                          {product.discountBadge}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">{product.category}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-white">{product.rating}</span>
                        </div>
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        className="text-base font-bold text-white hover:text-accent transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-bold text-white">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-white/40 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Move to Cart Action */}
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(product)}
                      className="w-full h-11 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/10 hover:border-white transition-all duration-300 shadow-md active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Move to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
    </div>
  );
};
