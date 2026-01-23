'use client';

import { useState, useEffect } from 'react';
import type { GoalsBriefing, NotionGoal } from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';

function GoalRow({ goal }: { goal: NotionGoal }) {
  const statusConfig = {
    todo: { label: 'To Do', variant: 'default' as const },
    in_progress: { label: 'In Progress', variant: 'primary' as const },
    done: { label: 'Done', variant: 'success' as const },
  };

  const priorityConfig = {
    high: { label: 'High', className: 'text-error-600 dark:text-error-400' },
    medium: { label: 'Medium', className: 'text-warning-600 dark:text-warning-400' },
    low: { label: 'Low', className: 'text-surface-500 dark:text-surface-400' },
  };

  const isOverdue = goal.dueDate && new Date(goal.dueDate) < new Date() && goal.status !== 'done';

  return (
    <a
      href={goal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-surface-900 dark:text-surface-50 truncate">{goal.title}</span>
            {goal.priority && (
              <span className={`text-xs ${priorityConfig[goal.priority].className}`}>
                {priorityConfig[goal.priority].label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
            {goal.project && <span>{goal.project}</span>}
            {goal.dueDate && (
              <span className={isOverdue ? 'text-error-600 dark:text-error-400 font-medium' : ''}>
                {isOverdue ? 'Overdue: ' : 'Due: '}
                {new Date(goal.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <Badge
          variant={statusConfig[goal.status].variant}
          size="sm"
        >
          {statusConfig[goal.status].label}
        </Badge>
      </div>
    </a>
  );
}

export function GoalsSection() {
  const [briefing, setBriefing] = useState<GoalsBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/notion/goals');
        const data = await response.json();

        if (response.status === 401) {
          setNotConfigured(true);
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch goals');
        }

        setBriefing(data.data);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError(err instanceof Error ? err.message : 'Failed to load goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Goals</h2>
          <LoadingState message="Loading goals from Notion..." />
        </CardContent>
      </Card>
    );
  }

  if (notConfigured) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Goals</h2>
          <EmptyState
            title="Notion not configured"
            description="Set NOTION_API_KEY and NOTION_DATABASE_ID to see your goals"
            compact
          />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Goals</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const goals = briefing?.goals || [];
  const hasOverdue = (briefing?.overdue?.length || 0) > 0;
  const hasDueToday = (briefing?.dueToday?.length || 0) > 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Current Goals</h2>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary-600">
                {briefing?.inProgressCount || 0}
              </div>
              <div className="text-surface-500 dark:text-surface-400">in progress</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-surface-900 dark:text-surface-50">
                {briefing?.todoCount || 0}
              </div>
              <div className="text-surface-500 dark:text-surface-400">to do</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-success-600 dark:text-success-400">
                {briefing?.doneCount || 0}
              </div>
              <div className="text-surface-500 dark:text-surface-400">done</div>
            </div>
          </div>
        </div>

        {/* Alerts for overdue and due today */}
        {(hasOverdue || hasDueToday) && (
          <div className="mb-4 space-y-2">
            {hasOverdue && (
              <div className="p-3 bg-error-light rounded-lg border border-error">
                <h3 className="text-sm font-semibold text-error-dark mb-1">
                  Overdue ({briefing?.overdue?.length})
                </h3>
                {briefing?.overdue?.slice(0, 3).map((goal) => (
                  <a
                    key={goal.id}
                    href={goal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-error-dark hover:underline"
                  >
                    • {goal.title}
                  </a>
                ))}
              </div>
            )}
            {hasDueToday && (
              <div className="p-3 bg-warning-light rounded-lg border border-warning">
                <h3 className="text-sm font-semibold text-warning-dark mb-1">
                  Due Today ({briefing?.dueToday?.length})
                </h3>
                {briefing?.dueToday?.map((goal) => (
                  <a
                    key={goal.id}
                    href={goal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-warning-dark hover:underline"
                  >
                    • {goal.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <EmptyState
            title="No active goals"
            description="Add goals to your Notion database to track them here"
            compact
          />
        ) : (
          <div className="space-y-1">
            {goals.slice(0, 10).map((goal) => (
              <GoalRow key={goal.id} goal={goal} />
            ))}
            {goals.length > 10 && (
              <p className="text-sm text-surface-500 dark:text-surface-400 text-center pt-2">
                +{goals.length - 10} more goals
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
