/**
 * Rules Engine
 * 
 * Evaluates deterministic rules against inbox items to suggest actions.
 */

import type {
  Rule,
  RuleCondition,
  RuleEvaluationResult,
} from '../types/rules';
import type { InboxItem } from '../types/inbox';

/**
 * Extract domain from email address
 */
function extractDomain(email: string): string {
  const match = email.match(/@(.+)$/);
  return match ? match[1] : '';
}

/**
 * Evaluate a single condition against an inbox item
 */
function evaluateCondition(
  condition: RuleCondition,
  item: InboxItem
): boolean {
  let fieldValue: string = '';

  // Get the field value based on condition field
  switch (condition.field) {
    case 'sender':
      fieldValue = item.sender || '';
      break;
    case 'subject':
      fieldValue = item.subject || '';
      break;
    case 'domain':
      fieldValue = item.sender ? extractDomain(item.sender) : '';
      break;
    case 'body':
      fieldValue = item.body_preview || '';
      break;
    default:
      return false;
  }

  // Normalize for case-insensitive comparison
  const normalizedValue = fieldValue.toLowerCase();
  const normalizedConditionValue = condition.value.toLowerCase();

  // Evaluate based on operator
  switch (condition.operator) {
    case 'equals':
      return normalizedValue === normalizedConditionValue;
    
    case 'contains':
      return normalizedValue.includes(normalizedConditionValue);
    
    case 'starts_with':
      return normalizedValue.startsWith(normalizedConditionValue);
    
    case 'ends_with':
      return normalizedValue.endsWith(normalizedConditionValue);
    
    case 'matches':
      try {
        const regex = new RegExp(condition.value, 'i');
        return regex.test(fieldValue);
      } catch {
        // Invalid regex, return false
        return false;
      }
    
    default:
      return false;
  }
}

/**
 * Evaluate all rules against an inbox item
 * Returns the first matching rule or null
 */
export function evaluateRules(
  rules: Rule[],
  item: InboxItem
): RuleEvaluationResult {
  // Sort rules by creation date (older rules have priority)
  const sortedRules = [...rules].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Find first matching rule
  for (const rule of sortedRules) {
    // Check if trigger matches (currently only inbox_item_created)
    if (rule.trigger.type !== 'inbox_item_created') {
      continue;
    }

    // Evaluate condition
    if (evaluateCondition(rule.condition, item)) {
      return {
        matched: true,
        rule_id: rule.id,
        suggested_action: rule.action.type,
        context_id: rule.action.context_id,
        confidence: 1.0, // Deterministic rules have 100% confidence
      };
    }
  }

  // No matching rule
  return {
    matched: false,
    confidence: 0,
  };
}

/**
 * Evaluate a single rule against an inbox item
 */
export function evaluateRule(rule: Rule, item: InboxItem): boolean {
  if (rule.trigger.type !== 'inbox_item_created') {
    return false;
  }

  return evaluateCondition(rule.condition, item);
}

/**
 * Validate rule condition value based on field and operator
 */
export function validateRuleCondition(condition: RuleCondition): {
  valid: boolean;
  error?: string;
} {
  // Check if regex is valid for 'matches' operator
  if (condition.operator === 'matches') {
    try {
      new RegExp(condition.value);
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid regular expression',
      };
    }
  }

  // Check if value is not empty
  if (!condition.value || condition.value.trim() === '') {
    return {
      valid: false,
      error: 'Condition value cannot be empty',
    };
  }

  return { valid: true };
}
