'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WeeklySignal } from '@personal-os/shared';
import { Button } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';

export function WeeklySignalsSettings() {
  const [signals, setSignals] = useState<WeeklySignal[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('3');
  const [newUnit, setNewUnit] = useState('sessions');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchSignals = useCallback(async () => {
    try {
      const response = await fetch('/api/goals/signals?active=false');
      const data = await response.json();
      if (response.ok) {
        setSignals(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const addSignal = async () => {
    if (!newTitle.trim() || !newTarget) return;

    const response = await fetch('/api/goals/signals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        target_count: parseInt(newTarget, 10),
        unit: newUnit.trim() || 'sessions',
        sort_order: signals.length,
      }),
    });

    if (response.ok) {
      setNewTitle('');
      setNewTarget('3');
      setNewUnit('sessions');
      setShowForm(false);
      fetchSignals();
    }
  };

  const toggleActive = async (signal: WeeklySignal) => {
    await fetch(`/api/goals/signals/${signal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !signal.active }),
    });
    setSignals((prev) =>
      prev.map((s) => (s.id === signal.id ? { ...s, active: !s.active } : s))
    );
  };

  const deleteSignal = async (id: string) => {
    await fetch(`/api/goals/signals/${id}`, { method: 'DELETE' });
    setSignals((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return <div className="text-sm text-surface-500">Loading signals...</div>;
  }

  return (
    <div className="space-y-3">
      {signals.map((signal) => (
        <div key={signal.id} className="flex items-center gap-2">
          <button
            onClick={() => toggleActive(signal)}
            className={`w-4 h-4 rounded border flex-shrink-0 ${
              signal.active
                ? 'bg-primary-500 border-primary-500'
                : 'border-surface-300 dark:border-surface-600'
            }`}
          />
          <span className={`flex-1 text-sm ${signal.active ? 'text-surface-900 dark:text-surface-50' : 'text-surface-400 line-through'}`}>
            {signal.title} ({signal.target_count} {signal.unit})
          </span>
          <button
            onClick={() => deleteSignal(signal.id)}
            className="text-surface-400 hover:text-error-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {showForm ? (
        <div className="space-y-2 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Signal name (e.g. Writing)"
            className="w-full text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-surface-900 dark:text-surface-50 placeholder:text-surface-400 outline-none focus:border-primary-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              min="1"
              placeholder="Target"
              className="w-20 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-surface-900 dark:text-surface-50 outline-none focus:border-primary-500"
            />
            <input
              type="text"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder="Unit (sessions)"
              className="flex-1 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 text-surface-900 dark:text-surface-50 placeholder:text-surface-400 outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={addSignal} disabled={!newTitle.trim()}>
              Add
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Signal
        </Button>
      )}
    </div>
  );
}
