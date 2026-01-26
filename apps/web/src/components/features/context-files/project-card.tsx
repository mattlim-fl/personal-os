'use client';

import { useState } from 'react';
import type { ProjectFile, ProjectStatus } from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectFile;
}

const statusStyles: Record<ProjectStatus, { badge: 'success' | 'info' | 'warning'; border: string }> = {
  Active: { badge: 'success', border: 'border-l-success-500' },
  Incoming: { badge: 'info', border: 'border-l-primary-500' },
  'Winding Down': { badge: 'warning', border: 'border-l-warning-500' },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const styles = statusStyles[project.status];

  return (
    <Card
      className={cn(
        'border-l-4 cursor-pointer transition-all hover:shadow-md',
        styles.border
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-surface-900 dark:text-surface-50 truncate">
                {project.name}
              </h3>
              <Badge variant={styles.badge} className="flex-shrink-0">
                {project.status}
              </Badge>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
              {project.overview || 'No description available'}
            </p>
          </div>
          <button
            className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 p-1"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
            <pre className="text-xs text-surface-600 dark:text-surface-400 whitespace-pre-wrap font-mono overflow-x-auto">
              {project.content}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
