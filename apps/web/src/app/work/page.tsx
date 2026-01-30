'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import type {
  GitHubActivityBriefing,
  GitHubPR,
  GitHubIssue,
} from '@personal-os/shared';
import { PageHeader } from '@/components/layout';
import { LoadingState } from '@/components/shared';
import { Button, Select } from '@/components/ui';
import { ProjectCard } from '@/components/features/work';
import projectsConfig from '@config/github-projects.json';

interface ProjectWorkItems {
  name: string;
  repos: string[];
  prsNeedingReview: GitHubPR[];
  prsWaiting: GitHubPR[];
  issues: GitHubIssue[];
}

function groupItemsByProject(briefing: GitHubActivityBriefing): ProjectWorkItems[] {
  const projects = projectsConfig.projects;

  return projects.map((project) => {
    const repoNames = project.repos.map((r) => `${r.owner}/${r.repo}`);

    const prsAwaitingYourReview = briefing.needsAttention.prsAwaitingYourReview || [];
    const yourPRsAwaitingReview = briefing.needsAttention.yourPRsAwaitingReview || [];
    const yourIssues = briefing.needsAttention.yourIssues || [];

    const prsNeedingReview = prsAwaitingYourReview.filter((pr) =>
      repoNames.includes(pr.repo)
    );

    const prsWaiting = yourPRsAwaitingReview.filter((pr) =>
      repoNames.includes(pr.repo)
    );

    const issues = yourIssues.filter((issue) =>
      repoNames.includes(issue.repo)
    );

    return {
      name: project.name,
      repos: repoNames,
      prsNeedingReview,
      prsWaiting,
      issues,
    };
  });
}

export default function WorkPage() {
  const [briefing, setBriefing] = useState<GitHubActivityBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const projectNames = projectsConfig.projects.map((p) => p.name);

  const fetchActivity = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch('/api/github/activity');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch GitHub activity');
      }

      setBriefing(data.data);
    } catch (err) {
      console.error('Error fetching GitHub activity:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load GitHub activity'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const handleRefresh = () => {
    fetchActivity(true);
  };

  // Apply search and filter (must be before conditional returns to follow hooks rules)
  const filteredProjects = useMemo(() => {
    if (!briefing) return [];

    const projectItems = groupItemsByProject(briefing);
    const searchLower = searchQuery.toLowerCase().trim();

    return projectItems
      .filter((p) => {
        // Filter by project
        if (projectFilter !== 'all' && p.name !== projectFilter) {
          return false;
        }
        return true;
      })
      .map((p) => {
        // If no search, return as-is
        if (!searchLower) {
          return p;
        }

        // Filter items by search query
        return {
          ...p,
          prsNeedingReview: p.prsNeedingReview.filter((pr) =>
            pr.title.toLowerCase().includes(searchLower)
          ),
          prsWaiting: p.prsWaiting.filter((pr) =>
            pr.title.toLowerCase().includes(searchLower)
          ),
          issues: p.issues.filter((issue) =>
            issue.title.toLowerCase().includes(searchLower)
          ),
        };
      })
      .filter(
        (p) =>
          p.prsNeedingReview.length > 0 ||
          p.prsWaiting.length > 0 ||
          p.issues.length > 0
      );
  }, [briefing, searchQuery, projectFilter]);

  const totalItems = filteredProjects.reduce(
    (sum, p) =>
      sum + p.prsNeedingReview.length + p.prsWaiting.length + p.issues.length,
    0
  );

  if (loading) {
    return (
      <>
        <PageHeader title="Work" />
        <div className="container mx-auto px-4 py-6">
          <LoadingState message="Loading GitHub activity..." />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Work" />
        <div className="container mx-auto px-4 py-6">
          <div className="text-error-600 dark:text-error-400">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Work"
        description={
          totalItems > 0
            ? `${totalItems} item${totalItems !== 1 ? 's' : ''} need attention`
            : undefined
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 pl-10 pr-4 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="h-10 w-full sm:w-48"
          >
            <option value="all">All Projects</option>
            {projectNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">{searchQuery || projectFilter !== 'all' ? '🔍' : '✨'}</div>
            <h2 className="text-lg font-medium text-surface-900 dark:text-surface-50 mb-2">
              {searchQuery || projectFilter !== 'all' ? 'No matches' : 'All clear'}
            </h2>
            <p className="text-surface-500 dark:text-surface-400">
              {searchQuery || projectFilter !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'No PRs or issues need your attention right now.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.name}
                name={project.name}
                prsNeedingReview={project.prsNeedingReview}
                prsWaiting={project.prsWaiting}
                issues={project.issues}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
