/**
 * Rules engine types and validation schemas
 */

import { z } from 'zod';
import { InboxAction } from './inbox';

/**
 * Rule scope
 */
export type RuleScope = 'global' | 'context-specific';

/**
 * Rule condition field
 */
export type RuleConditionField = 'sender' | 'subject' | 'domain' | 'body';

/**
 * Rule condition operator
 */
export type RuleConditionOperator = 'equals' | 'contains' | 'matches' | 'starts_with' | 'ends_with';

/**
 * Rule trigger structure
 */
export interface RuleTrigger {
  type: 'inbox_item_created';
}

/**
 * Rule condition structure
 */
export interface RuleCondition {
  field: RuleConditionField;
  operator: RuleConditionOperator;
  value: string;
}

/**
 * Rule action structure
 */
export interface RuleAction {
  type: InboxAction;
  context_id?: string;
}

/**
 * Rule - Automation rules for processing inbox items
 * Matches the database schema
 */
export interface Rule {
  id: string;
  scope: string;
  trigger: RuleTrigger;
  condition: RuleCondition;
  action: RuleAction;
  created_at: string;
  updated_at: string;
}

/**
 * Rule evaluation result
 */
export interface RuleEvaluationResult {
  matched: boolean;
  rule_id?: string;
  suggested_action?: InboxAction;
  context_id?: string;
  confidence: number;
}

/**
 * Validation schema for rule trigger
 */
export const ruleTriggerSchema = z.object({
  type: z.literal('inbox_item_created'),
});

/**
 * Validation schema for rule condition
 */
export const ruleConditionSchema = z.object({
  field: z.enum(['sender', 'subject', 'domain', 'body']),
  operator: z.enum(['equals', 'contains', 'matches', 'starts_with', 'ends_with']),
  value: z.string().min(1, 'Condition value is required'),
});

/**
 * Validation schema for rule action
 */
export const ruleActionSchema = z.object({
  type: z.enum(['archive', 'defer', 'draft', 'escalate']),
  context_id: z.string().uuid('Invalid context ID').optional(),
});

/**
 * Validation schema for creating a rule
 */
export const createRuleSchema = z.object({
  scope: z.enum(['global', 'context-specific']).default('global'),
  trigger: ruleTriggerSchema,
  condition: ruleConditionSchema,
  action: ruleActionSchema,
});

/**
 * Input type for creating a rule
 */
export type CreateRuleInput = z.infer<typeof createRuleSchema>;

/**
 * Validation schema for updating a rule
 */
export const updateRuleSchema = z.object({
  scope: z.enum(['global', 'context-specific']).optional(),
  trigger: ruleTriggerSchema.optional(),
  condition: ruleConditionSchema.optional(),
  action: ruleActionSchema.optional(),
});

/**
 * Input type for updating a rule
 */
export type UpdateRuleInput = z.infer<typeof updateRuleSchema>;
