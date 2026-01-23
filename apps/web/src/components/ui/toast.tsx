'use client';

import * as React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, AlertTriangle, XCircle, X } from 'lucide-react';

// Types
export interface Toast {
  id: string;
  title?: string;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

// Context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Hook
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration (default 5s)
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string, title?: string) => {
      addToast({ message, title, variant: 'success' });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      addToast({ message, title, variant: 'error', duration: 8000 }); // Longer for errors
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, title?: string) => {
      addToast({ message, title, variant: 'warning' });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      addToast({ message, title, variant: 'info' });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

// Toast Container
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Toast Item
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const variants = {
    success: {
      container:
        'bg-white dark:bg-surface-900 border-l-4 border-l-success shadow-lg',
      icon: 'text-success',
      title: 'text-surface-900 dark:text-surface-50',
      message: 'text-surface-600 dark:text-surface-400',
    },
    error: {
      container:
        'bg-white dark:bg-surface-900 border-l-4 border-l-error shadow-lg',
      icon: 'text-error',
      title: 'text-surface-900 dark:text-surface-50',
      message: 'text-surface-600 dark:text-surface-400',
    },
    warning: {
      container:
        'bg-white dark:bg-surface-900 border-l-4 border-l-warning shadow-lg',
      icon: 'text-warning',
      title: 'text-surface-900 dark:text-surface-50',
      message: 'text-surface-600 dark:text-surface-400',
    },
    info: {
      container:
        'bg-white dark:bg-surface-900 border-l-4 border-l-primary-500 shadow-lg',
      icon: 'text-primary-500',
      title: 'text-surface-900 dark:text-surface-50',
      message: 'text-surface-600 dark:text-surface-400',
    },
  };

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: AlertCircle,
  };

  const styles = variants[toast.variant];
  const Icon = icons[toast.variant];

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-lg border border-surface-200 dark:border-surface-700 p-4 animate-slide-up',
        styles.container
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.icon)} />
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={cn('text-sm font-semibold', styles.title)}>
              {toast.title}
            </p>
          )}
          <p className={cn('text-sm', styles.message, toast.title && 'mt-0.5')}>
            {toast.message}
          </p>
        </div>
        <button
          type="button"
          className="flex-shrink-0 p-1 rounded-md text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          onClick={() => onDismiss(toast.id)}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { ToastContext };
