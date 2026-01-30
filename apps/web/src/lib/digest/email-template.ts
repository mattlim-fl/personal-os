/**
 * Email template for daily digest
 */

import type {
  CalendarBriefing,
  GitHubActivityBriefing,
  GoalsBriefingData,
} from '@personal-os/shared';
import type { FocusItem } from './generate-focus-items';

export interface DigestData {
  focusItems: FocusItem[];
  calendar: CalendarBriefing | null;
  goals: GoalsBriefingData | null;
  github: GitHubActivityBriefing | null;
  date: string;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function generateFocusHtml(focusItems: FocusItem[]): string {
  if (focusItems.length === 0) {
    return `
      <div style="background: #ecfdf5; padding: 16px 20px; border-left: 4px solid #10b981; margin: 16px 0;">
        <p style="margin: 0; font-size: 18px; font-weight: 600; color: #065f46;">All clear — time for deep work</p>
      </div>
    `;
  }

  const primary = focusItems[0];
  const secondary = focusItems[1];

  let html = `
    <div style="background: #eff6ff; padding: 16px 20px; border-left: 4px solid #3b82f6; margin: 16px 0;">
  `;

  // Primary focus
  const primaryTitle = primary.url
    ? `<a href="${primary.url}" style="color: #1e3a8a; text-decoration: none;">${primary.title}</a>`
    : primary.title;

  html += `
    <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #1e3a8a;">${primaryTitle}</p>
    <p style="margin: 0; color: #64748b; font-size: 14px;">${primary.reason}</p>
  `;

  // Secondary focus
  if (secondary) {
    const secondaryTitle = secondary.url
      ? `<a href="${secondary.url}" style="color: #475569; text-decoration: none;">${secondary.title}</a>`
      : secondary.title;

    html += `
      <hr style="margin: 12px 0; border: none; border-top: 1px solid #bfdbfe;">
      <p style="margin: 0; font-size: 14px;">
        <span style="color: #3b82f6; font-weight: 600; text-transform: uppercase; font-size: 11px;">Next:</span>
        <span style="color: #475569;"> ${secondaryTitle}</span>
        <span style="color: #94a3b8; font-size: 12px;"> — ${secondary.reason}</span>
      </p>
    `;
  }

  html += '</div>';
  return html;
}

function generateCalendarHtml(calendar: CalendarBriefing | null): string {
  if (!calendar) {
    return '<p style="color: #999;">Calendar not connected.</p>';
  }

  const { events, meetingCount, focusTimeAvailable } = calendar;

  let html = `
    <p style="margin: 0 0 12px 0; color: #666;">
      ${meetingCount} meeting${meetingCount !== 1 ? 's' : ''} · ${focusTimeAvailable}h focus time available
    </p>
  `;

  if (events.length === 0) {
    html += '<p style="color: #999;">No meetings today.</p>';
    return html;
  }

  // Only show non-all-day events
  const timedEvents = events.filter((e) => !e.isAllDay).slice(0, 5);

  if (timedEvents.length > 0) {
    html += '<ul style="margin: 0; padding-left: 20px;">';
    for (const event of timedEvents) {
      const time = formatTime(event.start);
      const link = event.meetingLink
        ? ` <a href="${event.meetingLink}" style="color: #3b82f6; font-size: 12px;">[Join]</a>`
        : '';
      html += `<li style="margin-bottom: 6px;"><strong>${time}</strong> ${event.summary}${link}</li>`;
    }
    html += '</ul>';

    if (events.filter((e) => !e.isAllDay).length > 5) {
      html += `<p style="color: #999; font-size: 12px;">+${events.filter((e) => !e.isAllDay).length - 5} more</p>`;
    }
  }

  return html;
}

function generateGoalsHtml(goals: GoalsBriefingData | null): string {
  if (!goals) {
    return '<p style="color: #999;">Goals not loaded.</p>';
  }

  const { weeklyGoals } = goals;

  if (weeklyGoals.length === 0) {
    return '<p style="color: #999;">No weekly goals set.</p>';
  }

  const done = weeklyGoals.filter((g) => g.status === 'done').length;
  const inProgress = weeklyGoals.filter((g) => g.status === 'in_progress').length;
  const total = weeklyGoals.length;

  let html = `
    <p style="margin: 0 0 12px 0; color: #666;">
      ${done}/${total} complete${inProgress > 0 ? ` · ${inProgress} in progress` : ''}
    </p>
    <ul style="margin: 0; padding-left: 20px;">
  `;

  for (const goal of weeklyGoals) {
    const icon =
      goal.status === 'done' ? '✓' : goal.status === 'in_progress' ? '→' : '○';
    const style =
      goal.status === 'done'
        ? 'color: #10b981;'
        : goal.status === 'in_progress'
          ? 'color: #3b82f6;'
          : 'color: #64748b;';
    html += `<li style="margin-bottom: 4px; ${style}"><span style="font-family: monospace;">${icon}</span> ${goal.title}</li>`;
  }

  html += '</ul>';
  return html;
}

function generateNeedsAttentionHtml(github: GitHubActivityBriefing | null): string {
  if (!github?.needsAttention) {
    return '<p style="color: #999;">GitHub not connected.</p>';
  }

  const { prsAwaitingYourReview, yourPRsAwaitingReview, stalePRs } = github.needsAttention;

  const hasItems =
    prsAwaitingYourReview.length > 0 ||
    yourPRsAwaitingReview.length > 0 ||
    stalePRs.length > 0;

  if (!hasItems) {
    return '<p style="color: #10b981;">Nothing needs attention right now.</p>';
  }

  let html = '<ul style="margin: 0; padding-left: 20px;">';

  for (const pr of prsAwaitingYourReview.slice(0, 3)) {
    html += `<li style="margin-bottom: 6px;">
      <a href="${pr.url}" style="color: #1e3a8a; text-decoration: none;">PR #${pr.number}: ${pr.title}</a>
      <span style="color: #94a3b8; font-size: 12px;"> — needs your review (${pr.daysOld}d)</span>
    </li>`;
  }

  for (const pr of yourPRsAwaitingReview.slice(0, 2)) {
    html += `<li style="margin-bottom: 6px;">
      <a href="${pr.url}" style="color: #475569; text-decoration: none;">PR #${pr.number}: ${pr.title}</a>
      <span style="color: #94a3b8; font-size: 12px;"> — awaiting review (${pr.daysOld}d)</span>
    </li>`;
  }

  for (const pr of stalePRs.slice(0, 2)) {
    html += `<li style="margin-bottom: 6px;">
      <a href="${pr.url}" style="color: #dc2626; text-decoration: none;">PR #${pr.number}: ${pr.title}</a>
      <span style="color: #94a3b8; font-size: 12px;"> — stale (${pr.daysOld}d)</span>
    </li>`;
  }

  html += '</ul>';
  return html;
}

export function generateDigestHtml(data: DigestData): string {
  const { focusItems, calendar, goals, github, date } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h1 style="margin: 0 0 4px 0; font-size: 24px; color: #0f172a;">Morning Briefing</h1>
  <p style="margin: 0 0 24px 0; color: #64748b;">${date}</p>

  <h2 style="margin: 24px 0 8px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Focus</h2>
  ${generateFocusHtml(focusItems)}

  <h2 style="margin: 24px 0 8px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Today's Calendar</h2>
  ${generateCalendarHtml(calendar)}

  <h2 style="margin: 24px 0 8px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Weekly Goals</h2>
  ${generateGoalsHtml(goals)}

  <h2 style="margin: 24px 0 8px 0; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Needs Attention</h2>
  ${generateNeedsAttentionHtml(github)}

  <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;">
  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
    Generated by Personal OS
  </p>

</body>
</html>
  `.trim();
}

export function generateDigestPlainText(data: DigestData): string {
  const { focusItems, calendar, goals, github, date } = data;

  let text = `Morning Briefing\n${date}\n\n`;

  // Focus
  text += '== FOCUS ==\n';
  if (focusItems.length === 0) {
    text += 'All clear — time for deep work\n';
  } else {
    for (const item of focusItems) {
      text += `• ${item.title}\n  ${item.reason}\n`;
    }
  }

  // Calendar
  text += '\n== TODAY\'S CALENDAR ==\n';
  if (calendar) {
    text += `${calendar.meetingCount} meetings · ${calendar.focusTimeAvailable}h focus time\n`;
    for (const event of calendar.events.filter((e) => !e.isAllDay).slice(0, 5)) {
      text += `• ${formatTime(event.start)} ${event.summary}\n`;
    }
  } else {
    text += 'Calendar not connected.\n';
  }

  // Goals
  text += '\n== WEEKLY GOALS ==\n';
  if (goals?.weeklyGoals.length) {
    const done = goals.weeklyGoals.filter((g) => g.status === 'done').length;
    text += `${done}/${goals.weeklyGoals.length} complete\n`;
    for (const goal of goals.weeklyGoals) {
      const icon = goal.status === 'done' ? '✓' : goal.status === 'in_progress' ? '→' : '○';
      text += `${icon} ${goal.title}\n`;
    }
  } else {
    text += 'No weekly goals set.\n';
  }

  // Needs Attention
  text += '\n== NEEDS ATTENTION ==\n';
  if (github?.needsAttention) {
    const { prsAwaitingYourReview, yourPRsAwaitingReview, stalePRs } = github.needsAttention;
    const items = [...prsAwaitingYourReview, ...yourPRsAwaitingReview, ...stalePRs];
    if (items.length === 0) {
      text += 'Nothing needs attention right now.\n';
    } else {
      for (const pr of items.slice(0, 5)) {
        text += `• PR #${pr.number}: ${pr.title} (${pr.daysOld}d)\n`;
      }
    }
  } else {
    text += 'GitHub not connected.\n';
  }

  return text;
}
