import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ProductShowcaseScene } from '../3d/ProductShowcaseScene';
import { HOTSPOTS } from '../data/hotspots';
import type { HotspotData } from '../types/hotspot';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  Feather,
  BatteryCharging,
  X,
  ChevronRight,
  Sliders,
  ShieldCheck,
  MousePointer2,
} from 'lucide-react';
import { cn } from '../utils/cn';

export const ProductShowcase: React.FC = () => {
  const navigate = useNavigate();
  // Default to hotspot 1 for immediate visual engagement
  const [activeHotspotId, setActiveHotspotId] = useState<number>(1);
  const activeSpot: HotspotData =
    HOTSPOTS.find((h) => h.id === activeHotspotId) || HOTSPOTS[0];

  const getHotspotIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Volume2 className="w-4 h-4 text-accent" />;
      case 2:
        return <Feather className="w-4 h-4 text-sky-400" />;
      case 3:
        return <BatteryCharging className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sliders className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <Section
      id="showcase"
      className="relative z-10 bg-[#070709] py-28 sm:py-36 overflow-hidden border-t border-white/5"
    >
      {/* Cinematic Ambient Glow Gradients */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -top-32 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">
              Flagship Innovation
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-white"
          >
            Designed Beyond Ordinary
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl"
          >
            Every curve, surface, and component engineered for transcendent sensory immersion.
          </motion.p>

          {/* Interactive Hotspot Selector Pills (Mobile friendly tap targets + Desktop quick select) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-8 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl"
          >
            {HOTSPOTS.map((spot) => {
              const isSelected = activeHotspotId === spot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveHotspotId(spot.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    isSelected
                      ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono',
                      isSelected ? 'bg-black text-white' : 'bg-white/10 text-white/70'
                    )}
                  >
                    0{spot.id}
                  </span>
                  <span>{spot.title}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* 3D Showcase Presentation Stage */}
        <div className="relative w-full rounded-3xl border border-white/10 bg-gradient-to-b from-[#111116]/90 via-[#0d0d10]/95 to-[#070709] overflow-hidden shadow-2xl">
          {/* Subtle Cyberpunk/Studio Grid Lines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Floating UI HUD Labels (Technical Readouts) */}
          <div className="pointer-events-none absolute top-6 left-6 z-20 hidden md:flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-widest text-accent uppercase">
              // PUMBA ARCHITECTURE
            </span>
            <span className="text-sm font-bold text-white tracking-wider">
              PUMBA X1 • FLAGSHIP
            </span>
            <span className="text-[11px] font-mono text-white/40">
              COORDINATES [42.10.88] • CALIBRATED
            </span>
          </div>

          <div className="pointer-events-none absolute top-6 right-6 z-20 hidden md:flex flex-col items-end gap-1">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              SYSTEM ONLINE
            </span>
            <span className="text-xs font-mono text-white/60">
              MATERIALS: TITANIUM / GRAPHENE / BERYLLIUM
            </span>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-3 text-xs text-white/50 bg-black/40 px-3.5 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            <MousePointer2 className="w-3.5 h-3.5 text-accent animate-bounce" />
            <span>Click hotspots or drag to rotate 360°</span>
          </div>

          {/* Centerpiece 3D Canvas Scene */}
          <ProductShowcaseScene
            activeHotspot={activeHotspotId}
            onSelectHotspot={(id) => setActiveHotspotId(id)}
          />

          {/* Floating Glass Information Panel for the Active Hotspot */}
          <AnimatePresence mode="wait">
            {activeSpot && (
              <motion.div
                key={activeSpot.id}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:right-8 sm:left-auto sm:max-w-sm z-30 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121217]/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                      {getHotspotIcon(activeSpot.id)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-semibold tracking-wider text-accent uppercase">
                        {activeSpot.category}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {activeSpot.title}
                      </h4>
                    </div>
                  </div>

                  {/* Hotspot cycle navigation */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const nextId = (activeSpot.id % HOTSPOTS.length) + 1;
                        setActiveHotspotId(nextId);
                      }}
                      className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      title="Next feature"
                      aria-label="Next feature"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHotspotId(activeSpot.id)}
                      className="p-1 rounded-full text-white/40 hover:text-white/80 transition-colors"
                      title="Dismiss"
                      aria-label="Dismiss panel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle & Description */}
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed mb-4">
                  {activeSpot.description}
                </p>

                {/* Technical Metrics Badges */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                  {activeSpot.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col p-2 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <span className="text-[10px] text-white/50 tracking-wide uppercase">
                        {metric.label}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-tight mt-0.5">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  PUMBA X1 Acoustic Masterpiece
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white">
                  $349
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Complimentary global carbon-neutral shipping & 30-day risk-free home audition.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              size="lg"
              variant="primary"
              withArrow
              className="w-full sm:w-auto px-8 font-semibold shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
              onClick={() => {
                navigate('/product/nx-01');
              }}
            >
              Discover the Product
            </Button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};
