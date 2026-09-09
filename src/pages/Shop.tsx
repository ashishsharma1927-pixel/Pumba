import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '../ui/Container';
import { ProductCard } from '../components/ProductCard';
import { ALL_PRODUCTS } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  RotateCcw,
  PackageOpen,
  ArrowUpDown,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { cn } from '../utils/cn';

type CategoryType = 'All' | 'Tech' | 'Fashion' | 'Accessories' | 'Gaming' | 'Lifestyle';
type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

const CATEGORIES: CategoryType[] = ['All', 'Tech', 'Fashion', 'Accessories', 'Gaming', 'Lifestyle'];

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');

  // Filter states
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(
    urlCategory && CATEGORIES.includes(urlCategory as CategoryType) ? (urlCategory as CategoryType) : 'All'
  );

  useEffect(() => {
    document.title = 'Shop All Hardware & Gear | PUMBA';
    return () => {
      document.title = 'PUMBA — Next-Generation 3D E-Commerce & Hardware Architecture';
    };
  }, []);

  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);
  if (prevUrlCategory !== urlCategory) {
    setPrevUrlCategory(urlCategory);
    if (urlCategory && CATEGORIES.includes(urlCategory as CategoryType)) {
      setSelectedCategory(urlCategory as CategoryType);
    }
  }

  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch);
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
  }
  const [maxPrice, setMaxPrice] = useState<number>(700);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // UI responsive states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isTabletFilterOpen, setIsTabletFilterOpen] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(9);

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ALL_PRODUCTS.length };
    ALL_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Price
      if (product.price > maxPrice) {
        return false;
      }

      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // In stock
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // On sale
      if (onSaleOnly && !product.discountBadge && !product.originalPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [searchQuery, selectedCategory, maxPrice, minRating, inStockOnly, onSaleOnly, sortBy]);

  // Active filters count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (maxPrice < 700) count++;
    if (minRating > 0) count++;
    if (inStockOnly) count++;
    if (onSaleOnly) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, maxPrice, minRating, inStockOnly, onSaleOnly, searchQuery]);

  const resetFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(700);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('featured');
    setVisibleCount(9);
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Filter content component reusable in desktop sidebar and mobile drawer
  const FilterSidebarContent = (
    <div className="flex flex-col gap-7 text-sm">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-3">
          Category
        </h4>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(9);
                }}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200',
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    'text-[11px] px-2 py-0.5 rounded-full font-mono',
                    isSelected ? 'bg-black/15 text-black' : 'bg-white/5 text-white/40'
                  )}
                >
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-5 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold tracking-wider text-white/50 uppercase">
            Max Price
          </h4>
          <span className="font-mono font-semibold text-accent text-sm">
            ${maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="40"
          max="700"
          step="10"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setVisibleCount(9);
          }}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex items-center justify-between text-[11px] text-white/40 font-mono mt-2">
          <span>$40</span>
          <span>$700</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-5 border-t border-white/10">
        <h4 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-3">
          Minimum Rating
        </h4>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'All Ratings', value: 0 },
            { label: '4.8 & Above', value: 4.8 },
            { label: '4.5 & Above', value: 4.5 },
            { label: '4.0 & Above', value: 4.0 },
          ].map((ratingOption) => {
            const isSelected = minRating === ratingOption.value;
            return (
              <button
                key={ratingOption.value}
                type="button"
                onClick={() => {
                  setMinRating(ratingOption.value);
                  setVisibleCount(9);
                }}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all',
                  isSelected
                    ? 'bg-accent/20 border border-accent/40 text-accent font-medium'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-2">
                  {ratingOption.value > 0 && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  )}
                  <span>{ratingOption.label}</span>
                </div>
                {ratingOption.value > 0 && (
                  <span className="text-xs text-white/40 font-mono">
                    ★ {ratingOption.value}+
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Toggles (In Stock / On Sale) */}
      <div className="pt-5 border-t border-white/10 flex flex-col gap-3">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-white/80 group-hover:text-white transition-colors">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent accent-accent cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-white/80 group-hover:text-white transition-colors">
            On Sale / Discounted
          </span>
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => setOnSaleOnly(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent accent-accent cursor-pointer"
          />
        </label>
      </div>

      {/* Reset Filter Button */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold tracking-wider uppercase border border-white/10 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-8 sm:pt-12">
      <Container>
        {/* Page Header */}
        <div className="flex flex-col items-start justify-between gap-4 mb-10 pb-8 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-accent">Shop</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                Catalog 2026
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
                All Products
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm sm:text-base">
                Discover future-grade hardware, modular apparel, and innovative accessories engineered
                without compromise.
              </p>
            </div>

            <span className="text-xs sm:text-sm font-mono text-white/50">
              Showing <span className="text-white font-bold">{filteredProducts.length}</span> items
            </span>
          </div>
        </div>

        {/* Search, Sort, and Mobile Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          {/* Search Box */}
          <div className="relative flex-grow max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search products by name, category, or spec..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(9);
              }}
              className="w-full h-11 sm:h-12 pl-11 pr-10 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Sorting Dropdown & Filter Toggles */}
          <div className="flex items-center gap-3">
            {/* Tablet Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsTabletFilterOpen(!isTabletFilterOpen)}
              className="hidden sm:flex lg:hidden items-center gap-2 h-11 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="sm:hidden flex items-center justify-center gap-2 h-11 px-4 rounded-2xl bg-white/[0.05] border border-white/10 text-sm font-medium text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-accent" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="relative flex-grow sm:flex-grow-0 min-w-[170px]">
              <div className="relative flex items-center">
                <ArrowUpDown className="absolute left-3.5 w-3.5 h-3.5 text-white/40 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full h-11 sm:h-12 pl-9 pr-9 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-xs sm:text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                >
                  <option value="featured" className="bg-[#121214] text-white">
                    Featured
                  </option>
                  <option value="price-low" className="bg-[#121214] text-white">
                    Price: Low to High
                  </option>
                  <option value="price-high" className="bg-[#121214] text-white">
                    Price: High to Low
                  </option>
                  <option value="rating" className="bg-[#121214] text-white">
                    Top Rated
                  </option>
                  <option value="newest" className="bg-[#121214] text-white">
                    Newest
                  </option>
                </select>
                <ChevronDown className="absolute right-3.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Filter Panel for Tablet */}
        <AnimatePresence>
          {isTabletFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="hidden sm:block lg:hidden overflow-hidden mb-8 p-6 rounded-3xl bg-[#121216] border border-white/10 shadow-2xl"
            >
              {FilterSidebarContent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Layout: Desktop Sidebar + Product Grid */}
        <div className="flex items-start gap-8 lg:gap-10">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28 p-6 rounded-3xl bg-[#111115]/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-accent" />
                <span className="font-semibold text-white tracking-tight">Filters</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-accent hover:underline"
                >
                  Reset ({activeFilterCount})
                </button>
              )}
            </div>
            {FilterSidebarContent}
          </aside>

          {/* Products Grid Area */}
          <div className="flex-grow w-full">
            {filteredProducts.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center p-12 sm:p-20 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 min-h-[400px]"
              >
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-white/40">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                  No products found
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                  We couldn't find any products matching your active search and filter criteria. Try
                  loosening your filters or searching for something else.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 shadow-lg hover:shadow-white/20 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              /* Product Grid */
              <div>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7"
                >
                  <AnimatePresence>
                    {displayedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, delay: 0.04 * (index % 6) }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More Button */}
                {visibleCount < filteredProducts.length && (
                  <div className="flex flex-col items-center justify-center gap-3 mt-16 pt-8 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-sm border border-white/10 hover:border-white shadow-lg hover:shadow-white/20 transition-all active:scale-95"
                    >
                      Load More Products ({filteredProducts.length - visibleCount} remaining)
                    </button>
                    <span className="text-xs text-white/40 font-mono">
                      Showing {displayedProducts.length} of {filteredProducts.length} products
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Filters Drawer / Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Slide-up Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#141418] border-t border-white/15 p-6 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold text-white">Filters & Criteria</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-full text-white/50 hover:text-white bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="pb-6">{FilterSidebarContent}</div>

              {/* Drawer Actions */}
              <div className="sticky bottom-0 pt-4 pb-2 bg-[#141418] border-t border-white/10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-medium text-sm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-[2] py-3 rounded-2xl bg-white text-black font-semibold text-sm shadow-lg shadow-white/10"
                >
                  Apply ({filteredProducts.length} Results)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
