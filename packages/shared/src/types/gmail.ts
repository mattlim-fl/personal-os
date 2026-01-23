/**
 * Gmail integration types and validation schemas
 */

import { z } from 'zod';

/**
 * Gmail OAuth token storage
 */
export interface GmailToken {
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
 * Gmail OAuth callback response
 */
export interface GmailAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Gmail thread from API
 */
export interface GmailThread {
  id: string;
  snippet: string;
  historyId: string;
  messages: GmailMessage[];
}

/**
 * Gmail message from API
 */
export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  internalDate: string;
  payload: {
    headers: Array<{
      name: string;
      value: string;
    }>;
    body?: {
      data?: string;
    };
  };
}

/**
 * Parsed email data for storage
 */
export interface ParsedEmail {
  external_id: string;
  subject: string;
  sender: string;
  received_at: string;
  body_preview: string;
}

/**
 * Gmail connection status
 */
export interface GmailConnectionStatus {
  connected: boolean;
  email?: string;
  last_synced_at?: string;
}

/**
 * Validation schema for storing Gmail tokens
 */
export const createGmailTokenSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  access_token: z.string().min(1, 'Access token is required'),
  refresh_token: z.string().min(1, 'Refresh token is required'),
  expires_at: z.string().datetime('Invalid expiration timestamp'),
  email: z.string().email('Invalid email address'),
});

/**
 * Input type for creating Gmail token
 */
export type CreateGmailTokenInput = z.infer<typeof createGmailTokenSchema>;

/**
 * Validation schema for Gmail sync request
 */
export const gmailSyncRequestSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  full_sync: z.boolean().default(false),
});

/**
 * Input type for Gmail sync request
 */
export type GmailSyncRequest = z.infer<typeof gmailSyncRequestSchema>;
