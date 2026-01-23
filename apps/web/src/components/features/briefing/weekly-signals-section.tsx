'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWeekStart, type SignalWithEntry } from '@personal-os/shared';
import { Card, CardContent, Button } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';

export function WeeklySignalsSection() {
  const [signals, setSignals] = useState<SignalWithEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignals = useCallback(async () => {
    try {
      const response = await fetch('/api/goals/briefing');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch signals');
      }

      setSignals(data.data.signals || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load signals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const updateCount = async (signal: SignalWithEntry, delta: number) => {
    const currentCount = signal.entry?.current_count || 0;
    const newCount = Math.max(0, Math.min(currentCount + delta, signal.target_count));
    if (newCount === currentCount) return;

    // Optimistic update
    setSignals((prev) =>
      prev.map((s) =>
        s.id === signal.id
          ? { ...s, entry: { ...s.entry, current_count: newCount, signal_id: s.id, week_start: getWeekStart(), id: s.entry?.id || '', created_at: s.entry?.created_at || '', updated_at: '' } }
          : s
      )
    );

    try {
      await fetch('/api/goals/signals/entries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signal_id: signal.id,
          week_start: getWeekStart(),
          current_count: newCount,
        }),
      });
    } catch {
      // Revert
      setSignals((prev) =>
        prev.map((s) =>
          s.id === signal.id
            ? { ...s, entry: signal.entry }
            : s
        )
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Goal Signals</h2>
          <LoadingState message="Loading signals..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Goal Signals</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Goal Signals</h2>

        {signals.length === 0 ? (
          <EmptyState
            title="No signals configured"
            description="Add signals in Settings to track weekly habits"
            compact
          />
        ) : (
          <div className="space-y-3">
            {signals.map((signal) => {
              const current = signal.entry?.current_count || 0;
              const target = signal.target_count;
              const isComplete = current >= target;

              return (
                <div key={signal.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isComplete ? 'text-success-600 dark:text-success-400' : 'text-surface-900 dark:text-surface-50'}`}>
                        {signal.title}
                      </span>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {current}/{target} {signal.unit}
                      </span>
                    </div>
                    {/* Progress dots */}
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: target }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < current
                              ? 'bg-primary-500'
                              : 'bg-surface-200 dark:bg-surface-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCount(signal, -1)}
                      disabled={current <= 0}
                      className="w-7 h-7 p-0"
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCount(signal, 1)}
                      disabled={current >= target}
                      className="w-7 h-7 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
