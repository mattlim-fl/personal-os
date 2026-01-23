'use client';

import { useState, useEffect } from 'react';
import type { GitHubActivityBriefing, GitHubPR } from '@personal-os/shared';
import { Card, CardContent } from '@/components/ui';
import { LoadingState } from '@/components/shared';

function AttentionItem({ pr, label }: { pr: GitHubPR; label?: string }) {
  return (
    <a
      href={pr.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
    >
      <span className="text-surface-400 dark:text-surface-500 text-xs">#{pr.number}</span>
      <span className="text-sm text-surface-900 dark:text-surface-50 truncate flex-1">
        {pr.title}
      </span>
      <span className="text-xs text-surface-500 dark:text-surface-400 flex-shrink-0">
        {pr.repo} · {pr.daysOld}d
      </span>
      {label && (
        <span className="text-xs text-surface-400 dark:text-surface-500 flex-shrink-0">
          ({label})
        </span>
      )}
    </a>
  );
}

export function GitHubSection() {
  const [briefing, setBriefing] = useState<GitHubActivityBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/github/activity');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch GitHub activity');
        }

        setBriefing(data.data);

        if (data.message?.includes('No GitHub projects configured')) {
          setNotConfigured(true);
        }
      } catch (err) {
        console.error('Error fetching GitHub activity:', err);
        setError(err instanceof Error ? err.message : 'Failed to load GitHub activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  // Don't render at all if not configured
  if (notConfigured) return null;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">GitHub</h2>
          <LoadingState message="Loading..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-3">GitHub</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const needsAttention = briefing?.needsAttention;
  const prsAwaitingYourReview = needsAttention?.prsAwaitingYourReview || [];
  const yourPRsAwaitingReview = needsAttention?.yourPRsAwaitingReview || [];
  const stalePRs = (needsAttention?.stalePRs || []).filter(
    (pr) =>
      !prsAwaitingYourReview.some((p) => p.id === pr.id) &&
      !yourPRsAwaitingReview.some((p) => p.id === pr.id)
  );

  const hasItems = prsAwaitingYourReview.length > 0 || yourPRsAwaitingReview.length > 0 || stalePRs.length > 0;

  // Nothing needs attention — show a minimal "all clear" state
  if (!hasItems) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">GitHub</h2>
            <span className="text-sm text-success-600 dark:text-success-400">All clear</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="text-lg font-semibold mb-3">GitHub</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Needs Your Review */}
          {(prsAwaitingYourReview.length > 0 || stalePRs.length > 0) && (
            <div>
              <h3 className="text-xs font-medium text-error-600 dark:text-error-400 uppercase tracking-wide mb-2">
                Needs Your Review
              </h3>
              <div className="space-y-0.5">
                {prsAwaitingYourReview.map((pr) => (
                  <AttentionItem key={pr.id} pr={pr} />
                ))}
                {stalePRs.map((pr) => (
                  <AttentionItem key={pr.id} pr={pr} label="stale" />
                ))}
              </div>
            </div>
          )}

          {/* Waiting On Team */}
          {yourPRsAwaitingReview.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-warning-600 dark:text-warning-400 uppercase tracking-wide mb-2">
                Waiting On Team
              </h3>
              <div className="space-y-0.5">
                {yourPRsAwaitingReview.map((pr) => (
                  <AttentionItem key={pr.id} pr={pr} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
