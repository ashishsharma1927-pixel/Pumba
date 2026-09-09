import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { MousePointer2, ChevronDown } from 'lucide-react';
import { HeroScene } from '../3d/HeroScene';
import { Categories } from '../sections/Categories';
import { ProductShowcase } from '../sections/ProductShowcase';
import { Trending } from '../sections/Trending';
import { LimitedDrop } from '../sections/LimitedDrop';
import { Stats } from '../sections/Stats';
import { BrandStory } from '../sections/BrandStory';
import { Testimonials } from '../sections/Testimonials';
import { Newsletter } from '../sections/Newsletter';
import { FinalCta } from '../sections/FinalCta';

export const Home = () => {
  return (
    <>
      <Section className="relative min-h-screen flex items-center pt-20 pb-0 overflow-hidden">
        <Container className="relative z-10 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full min-h-[calc(100vh-5rem)]">
            
            {/* Left Content Column */}
            <div className="flex flex-col items-start justify-center pt-10 lg:pt-0 order-2 lg:order-1 relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">Next Generation Commerce</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[1.08] mb-6 break-words"
              >
                Experience<br />
                <span className="text-gradient">Shopping</span><br />
                Differently.
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed"
              >
                PUMBA redefines digital storefronts with immersive 3D technology. 
                Interact, customize, and explore premium products like never before.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto" withArrow onClick={() => {
                  const el = document.getElementById('showcase');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Explore Flagship
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    const el = document.getElementById('trending');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Trending
                </Button>
              </motion.div>
            </div>
            
            {/* Right 3D Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-[50vh] sm:h-[60vh] lg:h-[80vh] w-full order-1 lg:order-2 relative"
            >
              <HeroScene />
              
              {/* Subtle floating interaction hint on mobile/tablet */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden flex items-center gap-2 text-xs text-muted-foreground bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                <MousePointer2 className="w-3 h-3" />
                Interact with object
              </div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hidden md:flex"
          >
            <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Categories Section */}
      <Categories />

      {/* Flagship Interactive 3D Product Showcase */}
      <ProductShowcase />

      {/* Trending Products Section */}
      <Trending />

      {/* 1. Limited Edition Banner */}
      <LimitedDrop />

      {/* 2. Numbers / Stats Section */}
      <Stats />

      {/* 3. Brand Story Section */}
      <BrandStory />

      {/* 4. Testimonials Section */}
      <Testimonials />

      {/* 5. Newsletter Section */}
      <Newsletter />

      {/* 6. Final CTA Section */}
      <FinalCta />
    </>
  );
};


