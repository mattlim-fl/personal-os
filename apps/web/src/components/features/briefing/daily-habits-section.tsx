'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWeekStart, getWeekDays, getToday, type HabitWithCompletions } from '@personal-os/shared';
import { Card, CardContent } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function DailyHabitsSection() {
  const [habits, setHabits] = useState<HabitWithCompletions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [today, setToday] = useState('');

  const fetchHabits = useCallback(async () => {
    try {
      const response = await fetch('/api/goals/briefing');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch habits');
      }

      setHabits(data.data.habits || []);
      setWeekDays(getWeekDays(getWeekStart()));
      setToday(getToday());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const toggleCompletion = async (habitId: string, date: string) => {
    // Optimistic update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const hasCompletion = h.completions.includes(date);
        return {
          ...h,
          completions: hasCompletion
            ? h.completions.filter((d) => d !== date)
            : [...h.completions, date],
        };
      })
    );

    try {
      await fetch('/api/goals/habits/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habit_id: habitId, completed_date: date }),
      });
    } catch {
      // Revert
      fetchHabits();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Habits</h2>
          <LoadingState message="Loading habits..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Habits</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Habits</h2>

        {habits.length === 0 ? (
          <EmptyState
            title="No habits configured"
            description="Add habits in Settings to track them here"
            compact
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 pr-3 text-surface-500 dark:text-surface-400 font-medium">
                    Habit
                  </th>
                  {DAY_LABELS.map((day, i) => (
                    <th
                      key={day}
                      className={`text-center py-2 px-1 font-medium ${
                        weekDays[i] === today
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-surface-500 dark:text-surface-400'
                      }`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => (
                  <tr key={habit.id} className="border-t border-surface-100 dark:border-surface-800">
                    <td className="py-2 pr-3 text-surface-900 dark:text-surface-50 font-medium truncate max-w-[140px]">
                      {habit.title}
                    </td>
                    {weekDays.map((date) => {
                      const isCompleted = habit.completions.includes(date);
                      const isToday = date === today;
                      const isFuture = date > today;

                      return (
                        <td key={date} className="text-center py-2 px-1">
                          <button
                            onClick={() => toggleCompletion(habit.id, date)}
                            disabled={isFuture}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                              isFuture
                                ? 'bg-surface-50 dark:bg-surface-900 cursor-not-allowed'
                                : isCompleted
                                  ? 'bg-success-500 text-white'
                                  : isToday
                                    ? 'bg-primary-50 dark:bg-primary-950 border border-primary-300 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-900'
                                    : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
                            }`}
                          >
                            {isCompleted && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
