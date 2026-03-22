'use client';

import type { NewsletterItem } from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';

interface NewsletterCardProps {
  item: NewsletterItem;
}

export function NewsletterCard({ item }: NewsletterCardProps) {
  const publishedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info" size="sm">
                {item.source}
              </Badge>
              {publishedDate && (
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  {publishedDate}
                </span>
              )}
            </div>

            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-surface-900 dark:text-surface-50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.title}
              </a>
            ) : (
              <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                {item.title}
              </p>
            )}

            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-3">
              {item.summary}
            </p>

            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
