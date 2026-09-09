import React from 'react';
import { cn } from '../utils/cn';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', withArrow = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "group relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-out select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.97] hover:-translate-y-0.5",
          {
            'bg-white text-black hover:bg-white/95 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]': variant === 'primary',
            'bg-white/10 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md border border-white/10': variant === 'secondary',
            'border border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/40': variant === 'outline',
            'bg-transparent text-white hover:bg-white/10': variant === 'ghost',
            'h-9 px-4 text-xs sm:text-sm': size === 'sm',
            'h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base': size === 'md',
            'h-13 sm:h-14 px-8 sm:px-10 text-base sm:text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
          {withArrow && (
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
