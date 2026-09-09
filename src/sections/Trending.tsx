import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ProductCard } from '../components/ProductCard';
import { TRENDING_PRODUCTS } from '../data/products';
import type { Product } from '../types/product';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const Trending: React.FC = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    setNotification(`Added "${product.name}" to cart`);
    setTimeout(() => {
      setNotification((current) => (current?.includes(product.name) ? null : current));
    }, 2500);
  };

  const handleToggleWishlist = (product: Product, isWishlisted: boolean) => {
    setNotification(
      isWishlisted
        ? `Added "${product.name}" to wishlist`
        : `Removed "${product.name}" from wishlist`
    );
    setTimeout(() => {
      setNotification((current) => (current?.includes(product.name) ? null : current));
    }, 2500);
  };

  return (
    <Section id="trending" className="relative z-10 bg-background py-24 sm:py-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 -left-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/3 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold tracking-widest text-accent uppercase">
              Curated Selection
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-white"
          >
            Trending Now
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl"
          >
            Curated products worth experiencing.
          </motion.p>
        </div>

        {/* Responsive Products Grid:
            Desktop: 4 cards per row (lg:grid-cols-4)
            Tablet: 2 cards per row (sm:grid-cols-2)
            Mobile: 1 card per row (grid-cols-1)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TRENDING_PRODUCTS.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={0.08 * (index % 4)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>

        {/* "View All Products →" Button below the grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-16 sm:mt-20"
        >
          <Button
            size="lg"
            variant="secondary"
            withArrow
            className="px-8 sm:px-10 py-6 text-base font-semibold border-white/15 hover:border-white/40 hover:bg-white/10 shadow-lg hover:shadow-xl transition-all"
            onClick={() => {
              navigate('/shop');
            }}
          >
            View All Products
          </Button>
        </motion.div>
      </Container>

      {/* Floating Interactive Toast Feedback */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#16161a]/90 text-white border border-accent/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl pointer-events-none"
          >
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="text-sm font-medium">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
