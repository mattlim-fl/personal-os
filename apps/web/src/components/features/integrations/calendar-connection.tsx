'use client';

import { useState, useEffect } from 'react';
import type { CalendarConnectionStatus } from '@personal-os/shared';
import { Card, CardContent, Button, Badge, Alert } from '@/components/ui';
import { LoadingState } from '@/components/shared';

export function CalendarConnection() {
  const [status, setStatus] = useState<CalendarConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/calendar/status');
      const data = await response.json();
      setStatus(data.data);
    } catch (err) {
      console.error('Error fetching Calendar status:', err);
      setError('Failed to load Calendar status');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/calendar/auth');
      const data = await response.json();
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch (err) {
      console.error('Error initiating Calendar auth:', err);
      setError('Failed to connect to Calendar');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar?')) {
      return;
    }

    try {
      await fetch('/api/calendar/status', { method: 'DELETE' });
      setStatus({ connected: false });
    } catch (err) {
      console.error('Error disconnecting Calendar:', err);
      setError('Failed to disconnect Calendar');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Google Calendar</h2>
          <LoadingState message="Loading connection status..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Google Calendar</h2>

        {error && (
          <Alert variant="error" className="mb-4" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {status?.connected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <Badge variant="success">Connected</Badge>
            </div>

            {status.email && (
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <span className="font-medium">Account:</span> {status.email}
              </p>
            )}

            {status.calendars && status.calendars.length > 0 && (
              <div className="text-sm text-surface-600 dark:text-surface-400">
                <span className="font-medium">Calendars:</span>
                <ul className="mt-1 ml-4 list-disc">
                  {status.calendars.slice(0, 5).map((cal) => (
                    <li key={cal.id}>
                      {cal.summary}
                      {cal.primary && (
                        <span className="text-xs text-surface-400 dark:text-surface-500 ml-1">(Primary)</span>
                      )}
                    </li>
                  ))}
                  {status.calendars.length > 5 && (
                    <li className="text-surface-400 dark:text-surface-500">
                      +{status.calendars.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="text-error-600 dark:text-error-400 border-error-600 dark:border-error-400 hover:bg-error-50 dark:hover:bg-error-950/50"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-surface-400 dark:bg-surface-500 rounded-full" />
              <Badge variant="default">Not connected</Badge>
            </div>

            <p className="text-sm text-surface-600 dark:text-surface-400">
              Connect your Google Calendar to see today&apos;s schedule in your Morning Briefing.
            </p>

            <Button variant="primary" onClick={handleConnect}>
              Connect Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
