import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  label?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'block w-full rounded-md border px-3 py-2 text-sm transition-colors',
            'text-surface-900 dark:text-surface-100',
            'placeholder:text-surface-400 dark:placeholder:text-surface-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-surface-900',
            'disabled:cursor-not-allowed disabled:bg-surface-100 disabled:text-surface-400 dark:disabled:bg-surface-800 dark:disabled:text-surface-500',
            'bg-white dark:bg-surface-800',
            'min-h-[80px] resize-y',
            error
              ? 'border-error-300 dark:border-error-600 focus:border-error focus:ring-error/20'
              : 'border-surface-300 dark:border-surface-600 focus:border-primary-500 focus:ring-primary-500/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn('mt-1 text-sm', error ? 'text-error-600 dark:text-error-400' : 'text-surface-500 dark:text-surface-400')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
