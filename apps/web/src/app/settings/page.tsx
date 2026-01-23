'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Calendar, Mail, Info, Layers, Inbox, Sun, Moon, Monitor } from 'lucide-react';
import { GmailConnection, CalendarConnection } from '@/components/features/integrations';
import { Card, CardHeader, CardTitle, CardContent, Button, useToast } from '@/components/ui';
import { LoadingState } from '@/components/shared';

function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
            {resolvedTheme === 'dark' ? (
              <Moon className="h-5 w-5 text-primary-500" />
            ) : (
              <Sun className="h-5 w-5 text-warning" />
            )}
          </div>
          <CardTitle>Appearance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
          Choose how Personal OS looks to you
        </p>
        <div className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTheme('light')}
          >
            <Sun className="h-4 w-4 mr-2" />
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTheme('dark')}
          >
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </Button>
          <Button
            variant={theme === 'system' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTheme('system')}
          >
            <Monitor className="h-4 w-4 mr-2" />
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const gmailStatus = searchParams.get('gmail');
    const calendarStatus = searchParams.get('calendar');
    const error = searchParams.get('error');

    if (gmailStatus === 'connected') {
      toast.success('Gmail connected successfully!');
      router.replace('/settings', { scroll: false });
    } else if (calendarStatus === 'connected') {
      toast.success('Google Calendar connected successfully!');
      router.replace('/settings', { scroll: false });
    } else if (error) {
      toast.error(`Connection error: ${error}`);
      router.replace('/settings', { scroll: false });
    }
  }, [searchParams, toast, router]);

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Manage your integrations and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Section */}
        <ThemeSelector />

        {/* Integrations */}
        <div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-4">
            Integrations
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <CardTitle>Google Calendar</CardTitle>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      View your schedule
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarConnection />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-error-50 dark:bg-error-950/50 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-error" />
                  </div>
                  <div>
                    <CardTitle>Gmail</CardTitle>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      Sync and triage emails
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GmailConnection />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* About */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <Info className="h-5 w-5 text-surface-500" />
              </div>
              <CardTitle>About</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-surface-500 dark:text-surface-400">Version</span>
                <span className="font-mono text-surface-900 dark:text-surface-100">1.0.0</span>
              </p>
              <p className="flex justify-between">
                <span className="text-surface-500 dark:text-surface-400">Phase</span>
                <span className="text-surface-900 dark:text-surface-100">Phase 2 MVP</span>
              </p>
              <p className="flex justify-between">
                <span className="text-surface-500 dark:text-surface-400">Status</span>
                <span className="text-warning font-medium">Development</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/contexts">
                <Button variant="outline" size="sm">
                  <Layers className="h-4 w-4 mr-2" />
                  Manage Contexts
                </Button>
              </Link>
              <Link href="/inbox">
                <Button variant="outline" size="sm">
                  <Inbox className="h-4 w-4 mr-2" />
                  Approval Queue
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading settings..." />}>
      <SettingsContent />
    </Suspense>
  );
}
