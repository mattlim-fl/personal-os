'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NewsletterItem } from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';
import { LoadingState } from '@/components/shared';

export function NewsletterSection() {
  const [items, setItems] = useState<NewsletterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/newsletters?limit=5');
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || 'Failed to fetch newsletters');

        setItems(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load newsletters');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">Newsletters</h2>
          <LoadingState message="Loading..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">Newsletters</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Newsletters</h2>
            <span className="text-sm text-surface-500 dark:text-surface-400">No items yet</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Newsletters</h2>
          <Link
            href="/newsletters"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              <Badge variant="info" size="sm" className="mt-0.5 flex-shrink-0">
                {item.source}
              </Badge>
              <div className="min-w-0 flex-1">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-surface-900 dark:text-surface-50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate block"
                  >
                    {item.title}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-50 truncate">
                    {item.title}
                  </p>
                )}
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
