/**
 * Google Calendar Integration
 *
 * This module handles Google Calendar API integration for the Morning Briefing.
 */

import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';
import type {
  CalendarToken,
  CalendarAuthResponse,
  CalendarEvent,
  CalendarListItem,
  CalendarBriefing,
} from '@personal-os/shared';

export interface CalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class CalendarService {
  private oauth2Client;

  constructor(private config: CalendarConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force consent to get refresh token
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCode(code: string): Promise<CalendarAuthResponse> {
    const { tokens } = await this.oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to obtain tokens');
    }

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expiry_date
        ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
        : 3600,
      token_type: 'Bearer',
      scope: tokens.scope || '',
    };
  }

  /**
   * Get user's email address from token
   */
  async getUserEmail(accessToken: string): Promise<string> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      throw new Error('Failed to get user email');
    }

    return data.email;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    expires_at: string;
  }> {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await this.oauth2Client.refreshAccessToken();

    if (!credentials.access_token || !credentials.expiry_date) {
      throw new Error('Failed to refresh token');
    }

    return {
      access_token: credentials.access_token,
      expires_at: new Date(credentials.expiry_date).toISOString(),
    };
  }

  /**
   * Get valid access token for a user (refresh if needed)
   */
  async getValidToken(userId: string): Promise<string> {
    const { data: tokenData, error } = await supabase
      .from('calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !tokenData) {
      throw new Error('No Calendar token found for user');
    }

    const token = tokenData as CalendarToken;
    const expiresAt = new Date(token.expires_at);
    const now = new Date();

    // If token expires in less than 5 minutes, refresh it
    if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      const refreshed = await this.refreshAccessToken(token.refresh_token);

      // Update token in database
      await supabase
        .from('calendar_tokens')
        .update({
          access_token: refreshed.access_token,
          expires_at: refreshed.expires_at,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return refreshed.access_token;
    }

    return token.access_token;
  }

  /**
   * List all calendars for the user
   */
  async listCalendars(accessToken: string): Promise<CalendarListItem[]> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const response = await calendar.calendarList.list();
    const items = response.data.items || [];

    return items.map((cal) => ({
      id: cal.id || '',
      summary: cal.summary || 'Untitled Calendar',
      description: cal.description || undefined,
      primary: cal.primary || false,
      backgroundColor: cal.backgroundColor || undefined,
    }));
  }

  /**
   * Fetch events for today from all calendars
   */
  async getTodaysEvents(accessToken: string): Promise<CalendarEvent[]> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    // Get start and end of today
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Get list of calendars
    const calendars = await this.listCalendars(accessToken);
    const allEvents: CalendarEvent[] = [];

    // Fetch events from each calendar
    for (const cal of calendars) {
      try {
        const response = await calendar.events.list({
          calendarId: cal.id,
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        });

        const events = response.data.items || [];

        for (const event of events) {
          // Skip events without start/end times
          if (!event.start || !event.end) continue;

          const isAllDay = !event.start.dateTime;
          const startTime = event.start.dateTime || event.start.date || '';
          const endTime = event.end.dateTime || event.end.date || '';

          // Extract meeting link
          let meetingLink: string | undefined;
          if (event.hangoutLink) {
            meetingLink = event.hangoutLink;
          } else if (event.conferenceData?.entryPoints) {
            const videoEntry = event.conferenceData.entryPoints.find(
              (e) => e.entryPointType === 'video'
            );
            meetingLink = videoEntry?.uri || undefined;
          }

          allEvents.push({
            id: event.id || '',
            summary: event.summary || 'Untitled Event',
            description: event.description || undefined,
            start: startTime,
            end: endTime,
            calendar: cal.summary,
            calendarId: cal.id,
            meetingLink,
            location: event.location || undefined,
            attendees: event.attendees?.map((a) => ({
              email: a.email || '',
              displayName: a.displayName || undefined,
              responseStatus: a.responseStatus as CalendarEvent['attendees'][0]['responseStatus'],
              self: a.self || false,
            })),
            isAllDay,
          });
        }
      } catch (err) {
        // Log but continue if a specific calendar fails
        console.error(`Failed to fetch events from calendar ${cal.id}:`, err);
      }
    }

    // Sort by start time
    allEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return allEvents;
  }

  /**
   * Generate calendar briefing for today
   */
  async getCalendarBriefing(accessToken: string): Promise<CalendarBriefing> {
    const events = await this.getTodaysEvents(accessToken);

    // Count only non-all-day events as meetings
    const timedEvents = events.filter((e) => !e.isAllDay);
    const meetingCount = timedEvents.length;

    // Calculate focus time (hours without meetings during work hours 9am-6pm)
    const workDayStart = 9; // 9 AM
    const workDayEnd = 18; // 6 PM
    const workDayHours = workDayEnd - workDayStart;

    let meetingHours = 0;
    for (const event of timedEvents) {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      meetingHours += durationHours;
    }

    const focusTimeAvailable = Math.max(0, workDayHours - meetingHours);

    // Find next event
    const now = new Date();
    const nextEvent = events.find((e) => new Date(e.start) > now);

    return {
      events,
      meetingCount,
      focusTimeAvailable: Math.round(focusTimeAvailable * 10) / 10, // Round to 1 decimal
      nextEvent,
    };
  }
}

/**
 * Create Calendar service instance with environment config
 */
export function createCalendarService(): CalendarService {
  const config: CalendarConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_CALENDAR_REDIRECT_URI ||
      'http://localhost:3000/api/calendar/callback',
  };

  if (!config.clientId || !config.clientSecret) {
    throw new Error('Missing Google Calendar OAuth configuration');
  }

  return new CalendarService(config);
}
