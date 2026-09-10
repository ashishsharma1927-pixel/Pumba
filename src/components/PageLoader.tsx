import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
    >
      <div className="relative flex items-center justify-center mb-6">
        {/* Pulsing glow ring */}
        <div className="w-16 h-16 rounded-full bg-accent/20 animate-ping absolute" />
        <div className="w-14 h-14 rounded-2xl bg-[#121217] border border-white/15 flex items-center justify-center relative z-10 shadow-2xl">
          <span className="text-xl font-black tracking-tighter text-white">
            P<span className="text-accent">.</span>
          </span>
        </div>
      </div>

      {/* Progress bar line */}
      <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="w-full h-full bg-accent rounded-full animate-pulse" />
      </div>

      <p className="text-xs font-mono tracking-widest text-white/50 uppercase">
        Loading...
      </p>
      <span className="sr-only">Loading page content, please wait...</span>
    </div>
  );
};
