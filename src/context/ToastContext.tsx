import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext, type ToastItem } from './toastContextDef';
import { cn } from '../utils/cn';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      title: string,
      message?: string,
      type: 'success' | 'info' | 'error' = 'success',
      image?: string
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastItem = { id, title, message, type, image };

      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 on screen

      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}

      {/* Floating Animated Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#141418]/95 backdrop-blur-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white relative overflow-hidden',
                toast.type === 'error'
                  ? 'border-red-500/30 shadow-red-500/10'
                  : toast.type === 'info'
                  ? 'border-sky-500/30 shadow-sky-500/10'
                  : 'border-accent/30 shadow-accent/10'
              )}
            >
              {/* Product image thumbnail if provided */}
              {toast.image ? (
                <img
                  src={toast.image}
                  alt=""
                  className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
              ) : (
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border',
                    toast.type === 'error'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : toast.type === 'info'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      : 'bg-accent/10 text-accent border-accent/20'
                  )}
                >
                  {toast.type === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : toast.type === 'info' ? (
                    <Info className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
              )}

              {/* Message */}
              <div className="flex-grow min-w-0 pr-4">
                <h4 className="text-sm font-semibold text-white tracking-tight leading-tight">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-xs text-white/60 mt-0.5 leading-snug line-clamp-2">
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-white/40 hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Subtle accent line on top */}
              <div
                className={cn(
                  'absolute top-0 left-0 right-0 h-[2px]',
                  toast.type === 'error'
                    ? 'bg-red-500'
                    : toast.type === 'info'
                    ? 'bg-sky-500'
                    : 'bg-accent'
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
