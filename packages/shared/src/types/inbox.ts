/**
 * Inbox item types and validation schemas
 */

import { z } from 'zod';

/**
 * Inbox item status enum
 */
export type InboxStatus = 'pending' | 'approved' | 'overridden';

/**
 * Inbox suggested action enum
 */
export type InboxAction = 'archive' | 'defer' | 'draft' | 'escalate';

/**
 * InboxItem - Incoming items from various sources that need triage
 * Matches the database schema
 */
export interface InboxItem {
  id: string;
  source: string;
  external_id: string;
  subject: string | null;
  sender: string | null;
  received_at: string;
  body_preview: string | null;
  actionable: boolean | null;
  confidence: number | null;
  suggested_action: InboxAction | null;
  context_id: string | null;
  status: InboxStatus;
  created_at: string;
  updated_at: string;
}

/**
 * InboxItem with context details
 */
export interface InboxItemWithContext extends InboxItem {
  context?: {
    id: string;
    slug: string;
    role: string;
    objective: string;
  } | null;
}

/**
 * Validation schema for creating an inbox item
 */
export const createInboxItemSchema = z.object({
  source: z.string().min(1, 'Source is required').max(50),
  external_id: z.string().min(1, 'External ID is required'),
  subject: z.string().max(500).nullable().optional(),
  sender: z.string().max(200).nullable().optional(),
  received_at: z.string().datetime('Invalid received timestamp'),
  body_preview: z.string().max(1000).nullable().optional(),
  actionable: z.boolean().nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  suggested_action: z.enum(['archive', 'defer', 'draft', 'escalate']).nullable().optional(),
  context_id: z.string().uuid('Invalid context ID').nullable().optional(),
  status: z.enum(['pending', 'approved', 'overridden']).default('pending'),
});

/**
 * Input type for creating an inbox item
 */
export type CreateInboxItemInput = z.infer<typeof createInboxItemSchema>;

/**
 * Validation schema for updating an inbox item
 */
export const updateInboxItemSchema = z.object({
  actionable: z.boolean().nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  suggested_action: z.enum(['archive', 'defer', 'draft', 'escalate']).nullable().optional(),
  context_id: z.string().uuid('Invalid context ID').nullable().optional(),
  status: z.enum(['pending', 'approved', 'overridden']).optional(),
});

/**
 * Input type for updating an inbox item
 */
export type UpdateInboxItemInput = z.infer<typeof updateInboxItemSchema>;

/**
 * Validation schema for approving an inbox item
 */
export const approveInboxItemSchema = z.object({
  execute: z.boolean().default(true),
});

/**
 * Input type for approving an inbox item
 */
export type ApproveInboxItemInput = z.infer<typeof approveInboxItemSchema>;

/**
 * Validation schema for overriding an inbox item
 */
export const overrideInboxItemSchema = z.object({
  action: z.enum(['archive', 'defer', 'draft', 'escalate']),
  context_id: z.string().uuid('Invalid context ID').nullable().optional(),
  execute: z.boolean().default(true),
});

/**
 * Input type for overriding an inbox item
 */
export type OverrideInboxItemInput = z.infer<typeof overrideInboxItemSchema>;

/**
 * Inbox filter parameters
 */
export interface InboxFilterParams {
  status?: InboxStatus;
  context_id?: string;
  min_confidence?: number;
  sender?: string;
  source?: string;
}

/**
 * Inbox sort parameters
 */
export type InboxSortField = 'received_at' | 'confidence' | 'created_at';
export type InboxSortOrder = 'asc' | 'desc';

export interface InboxSortParams {
  field: InboxSortField;
  order: InboxSortOrder;
}
