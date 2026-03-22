'use client';

import { useState, useEffect, useCallback } from 'react';
import type { NewsletterItem } from '@personal-os/shared';
import { Badge, Select, Skeleton } from '@/components/ui';
import { EmptyState } from '@/components/shared';
import { NewsletterCard } from './newsletter-card';

export function NewsletterList() {
  const [items, setItems] = useState<NewsletterItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (sourceFilter) params.set('source', sourceFilter);
      if (tagFilter) params.set('tag', tagFilter);
      params.set('limit', '100');

      const res = await fetch(`/api/newsletters?${params}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Failed to fetch newsletters');

      setItems(json.data);
      setCount(json.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load newsletters');
    } finally {
      setLoading(false);
    }
  }, [sourceFilter, tagFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const sources = [...new Set(items.map((i) => i.source))].sort();
  const allTags = [...new Set(items.flatMap((i) => i.tags))].sort();

  // Group by digest_date
  const grouped = items.reduce<Record<string, NewsletterItem[]>>((acc, item) => {
    const key = item.digest_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="w-48">
          <Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button key={tag} type="button" onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}>
                <Badge variant={tagFilter === tag ? 'primary' : 'default'} size="sm">
                  {tag}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No newsletters yet" compact />
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-3">
                {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
              <div className="space-y-3">
                {grouped[date].map((item) => (
                  <NewsletterCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && count > 0 && (
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-4">
          Showing {items.length} of {count} items
        </p>
      )}
    </div>
  );
}
