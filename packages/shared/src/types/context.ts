/**
 * Context types and validation schemas
 */

import { z } from 'zod';

/**
 * Context - Core organizational unit representing different areas of work/life
 * Matches the database schema
 */
export interface Context {
  id: string;
  slug: string;
  role: string;
  objective: string;
  constraints: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * ContextBrief - Aggregated context information from various sources
 * Matches the database schema
 */
export interface ContextBrief {
  id: string;
  context_id: string;
  content: string;
  source: string;
  created_at: string;
  updated_at: string;
}

/**
 * Context with its associated briefs
 */
export interface ContextWithBriefs extends Context {
  briefs: ContextBrief[];
}

/**
 * Validation schema for creating a new context
 */
export const createContextSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  role: z
    .string()
    .min(1, 'Role is required')
    .max(200, 'Role must be less than 200 characters'),
  objective: z
    .string()
    .min(1, 'Objective is required')
    .max(1000, 'Objective must be less than 1000 characters'),
  constraints: z
    .string()
    .max(1000, 'Constraints must be less than 1000 characters')
    .optional()
    .nullable(),
  active: z.boolean().default(false),
});

/**
 * Validation schema for updating an existing context
 */
export const updateContextSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    )
    .optional(),
  role: z
    .string()
    .min(1, 'Role is required')
    .max(200, 'Role must be less than 200 characters')
    .optional(),
  objective: z
    .string()
    .min(1, 'Objective is required')
    .max(1000, 'Objective must be less than 1000 characters')
    .optional(),
  constraints: z
    .string()
    .max(1000, 'Constraints must be less than 1000 characters')
    .optional()
    .nullable(),
  active: z.boolean().optional(),
});

/**
 * Input type for creating a context
 */
export type CreateContextInput = z.infer<typeof createContextSchema>;

/**
 * Input type for updating a context
 */
export type UpdateContextInput = z.infer<typeof updateContextSchema>;

/**
 * Validation schema for context brief creation
 */
export const createContextBriefSchema = z.object({
  context_id: z.string().uuid('Invalid context ID'),
  content: z.string().min(1, 'Content is required'),
  source: z.string().min(1, 'Source is required').max(100),
});

/**
 * Input type for creating a context brief
 */
export type CreateContextBriefInput = z.infer<typeof createContextBriefSchema>;
