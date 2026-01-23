import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
  size?: 'sm' | 'md';
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', dot, children, ...props }, ref) => {
    const variants = {
      default:
        'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 ring-1 ring-inset ring-surface-200 dark:ring-surface-700',
      success:
        'bg-success-50 dark:bg-success-700/20 text-success-700 dark:text-success-200 ring-1 ring-inset ring-success-600/20 dark:ring-success-600/30',
      warning:
        'bg-warning-50 dark:bg-warning-700/20 text-warning-700 dark:text-warning-200 ring-1 ring-inset ring-warning-600/20 dark:ring-warning-600/30',
      error:
        'bg-error-50 dark:bg-error-700/20 text-error-700 dark:text-error-200 ring-1 ring-inset ring-error-600/20 dark:ring-error-600/30',
      info:
        'bg-primary-50 dark:bg-primary-700/20 text-primary-700 dark:text-primary-200 ring-1 ring-inset ring-primary-600/20 dark:ring-primary-600/30',
      primary:
        'bg-primary-500 text-white ring-0',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    const dotColors = {
      default: 'bg-surface-400',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      info: 'bg-primary-500',
      primary: 'bg-white',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full mr-1.5',
              dotColors[variant]
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
