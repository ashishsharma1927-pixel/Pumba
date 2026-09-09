import React, { useEffect, useState, useRef } from 'react';
import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { motion, useInView } from 'framer-motion';
import { Users, Package, Star, Headset, type LucideIcon } from 'lucide-react';

interface StatItem {
  id: string;
  icon: LucideIcon;
  target: number;
  suffix: string;
  prefix?: string;
  decimal?: boolean;
  label: string;
  description: string;
}

const STATS: StatItem[] = [
  {
    id: 'customers',
    icon: Users,
    target: 50,
    suffix: 'K+',
    label: 'Happy Customers',
    description: 'Enthusiasts across 42 countries enjoying next-gen hardware.',
  },
  {
    id: 'products',
    icon: Package,
    target: 120,
    suffix: '+',
    label: 'Products',
    description: 'Precision engineered devices, wearables, and accessories.',
  },
  {
    id: 'rating',
    icon: Star,
    target: 4.9,
    suffix: '/5',
    decimal: true,
    label: 'Average Rating',
    description: 'Verified reviews praising build quality and acoustic clarity.',
  },
  {
    id: 'support',
    icon: Headset,
    target: 24,
    suffix: '/7',
    label: 'Support',
    description: 'Dedicated concierge team and white-glove warranty assistance.',
  },
];

const AnimatedCounter: React.FC<{ item: StatItem; inView: boolean }> = ({ item, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = item.target;
    const duration = 1800; // ms
    const incrementTime = 25;
    const steps = duration / incrementTime;
    const stepIncrement = end / steps;

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [inView, item.target]);

  const displayValue = item.decimal
    ? count.toFixed(1)
    : Math.floor(count).toString();

  return (
    <span>
      {item.prefix || ''}
      {displayValue}
      {item.suffix}
    </span>
  );
};

export const Stats: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <Section className="relative z-10 py-20 sm:py-28 bg-[#09090c] border-y border-white/5">
      <Container>
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
                className="group relative p-6 sm:p-8 rounded-3xl bg-[#111116]/80 border border-white/10 hover:border-accent/40 backdrop-blur-xl transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Subtle Hover Glow */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-accent/0 group-hover:bg-accent/[0.03] transition-colors duration-500" />

                <div>
                  {/* Top Icon Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:border-accent/30 transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Animated Big Stat Number */}
                  <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2 font-mono">
                    <AnimatedCounter item={stat} inView={inView} />
                  </div>

                  {/* Label */}
                  <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight mb-2">
                    {stat.label}
                  </h3>
                </div>

                {/* Subtitle Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
