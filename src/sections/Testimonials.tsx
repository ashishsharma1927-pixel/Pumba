import React, { useState } from 'react';
import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '../utils/cn';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  quote: string;
  product: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Julian Vance',
    role: 'Principal Industrial Designer',
    location: 'Berlin, DE',
    rating: 5,
    quote:
      'The PUMBA X1 is the first audio instrument that made me stop and marvel at the hinge tolerance. The titanium finish feels like a bespoke Swiss timepiece.',
    product: 'PUMBA X1 Flagship',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Dr. Amara Chen',
    role: 'Spatial Acoustics Engineer',
    location: 'Tokyo, JP',
    rating: 5,
    quote:
      'Subharmonic distortion is virtually undetectable. You hear room resonance and micro-dynamics that conventional commercial headphones completely smear.',
    product: 'Pulse Wireless Core',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: '3',
    name: "Liam O'Connor",
    role: 'Creative Director',
    location: 'New York, US',
    rating: 5,
    quote:
      'PUMBA proves that online shopping can feel like a gallery walkthrough. Inspecting the hardware in full 3D gave me total confidence before ordering.',
    product: 'Nova Mechanical Keyboard',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Soren Lindqvist',
    role: 'Architectural Lead',
    location: 'Stockholm, SE',
    rating: 5,
    quote:
      'Utterly minimalist without feeling sterile. The zero-plastic unboxing, tactile buttons, and carbon-neutral commitment make this a standard-bearer.',
    product: 'Vertex Modular Backpack',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
  },
];

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((current) => (current === 0 ? TESTIMONIALS.length - 1 : current - 1));
  };

  const next = () => {
    setActiveIndex((current) => (current === TESTIMONIALS.length - 1 ? 0 : current + 1));
  };

  return (
    <Section className="relative z-10 py-24 sm:py-32 bg-[#08080b] border-t border-white/5 overflow-hidden">
      <Container>
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-semibold uppercase tracking-wider">
              Verified Experience
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Voices of the Vanguard
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-xl">
              From audio engineers to industrial designers, explore how creators worldwide experience
              PUMBA hardware.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Testimonial Spotlight Carousel */}
        <div className="relative mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={TESTIMONIALS[activeIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#111116] border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <Quote className="absolute top-8 right-8 w-20 h-20 text-white/[0.03] pointer-events-none" />

              <div className="flex flex-col gap-6 max-w-3xl">
                {/* Rating Stars */}
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Big Quote */}
                <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-relaxed tracking-tight">
                  "{TESTIMONIALS[activeIndex].quote}"
                </blockquote>

                {/* Author Details */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <img
                    src={TESTIMONIALS[activeIndex].avatar}
                    alt={TESTIMONIALS[activeIndex].name}
                    loading="lazy"
                    className="w-14 h-14 rounded-2xl object-cover border border-white/15"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {TESTIMONIALS[activeIndex].name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {TESTIMONIALS[activeIndex].role} • {TESTIMONIALS[activeIndex].location}
                    </p>
                    <span className="text-[11px] font-mono text-accent mt-0.5 block">
                      Verified Owner: {TESTIMONIALS[activeIndex].product}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators / Mini Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {TESTIMONIALS.map((t, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3',
                  isSelected
                    ? 'bg-white/10 border-accent text-white shadow-lg'
                    : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:border-white/15'
                )}
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="w-9 h-9 rounded-xl object-cover flex-shrink-0 border border-white/10"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{t.name}</p>
                  <p className="text-[11px] text-white/40 truncate">{t.location}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
