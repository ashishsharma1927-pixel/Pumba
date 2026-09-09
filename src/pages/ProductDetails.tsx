import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ProductCard } from '../components/ProductCard';
import { ProductViewer3D } from '../3d/ProductViewer3D';
import { getProductById, ALL_PRODUCTS } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  ShoppingCart,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Box,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../utils/cn';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Component state initialized from product data
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'photos' | '3d'>('photos');
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.[0]?.name || ''
  );
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product?.variants?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'warranty'>('specs');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Reset scroll, title, and view settings on route ID change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      document.title = `${product.name} | PUMBA Hardware`;
    }
    return () => {
      document.title = 'PUMBA — Next-Generation 3D E-Commerce & Hardware Architecture';
    };
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/40">
          <Box className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Product Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The product you are looking for does not exist or has been discontinued from our catalog.
        </p>
        <Link to="/shop">
          <Button size="lg" withArrow>
            Explore Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const gallery = product.gallery || [product.imageUrl];
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedVariant);
    setIsAdded(true);
    setFeedbackToast(`Added ${quantity}x "${product.name}" to cart`);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    setFeedbackToast(
      isWishlisted
        ? `Removed "${product.name}" from wishlist`
        : `Added "${product.name}" to wishlist`
    );
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-6 sm:pt-10">
      <Container>
        {/* Breadcrumb Navigation */}
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
          <span className="text-white/60">{product.category}</span>
          <span>/</span>
          <span className="text-accent truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Gallery & 3D Visualizer */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* View Mode Toggle (when 3D is available) */}
            {product.has3D && (
              <div className="inline-flex self-start items-center p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setViewMode('photos')}
                  className={cn(
                    'px-4 py-1.5 rounded-xl text-xs font-medium transition-all',
                    viewMode === 'photos'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-white/70 hover:text-white'
                  )}
                >
                  Studio Photos
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-all',
                    viewMode === '3d'
                      ? 'bg-accent text-white font-semibold shadow-md shadow-accent/30'
                      : 'text-white/70 hover:text-white'
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5 text-current" />
                  3D Interactive
                </button>
              </div>
            )}

            {/* Main Image or 3D Viewer */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-[#111115] border border-white/10 flex items-center justify-center shadow-2xl">
              {viewMode === '3d' && product.has3D ? (
                <ProductViewer3D />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full relative"
                  >
                    <img
                      src={gallery[selectedImageIndex]}
                      alt={`${product.name} view ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Status Badge */}
              {product.discountBadge && (
                <div className="absolute top-5 left-5 z-10">
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-accent text-white border border-accent/40 shadow-lg shadow-accent/20">
                    {product.discountBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {viewMode === 'photos' && gallery.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
                {gallery.map((imgUrl, idx) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={cn(
                        'relative aspect-square rounded-2xl overflow-hidden border transition-all duration-300 bg-[#121216]',
                        isSelected
                          ? 'border-accent shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-95 ring-2 ring-accent/50'
                          : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      )}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Trust and Guarantee Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md mt-2">
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <Truck className="w-5 h-5 text-accent" />
                <span className="text-xs font-semibold text-white">Free Express</span>
                <span className="text-[11px] text-muted-foreground">Worldwide 2-4 days</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <RotateCcw className="w-5 h-5 text-accent" />
                <span className="text-xs font-semibold text-white">30-Day Trial</span>
                <span className="text-[11px] text-muted-foreground">Risk-free return</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span className="text-xs font-semibold text-white">2-Year Warranty</span>
                <span className="text-[11px] text-muted-foreground">Comprehensive care</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-xs font-semibold text-white">Authentic</span>
                <span className="text-[11px] text-muted-foreground">Verified hardware</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details & Purchasing Flow */}
          <div className="lg:col-span-5 flex flex-col gap-7">
            {/* Category & Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                {product.category}
              </span>
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5',
                  product.inStock !== false
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    product.inStock !== false ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  )}
                />
                {product.inStock !== false ? 'In Stock • Ready to Dispatch' : 'Backorder'}
              </span>
            </div>

            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-amber-400/20 text-amber-400/20'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">{product.rating}</span>
                <span className="text-sm text-white/40">
                  ({product.reviewCount} verified reviews)
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-4 py-4 border-y border-white/10">
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-white/40 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30">
                    Save ${product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Available Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-white">Select Finish</span>
                  <span className="text-accent font-medium">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          'group relative w-10 h-10 rounded-full flex items-center justify-center p-0.5 transition-all duration-300',
                          isSelected
                            ? 'ring-2 ring-accent ring-offset-2 ring-offset-background scale-110'
                            : 'hover:scale-105'
                        )}
                        title={color.name}
                      >
                        <span
                          className="w-full h-full rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-xs sm:text-sm font-semibold text-white">Edition / Variant</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant === variant;
                    return (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          'px-3.5 py-2.5 rounded-2xl text-xs font-medium border text-center transition-all duration-200',
                          isSelected
                            ? 'bg-white text-black font-semibold border-white shadow-md'
                            : 'bg-white/5 border-white/10 text-white/75 hover:border-white/25 hover:text-white'
                        )}
                      >
                        {variant}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center justify-between h-12 px-3 rounded-2xl bg-white/5 border border-white/10 w-32">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-1.5 rounded-lg text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-mono font-bold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="p-1.5 rounded-lg text-white/60 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={cn(
                    'h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95',
                    isWishlisted
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <motion.div
                    animate={isWishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-current'
                      )}
                    />
                  </motion.div>
                </button>
              </div>

              {/* Add to Cart & Buy Now Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={cn(
                    'h-14 rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 overflow-hidden shadow-lg active:scale-[0.98]',
                    isAdded
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : 'bg-white/10 hover:bg-white text-white hover:text-black border border-white/15 hover:border-white'
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="inline-flex items-center gap-2"
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
                        className="inline-flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <Button
                  size="lg"
                  variant="primary"
                  withArrow
                  className="h-14 font-semibold text-sm sm:text-base shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
                  onClick={handleAddToCart}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Specifications & Shipping Accordions / Tabs */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex border-b border-white/10 mb-4">
                {(['specs', 'shipping', 'warranty'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all relative',
                      activeTab === tab
                        ? 'text-white'
                        : 'text-white/40 hover:text-white/75'
                    )}
                  >
                    {tab === 'specs'
                      ? 'Specifications'
                      : tab === 'shipping'
                      ? 'Shipping & Returns'
                      : 'Warranty'}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="text-xs sm:text-sm text-white/80 leading-relaxed min-h-[140px]">
                {activeTab === 'specs' && product.specs && (
                  <div className="grid grid-cols-1 divide-y divide-white/5">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between">
                        <span className="text-white/50">{spec.label}</span>
                        <span className="font-medium text-white text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="flex flex-col gap-3 py-2 text-white/70">
                    <p>
                      All PUMBA orders are shipped from our automated fulfillment facilities via
                      carbon-neutral courier with trackable signature service.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-white/80">
                      <li>Express Delivery: 2-4 business days worldwide.</li>
                      <li>Complimentary insurance and real-time GPS tracking included.</li>
                      <li>30-day hassle-free return window with complimentary return shipping label.</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'warranty' && (
                  <div className="flex flex-col gap-3 py-2 text-white/70">
                    <p>
                      Every PUMBA hardware product includes our comprehensive 2-Year International
                      Warranty against all defects in manufacturing and assembly.
                    </p>
                    <p>
                      In the unlikely event of hardware failure, our concierge support team arranges
                      immediate advanced unit replacement prior to return collection.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <section className="mt-28 pt-16 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-2 block">
                Verified Feedback
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Customer Reviews
              </h2>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-3xl font-bold text-white font-mono">{product.rating}</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-white/50 mt-0.5">
                  Based on {product.reviewCount} customer reviews
                </span>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.reviews &&
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-3xl bg-[#111115] border border-white/10 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-3.5 h-3.5',
                              i < Math.floor(rev.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-white/20'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-white/40 font-mono">{rev.date}</span>
                    </div>

                    <h4 className="font-semibold text-white text-base">{rev.title}</h4>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                    <span className="font-medium text-white">{rev.author}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <section className="mt-28 pt-16 border-t border-white/10">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-2 block">
                  Complete the Setup
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Related Products
                </h2>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Interactive Toast Notification Feedback */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#16161c]/90 backdrop-blur-2xl border border-accent/40 shadow-2xl text-white pointer-events-none"
          >
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="text-sm font-medium">{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
