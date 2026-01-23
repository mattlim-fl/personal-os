/**
 * Gmail Integration
 *
 * This module handles Gmail API integration for email management.
 */

import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';
import type { GmailToken, GmailAuthResponse } from '@personal-os/shared';

export interface GmailConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class GmailService {
  private oauth2Client;

  constructor(private config: GmailConfig) {
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
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
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
  async exchangeCode(code: string): Promise<GmailAuthResponse> {
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
      .from('gmail_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !tokenData) {
      throw new Error('No Gmail token found for user');
    }

    const token = tokenData as GmailToken;
    const expiresAt = new Date(token.expires_at);
    const now = new Date();

    // If token expires in less than 5 minutes, refresh it
    if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      const refreshed = await this.refreshAccessToken(token.refresh_token);
      
      // Update token in database
      await supabase
        .from('gmail_tokens')
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
   * Fetch Gmail threads
   */
  async fetchThreads(
    accessToken: string,
    options: {
      maxResults?: number;
      pageToken?: string;
      query?: string;
    } = {}
  ) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const response = await gmail.users.threads.list({
      userId: 'me',
      maxResults: options.maxResults || 100,
      pageToken: options.pageToken,
      q: options.query || 'in:inbox',
    });

    return response.data;
  }

  /**
   * Get thread details with messages
   */
  async getThread(accessToken: string, threadId: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    const response = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
      format: 'full',
    });

    return response.data;
  }

  /**
   * Modify thread labels (for archiving, etc.)
   */
  async modifyThread(
    accessToken: string,
    threadId: string,
    addLabelIds: string[] = [],
    removeLabelIds: string[] = []
  ) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    await gmail.users.threads.modify({
      userId: 'me',
      id: threadId,
      requestBody: {
        addLabelIds,
        removeLabelIds,
      },
    });
  }

  /**
   * Archive a thread (remove INBOX label)
   */
  async archiveThread(accessToken: string, threadId: string) {
    await this.modifyThread(accessToken, threadId, [], ['INBOX']);
  }
}

/**
 * Create Gmail service instance with environment config
 */
export function createGmailService(): GmailService {
  const config: GmailConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/gmail/callback',
  };

  if (!config.clientId || !config.clientSecret) {
    throw new Error('Missing Gmail OAuth configuration');
  }

  return new GmailService(config);
}
