'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWeekStart, type WeeklyGoal } from '@personal-os/shared';
import { Button } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';

export function WeeklyGoalsSettings() {
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const weekStart = getWeekStart();

  const fetchGoals = useCallback(async () => {
    try {
      const response = await fetch(`/api/goals/weekly?week_start=${weekStart}`);
      const data = await response.json();
      if (response.ok) {
        setGoals(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async () => {
    if (!newTitle.trim()) return;

    const response = await fetch('/api/goals/weekly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        week_start: weekStart,
        sort_order: goals.length,
      }),
    });

    if (response.ok) {
      setNewTitle('');
      fetchGoals();
    }
  };

  const deleteGoal = async (id: string) => {
    await fetch(`/api/goals/weekly/${id}`, { method: 'DELETE' });
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  if (loading) {
    return <div className="text-sm text-surface-500">Loading goals...</div>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        Week of {new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>

      {goals.map((goal) => (
        <div key={goal.id} className="flex items-center gap-2">
          <span className="flex-1 text-sm text-surface-900 dark:text-surface-50">{goal.title}</span>
          <button
            onClick={() => deleteGoal(goal.id)}
            className="text-surface-400 hover:text-error-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          placeholder="Add a goal..."
          className="flex-1 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-surface-900 dark:text-surface-50 placeholder:text-surface-400 outline-none focus:border-primary-500"
        />
        <Button variant="outline" size="sm" onClick={addGoal} disabled={!newTitle.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
