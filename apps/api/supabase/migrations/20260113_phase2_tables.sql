-- Personal OS v1 - Phase 2 Migration
-- This migration adds tables and columns needed for Gmail integration and inbox management

-- ============================================================================
-- GMAIL TOKENS TABLE
-- ============================================================================

-- Store OAuth tokens for Gmail integration
CREATE TABLE gmail_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE gmail_tokens IS 'OAuth tokens for Gmail API access';
COMMENT ON COLUMN gmail_tokens.user_id IS 'The user who owns this Gmail connection';
COMMENT ON COLUMN gmail_tokens.access_token IS 'OAuth access token for Gmail API';
COMMENT ON COLUMN gmail_tokens.refresh_token IS 'OAuth refresh token for renewing access';
COMMENT ON COLUMN gmail_tokens.expires_at IS 'When the access token expires';
COMMENT ON COLUMN gmail_tokens.email IS 'Gmail email address associated with this token';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for token lookups by user
CREATE INDEX idx_gmail_tokens_user_id ON gmail_tokens(user_id);

-- ============================================================================
-- USER TABLE UPDATES
-- ============================================================================

-- Add last_synced_at to track incremental sync
ALTER TABLE users ADD COLUMN gmail_last_synced_at TIMESTAMPTZ;

COMMENT ON COLUMN users.gmail_last_synced_at IS 'Timestamp of last successful Gmail sync';

-- ============================================================================
-- NOTES
-- ============================================================================

-- Security considerations:
-- - Tokens should be encrypted at rest in production
-- - Consider using Supabase Vault for sensitive data in future
-- - RLS policies will be needed for multi-user support
