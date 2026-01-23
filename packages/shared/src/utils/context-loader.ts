/**
 * Context Loader Utility
 * Loads contexts and formats them for LLM consumption
 */

import { Context, ContextBrief } from '../types/context';

export interface LLMContext {
  slug: string;
  role: string;
  objective: string;
  constraints: string | null;
  brief?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LLMContextCollection {
  contexts: LLMContext[];
  activeContext: LLMContext | null;
  totalCount: number;
  loadedAt: string;
}

/**
 * Format a single context for LLM consumption
 */
export function formatContextForLLM(
  context: Context,
  brief?: string
): LLMContext {
  return {
    slug: context.slug,
    role: context.role,
    objective: context.objective,
    constraints: context.constraints,
    brief,
    isActive: context.active,
    createdAt: context.created_at,
    updatedAt: context.updated_at,
  };
}

/**
 * Format multiple contexts for LLM consumption
 */
export function formatContextsForLLM(
  contexts: Context[],
  briefs?: Map<string, string>
): LLMContextCollection {
  const formattedContexts = contexts.map((context) =>
    formatContextForLLM(context, briefs?.get(context.slug))
  );

  const activeContext =
    formattedContexts.find((c) => c.isActive) || null;

  return {
    contexts: formattedContexts,
    activeContext,
    totalCount: contexts.length,
    loadedAt: new Date().toISOString(),
  };
}

/**
 * Format context for LLM prompt
 * Returns a human-readable string suitable for inclusion in prompts
 */
export function formatContextForPrompt(context: LLMContext): string {
  let prompt = `Context: ${context.slug}\n`;
  prompt += `Role: ${context.role}\n`;
  prompt += `Objective: ${context.objective}\n`;

  if (context.constraints) {
    prompt += `Constraints: ${context.constraints}\n`;
  }

  if (context.brief) {
    prompt += `\nBrief:\n${context.brief}\n`;
  }

  return prompt;
}

/**
 * Format all contexts for LLM prompt
 */
export function formatContextsForPrompt(
  collection: LLMContextCollection
): string {
  let prompt = `# Available Contexts (${collection.totalCount})\n\n`;

  if (collection.activeContext) {
    prompt += `## Active Context\n\n`;
    prompt += formatContextForPrompt(collection.activeContext);
    prompt += `\n---\n\n`;
  }

  const inactiveContexts = collection.contexts.filter((c) => !c.isActive);
  if (inactiveContexts.length > 0) {
    prompt += `## Other Contexts\n\n`;
    inactiveContexts.forEach((context, index) => {
      prompt += formatContextForPrompt(context);
      if (index < inactiveContexts.length - 1) {
        prompt += `\n---\n\n`;
      }
    });
  }

  return prompt;
}

/**
 * Get only the active context formatted for LLM
 */
export function getActiveContextForLLM(
  contexts: Context[],
  brief?: string
): LLMContext | null {
  const activeContext = contexts.find((c) => c.active);
  if (!activeContext) return null;

  return formatContextForLLM(activeContext, brief);
}

/**
 * Filter contexts by criteria
 */
export function filterContexts(
  contexts: Context[],
  criteria: {
    active?: boolean;
    slugs?: string[];
  }
): Context[] {
  let filtered = contexts;

  if (criteria.active !== undefined) {
    filtered = filtered.filter((c) => c.active === criteria.active);
  }

  if (criteria.slugs && criteria.slugs.length > 0) {
    filtered = filtered.filter((c) => criteria.slugs!.includes(c.slug));
  }

  return filtered;
}

/**
 * Sort contexts by various criteria
 */
export function sortContexts(
  contexts: Context[],
  sortBy: 'created' | 'updated' | 'slug' = 'updated',
  order: 'asc' | 'desc' = 'desc'
): Context[] {
  const sorted = [...contexts];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'created':
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'updated':
        comparison =
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
      case 'slug':
        comparison = a.slug.localeCompare(b.slug);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
