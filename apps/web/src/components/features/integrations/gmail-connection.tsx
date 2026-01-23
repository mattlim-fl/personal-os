'use client';

import { useState, useEffect } from 'react';
import type { GmailConnectionStatus } from '@personal-os/shared';
import { DEMO_USER_ID } from '@/lib/constants';
import { Card, CardContent, Button, Badge, Alert } from '@/components/ui';
import { LoadingState } from '@/components/shared';

export function GmailConnection() {
  const [status, setStatus] = useState<GmailConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/gmail/status');
      const data = await response.json();
      setStatus(data.data);
    } catch (err) {
      console.error('Error fetching Gmail status:', err);
      setError('Failed to load Gmail status');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await fetch('/api/gmail/auth');
      const data = await response.json();
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch (err) {
      console.error('Error initiating Gmail auth:', err);
      setError('Failed to connect to Gmail');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Gmail?')) {
      return;
    }

    try {
      await fetch('/api/gmail/status', { method: 'DELETE' });
      setStatus({ connected: false });
    } catch (err) {
      console.error('Error disconnecting Gmail:', err);
      setError('Failed to disconnect Gmail');
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setError(null);
    try {
      const userId = DEMO_USER_ID;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/gmail-sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: userId,
            full_sync: false,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        try {
          await fetch('/api/inbox/evaluate', { method: 'POST' });
        } catch (evalError) {
          console.error('Error auto-evaluating inbox:', evalError);
        }

        alert(`Sync complete: ${data.message}`);
        await fetchStatus();
      } else {
        throw new Error('Sync failed');
      }
    } catch (err) {
      console.error('Error syncing Gmail:', err);
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Gmail Connection</h2>
          <LoadingState message="Loading connection status..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Gmail Connection</h2>

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

            {status.last_synced_at && (
              <p className="text-sm text-surface-600 dark:text-surface-400">
                <span className="font-medium">Last synced:</span>{' '}
                {new Date(status.last_synced_at).toLocaleString()}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                onClick={handleSyncNow}
                loading={syncing}
              >
                Sync Now
              </Button>
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
              Connect your Gmail account to enable inbox triage and management.
            </p>

            <Button variant="primary" onClick={handleConnect}>
              Connect Gmail
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
