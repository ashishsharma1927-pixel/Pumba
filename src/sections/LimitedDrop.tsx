import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { Clock, Flame } from 'lucide-react';

export const LimitedDrop: React.FC = () => {
  return (
    <Section className="relative z-10 py-20 sm:py-28 overflow-hidden bg-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl sm:rounded-[36px] overflow-hidden border border-white/15 bg-gradient-to-br from-[#181822] via-[#101015] to-[#0a0a0e] shadow-2xl p-8 sm:p-14 lg:p-20"
        >
          {/* Animated Background Ambience */}
          <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />

          {/* Grid lines overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  LIMITED DROP
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-white/5 border border-white/10 text-white/70">
                  <Clock className="w-3 h-3 text-accent" />
                  BATCH #04 • 500 UNITS ONLY
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6 leading-[1.08]">
                Technology,<br />
                <span className="text-gradient">Redesigned.</span>
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
                Engineered in strictly limited production runs. Featuring bespoke hand-finished
                aerospace magnesium alloy, sapphire crystal capacitive touch matrices, and custom
                acoustics.
              </p>

              {/* CTA & Stock status */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 w-full sm:w-auto">
                <Link to="/shop">
                  <Button
                    size="lg"
                    variant="primary"
                    withArrow
                    className="w-full sm:w-auto px-9 py-6 text-base font-semibold shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)]"
                  >
                    Explore Drop
                  </Button>
                </Link>

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-mono text-white/80">
                    <span className="font-bold text-white">418</span> / 500 Claimed
                  </span>
                </div>
              </div>
            </div>

            {/* Right Visual Element */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative w-full aspect-square max-w-[380px] sm:max-w-[420px] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-tr from-white/5 to-white/[0.02] shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop"
                  alt="Limited Edition Drop Hardware"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating HUD Tag on Image */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-accent uppercase block">
                      ARCHIVAL SPEC
                    </span>
                    <span className="text-sm font-bold text-white">
                      Obsidian Prime // Batch 04
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white">
                    $449
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};
