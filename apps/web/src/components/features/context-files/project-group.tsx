'use client';

import type { ProjectFile, ProjectStatus } from '@personal-os/shared';
import { Badge } from '@/components/ui';
import { ProjectCard } from './project-card';

interface ProjectGroupProps {
  status: ProjectStatus;
  projects: ProjectFile[];
}

const statusBadgeVariant: Record<ProjectStatus, 'success' | 'info' | 'warning'> = {
  Active: 'success',
  Incoming: 'info',
  'Winding Down': 'warning',
};

export function ProjectGroup({ status, projects }: ProjectGroupProps) {
  if (projects.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">
          {status}
        </h3>
        <Badge variant={statusBadgeVariant[status]} className="text-xs">
          {projects.length}
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
