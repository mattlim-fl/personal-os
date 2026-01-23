/**
 * Notion Integration Service
 *
 * Fetches goals/tasks from a Notion page for the Morning Briefing.
 * Works with toggle headings containing weekly goals and to-do items.
 * Uses an internal integration token (no OAuth required).
 */

import { Client } from '@notionhq/client';
import type { NotionGoal, GoalsBriefing, NotionConnectionStatus } from '@personal-os/shared';

export interface NotionConfig {
  apiKey: string;
  pageId: string;
}

/**
 * Extract plain text from rich text array
 */
function extractText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map((t) => t.plain_text || '').join('');
}

/**
 * Determine status from emoji markers in text
 * ✅ = done, ❌ = failed/done, ⏳ = in_progress, none = todo
 */
function parseStatusFromText(text: string): { status: 'todo' | 'in_progress' | 'done'; cleanTitle: string } {
  if (text.includes('✅')) {
    return { status: 'done', cleanTitle: text.replace(/✅/g, '').trim() };
  }
  if (text.includes('❌')) {
    return { status: 'done', cleanTitle: text.replace(/❌/g, '').trim() }; // Failed = also done
  }
  if (text.includes('⏳') || text.includes('🔄')) {
    return { status: 'in_progress', cleanTitle: text.replace(/[⏳🔄]/g, '').trim() };
  }
  return { status: 'todo', cleanTitle: text };
}

/**
 * Notion Service for fetching goals from pages
 */
export class NotionService {
  private client: Client;
  private pageId: string;

  constructor(config: NotionConfig) {
    this.client = new Client({ auth: config.apiKey });
    this.pageId = config.pageId;
  }

  /**
   * Get connection status
   */
  async getStatus(): Promise<NotionConnectionStatus> {
    try {
      const page = await this.client.pages.retrieve({
        page_id: this.pageId,
      });

      // Get page title from properties
      let title = 'Goals Page';
      const props = (page as any).properties;
      if (props?.title?.title) {
        title = extractText(props.title.title);
      } else if (props?.Name?.title) {
        title = extractText(props.Name.title);
      }

      return {
        connected: true,
        databaseId: this.pageId,
        databaseName: title,
      };
    } catch (error) {
      console.error('Error checking Notion status:', error);
      return {
        connected: false,
      };
    }
  }

  /**
   * Fetch children of a block
   */
  private async fetchChildren(blockId: string): Promise<any[]> {
    const response = await this.client.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    });
    return response.results;
  }

  /**
   * Fetch goals from the most recent weekly planning section
   */
  async getGoals(): Promise<NotionGoal[]> {
    try {
      // Get top-level blocks
      const topBlocks = await this.fetchChildren(this.pageId);
      const goals: NotionGoal[] = [];

      // Find the first heading_2 with children (most recent week)
      const recentWeek = topBlocks.find(
        (block) => block.type === 'heading_2' && block.has_children
      );

      if (!recentWeek) {
        return goals;
      }

      const weekTitle = extractText(recentWeek.heading_2?.rich_text);

      // Fetch the children of this week's section
      const weekBlocks = await this.fetchChildren(recentWeek.id);

      let currentSection: string | undefined;

      for (const block of weekBlocks) {
        const blockType = block.type;

        // Track section headers (Weekly Goals, Weekly Goal Signals, etc.)
        if (blockType === 'heading_2' || blockType === 'heading_3') {
          currentSection = extractText(block[blockType]?.rich_text);
          continue;
        }

        // Extract numbered list items as main weekly goals
        if (blockType === 'numbered_list_item') {
          const text = extractText(block.numbered_list_item?.rich_text);
          if (!text) continue;

          const { status, cleanTitle } = parseStatusFromText(text);

          goals.push({
            id: block.id,
            title: cleanTitle,
            status,
            project: weekTitle,
            url: `https://notion.so/${this.pageId.replace(/-/g, '')}#${block.id.replace(/-/g, '')}`,
          });
          continue;
        }

        // Extract to-do items (habit trackers / signals)
        if (blockType === 'to_do') {
          const todo = block.to_do;
          const text = extractText(todo?.rich_text);
          if (!text) continue;

          // For to-do items, use the checkbox state
          const isChecked = todo?.checked || false;
          const { cleanTitle } = parseStatusFromText(text);

          goals.push({
            id: block.id,
            title: cleanTitle,
            status: isChecked ? 'done' : 'todo',
            project: currentSection || 'Habits',
            url: `https://notion.so/${this.pageId.replace(/-/g, '')}#${block.id.replace(/-/g, '')}`,
          });
        }
      }

      return goals;
    } catch (error) {
      console.error('Error fetching Notion goals:', error);
      throw error;
    }
  }

  /**
   * Get goals briefing for the dashboard
   */
  async getGoalsBriefing(): Promise<GoalsBriefing> {
    const goals = await this.getGoals();

    const todoGoals = goals.filter((g) => g.status === 'todo');
    const inProgressGoals = goals.filter((g) => g.status === 'in_progress');
    const doneGoals = goals.filter((g) => g.status === 'done');

    // Sort: in_progress first, then todo
    const activeGoals = [...inProgressGoals, ...todoGoals];

    return {
      goals: activeGoals,
      todoCount: todoGoals.length,
      inProgressCount: inProgressGoals.length,
      doneCount: doneGoals.length,
      dueToday: [],
      overdue: [],
    };
  }
}

/**
 * Create Notion service from environment variables
 */
export function createNotionService(): NotionService {
  const apiKey = process.env.NOTION_API_KEY;
  const pageId = process.env.NOTION_PAGE_ID || process.env.NOTION_DATABASE_ID;

  if (!apiKey) {
    throw new Error('NOTION_API_KEY environment variable is required');
  }

  if (!pageId) {
    throw new Error('NOTION_PAGE_ID environment variable is required');
  }

  return new NotionService({ apiKey, pageId });
}
