'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WeeklyGoal } from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';

const statusConfig = {
  todo: { label: 'To Do', variant: 'default' as const, next: 'in_progress' as const },
  in_progress: { label: 'In Progress', variant: 'primary' as const, next: 'done' as const },
  done: { label: 'Done', variant: 'success' as const, next: 'todo' as const },
};

export function WeeklyGoalsSection() {
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      const response = await fetch('/api/goals/briefing');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch goals');
      }

      setGoals(data.data.weeklyGoals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const cycleStatus = async (goal: WeeklyGoal) => {
    const newStatus = statusConfig[goal.status].next;

    // Optimistic update
    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? { ...g, status: newStatus } : g))
    );

    try {
      await fetch(`/api/goals/weekly/${goal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Revert on error
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, status: goal.status } : g))
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Goals</h2>
          <LoadingState message="Loading goals..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Goals</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const todoCount = goals.filter((g) => g.status === 'todo').length;
  const inProgressCount = goals.filter((g) => g.status === 'in_progress').length;
  const doneCount = goals.filter((g) => g.status === 'done').length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Weekly Goals</h2>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary-600">{inProgressCount}</div>
              <div className="text-surface-500 dark:text-surface-400">in progress</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-surface-900 dark:text-surface-50">{todoCount}</div>
              <div className="text-surface-500 dark:text-surface-400">to do</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-success-600 dark:text-success-400">{doneCount}</div>
              <div className="text-surface-500 dark:text-surface-400">done</div>
            </div>
          </div>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            title="No goals this week"
            description="Add goals in Settings to track them here"
            compact
          />
        ) : (
          <div className="space-y-1">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => cycleStatus(goal)}
                className="w-full text-left p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex-1 font-medium text-surface-900 dark:text-surface-50 truncate">
                    {goal.title}
                  </span>
                  <Badge variant={statusConfig[goal.status].variant} size="sm">
                    {statusConfig[goal.status].label}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
