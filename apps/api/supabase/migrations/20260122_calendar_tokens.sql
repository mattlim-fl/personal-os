-- Personal OS - Calendar Integration Migration
-- This migration adds the table for Google Calendar integration

-- ============================================================================
-- CALENDAR TOKENS TABLE
-- ============================================================================

-- Store OAuth tokens for Google Calendar integration
CREATE TABLE IF NOT EXISTS calendar_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE calendar_tokens IS 'OAuth tokens for Google Calendar API access';
COMMENT ON COLUMN calendar_tokens.user_id IS 'The user who owns this Calendar connection';
COMMENT ON COLUMN calendar_tokens.access_token IS 'OAuth access token for Calendar API';
COMMENT ON COLUMN calendar_tokens.refresh_token IS 'OAuth refresh token for renewing access';
COMMENT ON COLUMN calendar_tokens.expires_at IS 'When the access token expires';
COMMENT ON COLUMN calendar_tokens.email IS 'Google email address associated with this token';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for token lookups by user (unique constraint also creates an index)
CREATE INDEX IF NOT EXISTS idx_calendar_tokens_user_id ON calendar_tokens(user_id);

-- ============================================================================
-- NOTES
-- ============================================================================

-- Security considerations:
-- - Tokens should be encrypted at rest in production
-- - Consider using Supabase Vault for sensitive data in future
-- - RLS policies will be needed for multi-user support
