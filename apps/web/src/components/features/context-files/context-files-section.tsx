'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ContextFilesResponse, ProjectStatus } from '@personal-os/shared';
import { LoadingState, EmptyState } from '@/components/shared';
import { ContextMetaCard } from './context-meta-card';
import { ProjectGroup } from './project-group';

export function ContextFilesSection() {
  const [data, setData] = useState<ContextFilesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContextFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/context-files');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch context files');
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load context files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContextFiles();
  }, [fetchContextFiles]);

  if (loading) {
    return <LoadingState message="Loading context files..." />;
  }

  if (error) {
    return (
      <div className="text-error-600 dark:text-error-400 text-sm p-4 bg-error-50 dark:bg-error-950 rounded-lg">
        {error}
      </div>
    );
  }

  if (!data) {
    return <EmptyState title="No context files found" description="Context files have not been configured yet." />;
  }

  // Group projects by status
  const projectsByStatus: Record<ProjectStatus, typeof data.projects> = {
    Active: data.projects.filter((p) => p.status === 'Active'),
    Incoming: data.projects.filter((p) => p.status === 'Incoming'),
    'Winding Down': data.projects.filter((p) => p.status === 'Winding Down'),
  };

  return (
    <div className="space-y-8">
      {/* Meta context cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <ContextMetaCard type="current-state" file={data.currentState} />
        <ContextMetaCard type="preferences" file={data.preferences} />
      </div>

      {/* Projects grouped by status */}
      <div className="space-y-6">
        <ProjectGroup status="Active" projects={projectsByStatus.Active} />
        <ProjectGroup status="Incoming" projects={projectsByStatus.Incoming} />
        <ProjectGroup status="Winding Down" projects={projectsByStatus['Winding Down']} />
      </div>
    </div>
  );
}
