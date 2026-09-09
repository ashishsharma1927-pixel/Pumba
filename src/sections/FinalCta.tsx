import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const FinalCta: React.FC = () => {
  return (
    <Section className="relative z-10 py-28 sm:py-36 bg-gradient-to-b from-background via-[#0c0c10] to-[#08080a] overflow-hidden border-t border-white/5">
      {/* Dynamic Ambient Background Illumination */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-accent/10 rounded-full blur-[160px]" />

      <Container>
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-semibold uppercase tracking-widest backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            The Future of Commerce
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.08]"
          >
            Ready to experience<br />
            <span className="text-gradient">shopping differently?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            Step beyond ordinary storefronts. Explore precision engineered hardware and immersive 3D
            interactions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <Link to="/shop" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="primary"
                withArrow
                className="w-full sm:w-auto px-10 py-6 text-base font-semibold shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.45)]"
              >
                Explore the Collection
              </Button>
            </Link>

            <Link to="/cart" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold"
              >
                View Bag
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};
