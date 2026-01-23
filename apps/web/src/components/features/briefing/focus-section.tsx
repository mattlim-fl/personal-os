'use client';

import { useState, useEffect } from 'react';
import type {
  CalendarBriefing,
  GitHubActivityBriefing,
} from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';

interface FocusItem {
  title: string;
  reason: string;
  type: 'meeting' | 'pr' | 'task';
  url?: string;
  priority: number;
}

function generateFocusItems(
  calendar: CalendarBriefing | null,
  github: GitHubActivityBriefing | null
): FocusItem[] {
  const items: FocusItem[] = [];
  const now = new Date();

  // 1. PRs awaiting your review (blocking others)
  if (github?.needsAttention?.prsAwaitingYourReview) {
    for (const pr of github.needsAttention.prsAwaitingYourReview.slice(0, 1)) {
      items.push({
        title: `Review PR #${pr.number}: ${pr.title}`,
        reason: `Blocking ${pr.repo} (${pr.daysOld}d old)`,
        type: 'pr',
        url: pr.url,
        priority: 1,
      });
    }
  }

  // 2. Next meeting that needs prep (within 2 hours)
  if (calendar?.events) {
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const upcomingMeetings = calendar.events.filter((e) => {
      const start = new Date(e.start);
      return !e.isAllDay && start > now && start <= twoHoursFromNow;
    });

    if (upcomingMeetings.length > 0) {
      const meeting = upcomingMeetings[0];
      items.push({
        title: `Prep for ${meeting.summary}`,
        reason: `Starts at ${new Date(meeting.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
        type: 'meeting',
        url: meeting.meetingLink,
        priority: 2,
      });
    }
  }

  // 3. Your PRs waiting for review (follow up)
  if (github?.needsAttention?.yourPRsAwaitingReview) {
    for (const pr of github.needsAttention.yourPRsAwaitingReview.slice(0, 1)) {
      items.push({
        title: `Follow up on PR #${pr.number}`,
        reason: `Awaiting review (${pr.daysOld}d)`,
        type: 'pr',
        url: pr.url,
        priority: 3,
      });
    }
  }

  return items.sort((a, b) => a.priority - b.priority).slice(0, 2);
}

export function FocusSection() {
  const [focusItems, setFocusItems] = useState<FocusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [calendarRes, githubRes] = await Promise.all([
          fetch('/api/calendar/events').catch(() => null),
          fetch('/api/github/activity').catch(() => null),
        ]);

        const calendar = calendarRes?.ok ? (await calendarRes.json()).data : null;
        const github = githubRes?.ok ? (await githubRes.json()).data : null;

        setFocusItems(generateFocusItems(calendar, github));
      } catch (err) {
        console.error('Error generating focus items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const typeLabel: Record<string, string> = {
    meeting: 'Meeting',
    pr: 'PR',
    task: 'Task',
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/40 dark:to-primary-900/20 border-primary-200 dark:border-primary-800">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-32 bg-primary-200 dark:bg-primary-800 rounded" />
            <div className="h-8 w-3/4 bg-primary-200 dark:bg-primary-800 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (focusItems.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-950/40 dark:to-success-900/20 border-success-200 dark:border-success-800">
        <CardContent className="p-8">
          <p className="text-sm font-medium text-success-600 dark:text-success-400 mb-1">Focus</p>
          <h2 className="text-2xl font-bold text-success-900 dark:text-success-100">
            All clear — time for deep work
          </h2>
        </CardContent>
      </Card>
    );
  }

  const primary = focusItems[0];
  const secondary = focusItems[1];

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-950/40 dark:to-primary-900/20 border-primary-200 dark:border-primary-800">
      <CardContent className="p-8">
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">Focus</p>

        {/* Primary focus */}
        <div className="flex items-start justify-between gap-4 mb-1">
          {primary.url ? (
            <a
              href={primary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl md:text-2xl font-bold text-surface-900 dark:text-surface-50 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {primary.title}
            </a>
          ) : (
            <h2 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-surface-50">
              {primary.title}
            </h2>
          )}
          <Badge variant="default" size="sm" className="flex-shrink-0 mt-1">
            {typeLabel[primary.type]}
          </Badge>
        </div>
        <p className="text-surface-600 dark:text-surface-400 mb-4">{primary.reason}</p>

        {/* Secondary focus */}
        {secondary && (
          <div className="flex items-center gap-3 pt-3 border-t border-primary-200 dark:border-primary-700/50">
            <span className="text-xs font-medium text-primary-500 dark:text-primary-400 uppercase tracking-wide">Next</span>
            {secondary.url ? (
              <a
                href={secondary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {secondary.title}
              </a>
            ) : (
              <span className="text-sm text-surface-700 dark:text-surface-300">
                {secondary.title}
              </span>
            )}
            <span className="text-xs text-surface-500 dark:text-surface-400">
              {secondary.reason}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
