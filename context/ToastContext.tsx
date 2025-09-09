import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { ToastMessage } from '../types';

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

let toastId = 0;

/**
 * Provides a global context for managing and displaying toast notifications.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = toastId++;
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};