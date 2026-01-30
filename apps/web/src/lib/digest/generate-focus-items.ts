/**
 * Shared focus item generation logic
 * Used by both FocusSection component and digest API
 */

import type {
  CalendarBriefing,
  CalendarEvent,
  GitHubActivityBriefing,
} from '@personal-os/shared';

export interface FocusItem {
  title: string;
  reason: string;
  type: 'meeting' | 'pr' | 'task';
  url?: string;
  priority: number;
  eventData?: CalendarEvent; // For meeting prep auto-creation
}

/**
 * Generate prioritized focus items from calendar and GitHub data
 *
 * Priority order:
 * 1. PRs awaiting your review (blocking others)
 * 2. Next meeting that needs prep (within 2 hours)
 * 3. Your PRs waiting for review (follow up)
 *
 * @returns Top 2 focus items sorted by priority
 */
export function generateFocusItems(
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
        eventData: meeting,
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
