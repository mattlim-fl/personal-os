-- Personal OS v1 - Initial Schema Migration
-- This migration creates the core tables for the MVP: users, contexts, tasks, inbox_items, rules, and context_briefs

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Task status values
CREATE TYPE task_status_enum AS ENUM ('open', 'deferred', 'done');

-- Inbox item status values (workflow state)
CREATE TYPE inbox_status_enum AS ENUM ('pending', 'approved', 'overridden');

-- Inbox suggested action values
CREATE TYPE inbox_action_enum AS ENUM ('archive', 'defer', 'draft', 'escalate');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table
-- Simple user table for task ownership and future auth integration
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE users IS 'Users who own tasks and interact with the system';
COMMENT ON COLUMN users.email IS 'Unique email address for the user';
COMMENT ON COLUMN users.name IS 'Display name for the user';

-- Contexts table
-- Core organizational unit representing different areas of work/life
CREATE TABLE contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  objective TEXT NOT NULL,
  constraints TEXT,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE contexts IS 'Organizational contexts representing different areas of work or life';
COMMENT ON COLUMN contexts.slug IS 'URL-friendly unique identifier for the context';
COMMENT ON COLUMN contexts.role IS 'The role or persona within this context';
COMMENT ON COLUMN contexts.objective IS 'Primary goal or purpose of this context';
COMMENT ON COLUMN contexts.constraints IS 'Limitations or boundaries for this context';
COMMENT ON COLUMN contexts.active IS 'Whether this context is currently active';

-- Context briefs table
-- Aggregated information about a context from various sources
CREATE TABLE context_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id UUID NOT NULL REFERENCES contexts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE context_briefs IS 'Aggregated context information from various sources (e.g., GitHub, Gmail)';
COMMENT ON COLUMN context_briefs.context_id IS 'The context this brief belongs to';
COMMENT ON COLUMN context_briefs.content IS 'Markdown content of the brief';
COMMENT ON COLUMN context_briefs.source IS 'Source system that generated this brief (e.g., github, gmail)';

-- Tasks table
-- Action items within contexts
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id UUID NOT NULL REFERENCES contexts(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status task_status_enum NOT NULL DEFAULT 'open',
  next_action TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE tasks IS 'Action items and tasks within contexts';
COMMENT ON COLUMN tasks.context_id IS 'The context this task belongs to';
COMMENT ON COLUMN tasks.owner_id IS 'The user who owns this task';
COMMENT ON COLUMN tasks.title IS 'Title or description of the task';
COMMENT ON COLUMN tasks.status IS 'Current status: open, deferred, or done';
COMMENT ON COLUMN tasks.next_action IS 'The next concrete action to take on this task';
COMMENT ON COLUMN tasks.due_date IS 'Optional due date for the task';

-- Inbox items table
-- Incoming items from various sources that need triage
CREATE TABLE inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  subject TEXT,
  sender TEXT,
  received_at TIMESTAMPTZ NOT NULL,
  body_preview TEXT,
  actionable BOOLEAN,
  confidence FLOAT,
  suggested_action inbox_action_enum,
  context_id UUID REFERENCES contexts(id) ON DELETE SET NULL,
  status inbox_status_enum NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source, external_id)
);

COMMENT ON TABLE inbox_items IS 'Incoming items from external sources (e.g., Gmail) that need triage';
COMMENT ON COLUMN inbox_items.source IS 'Source system (e.g., gmail, github)';
COMMENT ON COLUMN inbox_items.external_id IS 'ID from the source system';
COMMENT ON COLUMN inbox_items.subject IS 'Subject line or title of the item';
COMMENT ON COLUMN inbox_items.sender IS 'Who sent or created this item';
COMMENT ON COLUMN inbox_items.received_at IS 'When the item was received';
COMMENT ON COLUMN inbox_items.body_preview IS 'Preview or excerpt of the content';
COMMENT ON COLUMN inbox_items.actionable IS 'Whether this item requires action';
COMMENT ON COLUMN inbox_items.confidence IS 'AI confidence score for classification (0-1)';
COMMENT ON COLUMN inbox_items.suggested_action IS 'AI-suggested action: archive, defer, draft, or escalate';
COMMENT ON COLUMN inbox_items.context_id IS 'Optional context this item relates to';
COMMENT ON COLUMN inbox_items.status IS 'Workflow status: pending, approved, or overridden';

-- Rules table
-- Automation rules for processing inbox items and other workflows
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL,
  trigger JSONB NOT NULL,
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE rules IS 'Automation rules for processing inbox items and workflows';
COMMENT ON COLUMN rules.scope IS 'Scope of the rule: global or context-specific';
COMMENT ON COLUMN rules.trigger IS 'JSONB structure defining when this rule is triggered';
COMMENT ON COLUMN rules.condition IS 'JSONB structure defining conditions that must be met';
COMMENT ON COLUMN rules.action IS 'JSONB structure defining the action to take';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Indexes for foreign key lookups
CREATE INDEX idx_context_briefs_context_id ON context_briefs(context_id);
CREATE INDEX idx_tasks_context_id ON tasks(context_id);
CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
CREATE INDEX idx_inbox_items_context_id ON inbox_items(context_id);

-- Indexes for common queries
CREATE INDEX idx_inbox_items_status ON inbox_items(status);
CREATE INDEX idx_inbox_items_received_at ON inbox_items(received_at DESC);

-- ============================================================================
-- NOTES
-- ============================================================================

-- This is a minimal MVP schema focused on clarity and correctness
-- Future enhancements may include:
-- - RLS policies for multi-tenant security
-- - Triggers for updated_at timestamp automation
-- - Full-text search indexes
-- - Additional constraints and validations
-- - Audit logging tables
