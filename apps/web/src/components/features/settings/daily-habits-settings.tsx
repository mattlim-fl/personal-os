'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DailyHabit } from '@personal-os/shared';
import { Button } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';

export function DailyHabitsSettings() {
  const [habits, setHabits] = useState<DailyHabit[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    try {
      const response = await fetch('/api/goals/habits?active=false');
      const data = await response.json();
      if (response.ok) {
        setHabits(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = async () => {
    if (!newTitle.trim()) return;

    const response = await fetch('/api/goals/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        sort_order: habits.length,
      }),
    });

    if (response.ok) {
      setNewTitle('');
      fetchHabits();
    }
  };

  const toggleActive = async (habit: DailyHabit) => {
    await fetch(`/api/goals/habits/${habit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !habit.active }),
    });
    setHabits((prev) =>
      prev.map((h) => (h.id === habit.id ? { ...h, active: !h.active } : h))
    );
  };

  const deleteHabit = async (id: string) => {
    await fetch(`/api/goals/habits/${id}`, { method: 'DELETE' });
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  if (loading) {
    return <div className="text-sm text-surface-500">Loading habits...</div>;
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <div key={habit.id} className="flex items-center gap-2">
          <button
            onClick={() => toggleActive(habit)}
            className={`w-4 h-4 rounded border flex-shrink-0 ${
              habit.active
                ? 'bg-primary-500 border-primary-500'
                : 'border-surface-300 dark:border-surface-600'
            }`}
          />
          <span className={`flex-1 text-sm ${habit.active ? 'text-surface-900 dark:text-surface-50' : 'text-surface-400 line-through'}`}>
            {habit.title}
          </span>
          <button
            onClick={() => deleteHabit(habit.id)}
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
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          placeholder="Add a habit..."
          className="flex-1 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-surface-900 dark:text-surface-50 placeholder:text-surface-400 outline-none focus:border-primary-500"
        />
        <Button variant="outline" size="sm" onClick={addHabit} disabled={!newTitle.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
