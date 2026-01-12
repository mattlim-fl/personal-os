/**
 * Types for third-party integrations
 */

export enum IntegrationType {
  GMAIL = 'gmail',
  GITHUB = 'github',
}

export interface Integration {
  id: string;
  type: IntegrationType;
  userId: string;
  isConnected: boolean;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GmailIntegration extends Integration {
  type: IntegrationType.GMAIL;
  email: string;
}

export interface GitHubIntegration extends Integration {
  type: IntegrationType.GITHUB;
  username: string;
}
