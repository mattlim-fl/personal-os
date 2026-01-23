import { cn } from '@/lib/utils';
import { Button, Alert } from '@/components/ui';

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('py-8', className)}>
      <Alert variant="error" title={title}>
        <p>{message}</p>
        {retry && (
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            className="mt-3"
          >
            Try again
          </Button>
        )}
      </Alert>
    </div>
  );
}
