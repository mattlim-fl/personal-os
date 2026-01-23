'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Layers } from 'lucide-react';
import { Context } from '@personal-os/shared';
import { ContextCard } from '@/components/features/contexts';
import { Button, Alert, useToast } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';

export default function ContextsPage() {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchContexts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contexts');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contexts');
      }

      setContexts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContexts();
  }, []);

  const handleActivate = async (id: string) => {
    try {
      const response = await fetch(`/api/contexts/${id}/activate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to activate context');
      }

      toast.success('Context activated');
      await fetchContexts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to activate context');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this context?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contexts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete context');
      }

      toast.success('Context deleted');
      await fetchContexts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete context');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <LoadingState message="Loading contexts..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="error" title="Error loading contexts">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  const activeContext = contexts.find((c) => c.active);
  const inactiveContexts = contexts.filter((c) => !c.active);

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
              Contexts
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Manage your organizational contexts
            </p>
          </div>
          <Link href="/contexts/new">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              New Context
            </Button>
          </Link>
        </div>

        {contexts.length === 0 ? (
          <EmptyState
            icon={<Layers className="h-12 w-12 text-surface-400" />}
            title="No contexts yet"
            description="Create your first context to get started organizing your work."
            action={
              <Link href="/contexts/new">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Context
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-8">
            {activeContext && (
              <div>
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
                  Active Context
                </h2>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl opacity-20 blur" />
                  <div className="relative">
                    <ContextCard
                      context={activeContext}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              </div>
            )}

            {inactiveContexts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">
                  {activeContext ? 'Other Contexts' : 'All Contexts'}
                </h2>
                <div className="grid gap-4">
                  {inactiveContexts.map((context) => (
                    <ContextCard
                      key={context.id}
                      context={context}
                      onActivate={handleActivate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
