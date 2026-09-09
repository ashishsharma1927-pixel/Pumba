import { createContext } from 'react';

export interface ToastItem {
  id: string;
  type?: 'success' | 'info' | 'error';
  title: string;
  message?: string;
  image?: string;
}

export interface ToastContextType {
  toasts: ToastItem[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error', image?: string) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
