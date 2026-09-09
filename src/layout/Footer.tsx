import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-background pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-white mb-4 block">
              PUMBA<span className="text-accent">.</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The future of spatial 3D e-commerce and precision hardware.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Hardware</Link></li>
              <li><Link to="/shop?category=Tech" className="hover:text-white transition-colors">Acoustic & Audio</Link></li>
              <li><Link to="/shop?category=Gaming" className="hover:text-white transition-colors">Workspace & Gaming</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Support & Guarantees</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/checkout" className="hover:text-white transition-colors">Carbon-Neutral Shipping</Link></li>
              <li><span className="text-white/60">30-Day Risk-Free Trial</span></li>
              <li><span className="text-white/60">2-Year Precision Warranty</span></li>
              <li><span className="text-white/60">24/7 Concierge Support</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">PUMBA Dispatch</h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input 
                type="email" 
                aria-label="Email address for dispatch"
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent w-full text-white"
              />
              <button 
                type="submit"
                className="bg-white text-black px-4 py-2 rounded-r-full text-sm font-medium hover:bg-white/90 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PUMBA Hardware Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Architecture</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
