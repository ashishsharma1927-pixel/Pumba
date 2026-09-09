import React from 'react';
import { Sparkles } from 'lucide-react';

interface ThreeFallbackProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export const ThreeFallback: React.FC<ThreeFallbackProps> = ({
  title = 'Interactive 3D Preview',
  subtitle = 'WebGL hardware acceleration required for 3D view',
  image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
}) => {
  return (
    <div className="relative w-full h-full min-h-[350px] rounded-3xl overflow-hidden bg-[#121217] border border-white/10 flex items-center justify-center p-6 text-center">
      {/* Fallback Image with ambient gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-[#0d0d12]/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent mb-4 shadow-lg">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
        <p className="text-xs text-white/60 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('WebGL / Three.js scene error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ThreeFallback />;
    }
    return this.props.children;
  }
}
