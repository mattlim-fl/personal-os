'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Context, UpdateContextInput } from '@personal-os/shared';
import { ContextForm } from '@/components/features/contexts';

export default function ContextDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [context, setContext] = useState<Context | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contexts?slug=${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch context');
        }

        if (!data.data || data.data.length === 0) {
          throw new Error('Context not found');
        }

        setContext(data.data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContext();
  }, [slug]);

  const handleUpdate = async (data: UpdateContextInput) => {
    if (!context) return;

    const response = await fetch(`/api/contexts/${context.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update context');
    }

    setContext(result.data);
    setIsEditing(false);
  };

  const handleActivate = async () => {
    if (!context) return;

    try {
      const response = await fetch(`/api/contexts/${context.id}/activate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to activate context');
      }

      const result = await response.json();
      setContext(result.data);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to activate context');
    }
  };

  const handleDelete = async () => {
    if (!context) return;
    if (!confirm('Are you sure you want to delete this context?')) return;

    try {
      const response = await fetch(`/api/contexts/${context.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete context');
      }

      router.push('/contexts');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete context');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-surface-600 dark:text-surface-400">Loading context...</p>
        </div>
      </div>
    );
  }

  if (error || !context) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="p-4 bg-error-50 dark:bg-error-950/30 border border-error-200 dark:border-error-800 rounded text-error-700 dark:text-error-300 mb-4">
            {error || 'Context not found'}
          </div>
          <Link href="/contexts" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            ← Back to Contexts
          </Link>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setIsEditing(false)}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
            >
              ← Cancel Editing
            </button>
          </div>

          <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-2">
            Edit Context
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mb-8">Update context details</p>

          <div className="bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-6">
            <ContextForm
              initialData={context}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              submitLabel="Update Context"
            />
          </div>
        </div>
      </div>
    );
  }

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

        <div className="bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50">
                  {context.slug}
                </h1>
                {context.active && (
                  <span className="px-2 py-1 text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-surface-600 dark:text-surface-400">{context.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-900 dark:text-surface-100"
              >
                Edit
              </button>
              {!context.active && (
                <button
                  onClick={handleActivate}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Activate
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                Objective
              </h2>
              <p className="text-surface-900 dark:text-surface-100">{context.objective}</p>
            </div>

            {context.constraints && (
              <div>
                <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Constraints
                </h2>
                <p className="text-surface-900 dark:text-surface-100">{context.constraints}</p>
              </div>
            )}

            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between text-sm text-surface-500 dark:text-surface-400">
                <span>
                  Created {new Date(context.created_at).toLocaleString()}
                </span>
                <span>
                  Updated {new Date(context.updated_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <button
                onClick={handleDelete}
                className="text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 text-sm font-medium"
              >
                Delete Context
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
