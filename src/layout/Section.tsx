import React from 'react';
import { cn } from '../utils/cn';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  id?: string;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, id, ...props }, ref) => {
    return (
      <section
        id={id}
        ref={ref}
        className={cn('py-16 md:py-24', className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
