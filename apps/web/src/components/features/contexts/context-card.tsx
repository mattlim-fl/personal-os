'use client';

import Link from 'next/link';
import { Context } from '@personal-os/shared';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ContextCardProps {
  context: Context;
  onActivate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ContextCard({ context, onActivate, onDelete }: ContextCardProps) {
  return (
    <Card className={cn('hover:shadow-card-hover transition-shadow', context.active && 'ring-2 ring-primary-500')}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/contexts/${context.slug}`}
                className="text-lg font-semibold hover:text-primary-600"
              >
                {context.slug}
              </Link>
              {context.active && <Badge variant="success">Active</Badge>}
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">{context.role}</p>
          </div>
        </div>

        <p className="text-sm text-surface-700 dark:text-surface-300 mb-3 line-clamp-2">{context.objective}</p>

        {context.constraints && (
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 italic">
            Constraints: {context.constraints}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
          <span>Updated {new Date(context.updated_at).toLocaleDateString()}</span>
          <div className="flex gap-2">
            {!context.active && onActivate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onActivate(context.id)}
              >
                Activate
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(context.id)}
                className="text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 hover:bg-error-50 dark:hover:bg-error-950/50"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
