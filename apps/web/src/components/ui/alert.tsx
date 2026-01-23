import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, onDismiss, ...props }, ref) => {
    const variants = {
      info: {
        container:
          'bg-primary-50/80 dark:bg-primary-950/50 border-l-4 border-l-primary-500 border-y border-r border-primary-100 dark:border-primary-900',
        iconBg: 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400',
        title: 'text-primary-900 dark:text-primary-100',
        content: 'text-primary-800 dark:text-primary-200',
      },
      success: {
        container:
          'bg-success-50/80 dark:bg-success-950/50 border-l-4 border-l-success border-y border-r border-success-100 dark:border-success-900',
        iconBg: 'bg-success-100 dark:bg-success-900/50 text-success-600 dark:text-success-400',
        title: 'text-success-900 dark:text-success-100',
        content: 'text-success-800 dark:text-success-200',
      },
      warning: {
        container:
          'bg-warning-50/80 dark:bg-warning-950/50 border-l-4 border-l-warning border-y border-r border-warning-100 dark:border-warning-900',
        iconBg: 'bg-warning-100 dark:bg-warning-900/50 text-warning-600 dark:text-warning-400',
        title: 'text-warning-900 dark:text-warning-100',
        content: 'text-warning-800 dark:text-warning-200',
      },
      error: {
        container:
          'bg-error-50/80 dark:bg-error-950/50 border-l-4 border-l-error border-y border-r border-error-100 dark:border-error-900',
        iconBg: 'bg-error-100 dark:bg-error-900/50 text-error-600 dark:text-error-400',
        title: 'text-error-900 dark:text-error-100',
        content: 'text-error-800 dark:text-error-200',
      },
    };

    const icons = {
      info: AlertCircle,
      success: CheckCircle2,
      warning: AlertTriangle,
      error: XCircle,
    };

    const styles = variants[variant];
    const Icon = icons[variant];

    return (
      <div
        ref={ref}
        className={cn('rounded-lg p-4', styles.container, className)}
        role="alert"
        {...props}
      >
        <div className="flex">
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              styles.iconBg
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <h3 className={cn('text-sm font-semibold', styles.title)}>{title}</h3>
            )}
            {children && (
              <div className={cn('text-sm', styles.content, title && 'mt-1')}>
                {children}
              </div>
            )}
          </div>
          {onDismiss && (
            <div className="ml-auto pl-3">
              <button
                type="button"
                className={cn(
                  'inline-flex rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  styles.iconBg,
                  'hover:bg-white/50 dark:hover:bg-black/20'
                )}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
