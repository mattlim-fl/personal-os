/**
 * Calendar integration types and validation schemas
 */

import { z } from 'zod';

/**
 * Calendar OAuth token storage
 */
export interface CalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/**
 * Calendar OAuth callback response
 */
export interface CalendarAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Calendar event from API
 */
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  calendar: string; // Which calendar it's from
  calendarId: string;
  meetingLink?: string;
  location?: string;
  attendees?: CalendarAttendee[];
  isAllDay: boolean;
}

/**
 * Calendar attendee
 */
export interface CalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  self?: boolean;
}

/**
 * Calendar list item
 */
export interface CalendarListItem {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  backgroundColor?: string;
}

/**
 * Calendar connection status
 */
export interface CalendarConnectionStatus {
  connected: boolean;
  email?: string;
  calendars?: CalendarListItem[];
  last_synced_at?: string;
}

/**
 * Today's calendar summary for briefing
 */
export interface CalendarBriefing {
  events: CalendarEvent[];
  meetingCount: number;
  focusTimeAvailable: number; // hours of unscheduled time
  nextEvent?: CalendarEvent;
}

/**
 * Validation schema for storing Calendar tokens
 */
export const createCalendarTokenSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  access_token: z.string().min(1, 'Access token is required'),
  refresh_token: z.string().min(1, 'Refresh token is required'),
  expires_at: z.string().datetime('Invalid expiration timestamp'),
  email: z.string().email('Invalid email address'),
});

/**
 * Input type for creating Calendar token
 */
export type CreateCalendarTokenInput = z.infer<typeof createCalendarTokenSchema>;
