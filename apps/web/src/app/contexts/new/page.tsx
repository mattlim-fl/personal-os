'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreateContextInput } from '@personal-os/shared';
import { ContextForm } from '@/components/features/contexts';

export default function NewContextPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateContextInput) => {
    const response = await fetch('/api/contexts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create context');
    }

    // Redirect to contexts list
    router.push('/contexts');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/contexts"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
          >
            ← Back to Contexts
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-2">
          Create New Context
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Define a new organizational context for your work
        </p>

        <div className="bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-6">
          <ContextForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/contexts')}
            submitLabel="Create Context"
          />
        </div>
      </div>
    </div>
  );
}
