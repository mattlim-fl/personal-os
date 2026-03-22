'use client';

import { Newspaper } from 'lucide-react';
import { NewsletterList } from '@/components/features/newsletters';

export default function NewslettersPage() {
  return (
    <div className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950">
              <Newspaper className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
              Newsletters
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            AI-generated summaries from your newsletter subscriptions.
          </p>
        </div>

        {/* Newsletter List */}
        <NewsletterList />
      </div>
    </div>
  );
}
