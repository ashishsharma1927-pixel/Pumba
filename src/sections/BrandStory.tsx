import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Cpu, Compass } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const PILLARS = [
    {
      icon: Cpu,
      title: 'Zero Compromise Materials',
      description: 'Forged from aerospace-grade titanium, bionic beryllium, and solid-state graphene.',
    },
    {
      icon: Layers,
      title: 'Sensory Immersion',
      description: 'We believe digital shopping should offer the same tactile depth as touching physical hardware.',
    },
    {
      icon: Compass,
      title: 'Circular Stewardship',
      description: '100% carbon-neutral fulfillment and recycled rare-earth magnetic cores.',
    },
  ];

  return (
    <Section className="relative z-10 py-24 sm:py-32 overflow-hidden bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Primary Visual Showcase */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#111116] aspect-[4/3] sm:aspect-[1/1] max-w-lg mx-auto">
              <img
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop"
                alt="PUMBA Hardware Architecture"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Engineering Badge */}
              <div className="absolute top-6 left-6 p-3 sm:p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[10px] font-mono text-accent uppercase block">
                  PRECISION TOLERANCE
                </span>
                <span className="text-sm sm:text-base font-bold text-white">
                  ±0.005mm CNC Precision
                </span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-5 rounded-2xl bg-[#141418]/90 backdrop-blur-xl border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-white/50 block">ESTABLISHED 2026</span>
                  <span className="text-sm font-semibold text-white">Next Generation Artifacts</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -bottom-10 -left-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* Text Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Tag */}
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">
                The PUMBA Philosophy
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6 leading-tight">
              More Than <span className="text-gradient">Shopping.</span>
            </h2>

            {/* Narrative Paragraph */}
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              We started PUMBA because standard e-commerce felt flat, disposable, and disconnected.
              We believe purchasing a tool should feel like stepping into an art gallery: immersive,
              tactile, and undeniably intentional.
            </p>

            {/* Pillars */}
            <div className="grid grid-cols-1 gap-5 mb-10 w-full">
              {PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{pillar.title}</h3>
                      <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link to="/shop">
              <Button size="lg" withArrow>
                Explore the Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};
