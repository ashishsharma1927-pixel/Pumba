import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, User, ShieldCheck, Package, ExternalLink } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const accountRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }

  // Click outside to close desktop account menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountMenuOpen]);

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileMenuOpen(false);
      setMobileSearchQuery('');
    } else {
      navigate('/shop');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 backdrop-blur-xl">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-extrabold tracking-tighter text-white flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              aria-label="PUMBA Home"
            >
              <span>PUMBA</span>
              <span className="text-accent group-hover:scale-125 transition-transform inline-block">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            <Link
              to="/shop"
              className={`text-sm transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded ${
                location.pathname === '/shop' ? 'text-white font-semibold' : 'text-foreground/80 hover:text-white'
              }`}
            >
              Shop
              {location.pathname === '/shop' && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                />
              )}
            </Link>
            <Link
              to="/shop"
              className="text-sm text-foreground/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Collections
            </Link>
            <Link
              to="/"
              className="text-sm text-foreground/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Featured
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/shop"
              aria-label="Search all products"
              className="p-2 text-foreground/80 hover:text-white transition-colors rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${totalWishlist} items`}
              className="p-2 text-foreground/80 hover:text-white transition-colors rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent relative"
            >
              <Heart className="w-5 h-5" />
              {totalWishlist > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalWishlist}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label={`Shopping cart, ${totalItems} items`}
              className="p-2 text-foreground/80 hover:text-white transition-colors rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 ? (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent/60 rounded-full"></span>
              )}
            </Link>

            {/* Desktop Account Dropdown */}
            <div className="relative hidden md:block" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-expanded={accountMenuOpen}
                aria-label="User Account Menu"
                className="p-2 text-foreground/80 hover:text-white transition-colors rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center gap-1"
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {accountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-72 rounded-2xl bg-[#111116] border border-white/10 shadow-2xl backdrop-blur-xl p-4 z-50 text-left"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-mono font-bold">
                        PM
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Vanguard Member</p>
                        <p className="text-xs text-white/50">vanguard@pumba.io</p>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      <div className="px-3 py-2 text-xs font-mono text-white/60 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Tier 01 Active
                        </span>
                        <span className="text-accent font-bold">VIP</span>
                      </div>
                      <Link
                        to="/shop"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-white/60" /> Order History
                        </span>
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">3 Items</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-white/60" /> Saved Gear
                        </span>
                        <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-mono">{totalWishlist}</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                      <Link
                        to="/checkout"
                        onClick={() => setAccountMenuOpen(false)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        Quick Checkout
                      </Link>
                      <button
                        type="button"
                        onClick={() => setAccountMenuOpen(false)}
                        className="text-accent hover:underline text-xs"
                      >
                        Settings
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="px-2"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Animated Slide-in Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl px-4 py-6 shadow-2xl"
            >
              {/* Search in Drawer */}
              <form onSubmit={handleMobileSearchSubmit} className="mb-5 relative">
                <input
                  type="search"
                  placeholder="Search products, collections..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-accent"
                />
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1.5 mb-6">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>Shop Hardware</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/5 text-sm font-medium flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Saved Wishlist</span>
                  </span>
                  {totalWishlist > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono font-bold">
                      {totalWishlist}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/5 text-sm font-medium flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-accent" />
                    <span>Shopping Cart</span>
                  </span>
                  {totalItems > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-mono font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>

              {/* Account Quick Card inside Drawer */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xs font-mono font-bold">
                    PM
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Vanguard Member</p>
                    <p className="text-[11px] text-white/50">Tier 01 // VIP Status</p>
                  </div>
                </div>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Explore Drop
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

