'use client';

import type { GitHubPR, GitHubIssue } from '@personal-os/shared';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { GitPullRequest, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface ProjectCardProps {
  name: string;
  prsNeedingReview: GitHubPR[];
  prsWaiting: GitHubPR[];
  issues: GitHubIssue[];
}

function PRItem({ pr, type }: { pr: GitHubPR; type: 'review' | 'waiting' }) {
  return (
    <a
      href={pr.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
    >
      <GitPullRequest className={`w-4 h-4 mt-0.5 flex-shrink-0 ${type === 'review' ? 'text-warning-500' : 'text-primary-500'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
          {pr.title}
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          #{pr.number} by {pr.author}
        </p>
      </div>
    </a>
  );
}

function IssueItem({ issue }: { issue: GitHubIssue }) {
  return (
    <a
      href={issue.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
    >
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-error-500" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
          {issue.title}
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          #{issue.number}
        </p>
      </div>
    </a>
  );
}

export function ProjectCard({ name, prsNeedingReview, prsWaiting, issues }: ProjectCardProps) {
  const totalItems = prsNeedingReview.length + prsWaiting.length + issues.length;

  if (totalItems === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{name}</CardTitle>
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              All clear
            </Badge>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="info">{totalItems} items</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {prsNeedingReview.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-warning-600 dark:text-warning-400 mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Needs your review ({prsNeedingReview.length})
            </h4>
            <div className="space-y-1">
              {prsNeedingReview.map((pr) => (
                <PRItem key={pr.url} pr={pr} type="review" />
              ))}
            </div>
          </div>
        )}

        {prsWaiting.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-1">
              <GitPullRequest className="w-4 h-4" />
              Waiting on others ({prsWaiting.length})
            </h4>
            <div className="space-y-1">
              {prsWaiting.map((pr) => (
                <PRItem key={pr.url} pr={pr} type="waiting" />
              ))}
            </div>
          </div>
        )}

        {issues.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-error-600 dark:text-error-400 mb-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Assigned issues ({issues.length})
            </h4>
            <div className="space-y-1">
              {issues.map((issue) => (
                <IssueItem key={issue.url} issue={issue} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
