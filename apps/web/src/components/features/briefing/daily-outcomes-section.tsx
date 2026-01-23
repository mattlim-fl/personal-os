'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getToday, type DailyOutcome } from '@personal-os/shared';
import { Card, CardContent } from '@/components/ui';
import { LoadingState } from '@/components/shared';

export function DailyOutcomesSection() {
  const [outcome, setOutcome] = useState<DailyOutcome | null>(null);
  const [lines, setLines] = useState<string[]>(['']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOutcome = useCallback(async () => {
    try {
      const response = await fetch(`/api/goals/outcomes?date=${getToday()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch outcomes');
      }

      setOutcome(data.data);
      if (data.data?.lines?.length > 0) {
        setLines([...data.data.lines, '']);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load outcomes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOutcome();
  }, [fetchOutcome]);

  const saveOutcomes = useCallback(async (linesToSave: string[]) => {
    const nonEmpty = linesToSave.filter((l) => l.trim().length > 0);
    if (nonEmpty.length === 0 && !outcome) return;

    setSaving(true);
    try {
      await fetch('/api/goals/outcomes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome_date: getToday(),
          lines: nonEmpty,
        }),
      });
    } catch {
      // Silent fail - will retry on next edit
    } finally {
      setSaving(false);
    }
  }, [outcome]);

  const debouncedSave = useCallback((newLines: string[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveOutcomes(newLines);
    }, 1000);
  }, [saveOutcomes]);

  const handleLineChange = (index: number, value: string) => {
    const newLines = [...lines];
    newLines[index] = value;

    // Add new empty line if typing in the last one
    if (index === lines.length - 1 && value.trim().length > 0) {
      newLines.push('');
    }

    // Remove trailing empty lines (keep at least one)
    while (newLines.length > 1 && newLines[newLines.length - 1] === '' && newLines[newLines.length - 2] === '') {
      newLines.pop();
    }

    setLines(newLines);
    debouncedSave(newLines);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && lines[index] === '' && lines.length > 1) {
      e.preventDefault();
      const newLines = lines.filter((_, i) => i !== index);
      setLines(newLines);
      debouncedSave(newLines);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Outcomes</h2>
          <LoadingState message="Loading outcomes..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Outcomes</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Today&apos;s Outcomes</h2>
          {saving && (
            <span className="text-xs text-surface-400">Saving...</span>
          )}
        </div>

        <div className="space-y-2">
          {lines.map((line, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-surface-400 dark:text-surface-500 text-sm w-5 text-right">
                {line.trim() ? `${index + 1}.` : ''}
              </span>
              <input
                type="text"
                value={line}
                onChange={(e) => handleLineChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder={index === 0 ? "What will you accomplish today?" : ""}
                className="flex-1 bg-transparent text-sm text-surface-900 dark:text-surface-50 placeholder:text-surface-400 dark:placeholder:text-surface-500 outline-none border-b border-transparent focus:border-surface-200 dark:focus:border-surface-700 py-1 transition-colors"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
