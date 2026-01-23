import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode | {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
  className?: string;
}

export function EmptyState({ title, description, icon, action, compact, className }: EmptyStateProps) {
  const isActionObject = action && typeof action === 'object' && 'label' in action && 'onClick' in action;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      compact ? 'py-6' : 'py-12',
      className
    )}>
      {icon && <div className={cn('text-surface-400 dark:text-surface-500', compact ? 'mb-2' : 'mb-4')}>{icon}</div>}
      {!icon && !compact && (
        <svg
          className="h-12 w-12 text-surface-400 dark:text-surface-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      <h3 className={cn('font-medium text-surface-900 dark:text-surface-50 mb-1', compact ? 'text-base' : 'text-lg')}>{title}</h3>
      {description && <p className={cn('text-sm text-surface-500 dark:text-surface-400 max-w-sm', action ? 'mb-4' : '')}>{description}</p>}
      {isActionObject ? (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : action}
    </div>
  );
}
