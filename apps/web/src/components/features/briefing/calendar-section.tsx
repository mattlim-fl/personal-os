'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CalendarBriefing, CalendarEvent } from '@personal-os/shared';
import { Card, CardContent, Badge } from '@/components/ui';
import { LoadingState, EmptyState } from '@/components/shared';

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatTimeRange(start: string, end: string, isAllDay: boolean): string {
  if (isAllDay) {
    return 'All day';
  }
  return `${formatTime(start)} - ${formatTime(end)}`;
}

function EventRow({ event }: { event: CalendarEvent }) {
  const isNow = () => {
    const now = new Date();
    const start = new Date(event.start);
    const end = new Date(event.end);
    return now >= start && now <= end;
  };

  return (
    <div
      className={`flex items-start gap-4 p-3 rounded-lg ${
        isNow() ? 'bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800' : 'hover:bg-surface-50 dark:hover:bg-surface-800'
      }`}
    >
      <div className="w-24 flex-shrink-0 text-sm text-surface-600 dark:text-surface-400">
        {formatTimeRange(event.start, event.end, event.isAllDay)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-surface-900 dark:text-surface-50 truncate">{event.summary}</span>
          {isNow() && (
            <Badge variant="primary" size="sm">
              Now
            </Badge>
          )}
        </div>
        {event.location && (
          <p className="text-sm text-surface-500 dark:text-surface-400 truncate mt-0.5">{event.location}</p>
        )}
        {event.meetingLink && (
          <a
            href={event.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-0.5 inline-block"
          >
            Join meeting →
          </a>
        )}
      </div>
      <div className="text-xs text-surface-400 dark:text-surface-500 flex-shrink-0">{event.calendar}</div>
    </div>
  );
}

export function CalendarSection() {
  const [briefing, setBriefing] = useState<CalendarBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConnected, setNotConnected] = useState(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await fetch('/api/calendar/events');
        const data = await response.json();

        if (response.status === 401) {
          setNotConnected(true);
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch calendar');
        }

        setBriefing(data.data);
      } catch (err) {
        console.error('Error fetching calendar:', err);
        setError(err instanceof Error ? err.message : 'Failed to load calendar');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Schedule</h2>
          <LoadingState message="Loading calendar..." />
        </CardContent>
      </Card>
    );
  }

  if (notConnected) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Schedule</h2>
          <EmptyState
            title="Calendar not connected"
            description="Connect your Google Calendar to see today's schedule"
            action={
              <Link
                href="/settings"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                Connect Calendar
              </Link>
            }
          />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Schedule</h2>
          <div className="text-error-600 dark:text-error-400 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const events = briefing?.events || [];
  const meetingCount = briefing?.meetingCount || 0;
  const focusTime = briefing?.focusTimeAvailable || 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Today&apos;s Schedule</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">{today}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-surface-900 dark:text-surface-50">{meetingCount}</div>
              <div className="text-surface-500 dark:text-surface-400">meetings</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-surface-900 dark:text-surface-50">{focusTime}h</div>
              <div className="text-surface-500 dark:text-surface-400">focus time</div>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="No events today"
            description="Your calendar is clear. Time to focus!"
            compact
          />
        ) : (
          <div className="space-y-1">
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
