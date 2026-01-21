/**
 * Notion Integration
 *
 * Handles fetching data from Notion pages, specifically the Weekly Tracker.
 */

export interface NotionConfig {
  apiKey: string;
}

export interface WeeklyGoals {
  goals: string[];
  goalSignals: Array<{ text: string; checked: boolean }>;
}

export interface DailyOutcomeLine {
  text: string;
  completed: boolean;
  date: string;
}

export interface WeeklyTrackerData {
  weeklyGoals: WeeklyGoals;
  yesterdayIncomplete: DailyOutcomeLine[];
}

export class NotionService {
  private apiKey: string;
  private baseUrl = 'https://api.notion.com/v1';

  constructor(config: NotionConfig) {
    this.apiKey = config.apiKey;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get block children (content) of a page or block
   */
  async getBlockChildren(blockId: string): Promise<unknown[]> {
    const blocks: unknown[] = [];
    let cursor: string | undefined;

    do {
      const params = cursor ? `?start_cursor=${cursor}` : '';
      const response = await this.fetch(`/blocks/${blockId}/children${params}`);
      blocks.push(...response.results);
      cursor = response.has_more ? response.next_cursor : undefined;
    } while (cursor);

    return blocks;
  }

  /**
   * Get a page's properties
   */
  async getPage(pageId: string): Promise<unknown> {
    return this.fetch(`/pages/${pageId}`);
  }

  /**
   * Query a database
   */
  async queryDatabase(databaseId: string, filter?: unknown): Promise<unknown[]> {
    const response = await this.fetch(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({ filter }),
    });
    return response.results;
  }

  /**
   * Extract plain text from Notion rich text array
   */
  extractText(richText: Array<{ plain_text: string }>): string {
    return richText?.map((t) => t.plain_text).join('') || '';
  }

  /**
   * Parse the Weekly Tracker page structure
   * This will need to be adjusted based on actual page structure
   */
  async getWeeklyTrackerData(pageId: string): Promise<WeeklyTrackerData> {
    const blocks = await this.getBlockChildren(pageId);

    const weeklyGoals: WeeklyGoals = {
      goals: [],
      goalSignals: [],
    };
    const yesterdayIncomplete: DailyOutcomeLine[] = [];

    let currentSection = '';

    for (const block of blocks as Array<{
      type: string;
      [key: string]: unknown;
    }>) {
      // Detect section headers
      if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
        const headingData = block[block.type] as { rich_text: Array<{ plain_text: string }> };
        const text = this.extractText(headingData.rich_text).toLowerCase();

        if (text.includes('weekly goal') || text.includes('this week will be successful')) {
          currentSection = 'weekly_goals';
        } else if (text.includes('goal signal')) {
          currentSection = 'goal_signals';
        } else if (text.includes('daily') || text.includes('outcome')) {
          currentSection = 'daily_outcomes';
        } else {
          currentSection = '';
        }
        continue;
      }

      // Process content based on current section
      if (currentSection === 'weekly_goals') {
        if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
          const listData = block[block.type] as { rich_text: Array<{ plain_text: string }> };
          const text = this.extractText(listData.rich_text);
          if (text) weeklyGoals.goals.push(text);
        } else if (block.type === 'paragraph') {
          const paraData = block.paragraph as { rich_text: Array<{ plain_text: string }> };
          const text = this.extractText(paraData.rich_text);
          // Check if it's a numbered goal like "1. Goal text"
          if (text && /^\d+\./.test(text)) {
            weeklyGoals.goals.push(text);
          }
        }
      }

      if (currentSection === 'goal_signals') {
        if (block.type === 'to_do') {
          const todoData = block.to_do as {
            rich_text: Array<{ plain_text: string }>;
            checked: boolean;
          };
          const text = this.extractText(todoData.rich_text);
          weeklyGoals.goalSignals.push({
            text,
            checked: todoData.checked || false,
          });
        }
      }

      // For daily outcomes, we'll need to look for yesterday's section
      // This depends on how the page is structured - might be a database or toggle
      if (currentSection === 'daily_outcomes' && block.type === 'to_do') {
        const todoData = block.to_do as {
          rich_text: Array<{ plain_text: string }>;
          checked: boolean;
        };
        if (!todoData.checked) {
          yesterdayIncomplete.push({
            text: this.extractText(todoData.rich_text),
            completed: false,
            date: 'yesterday',
          });
        }
      }
    }

    return {
      weeklyGoals,
      yesterdayIncomplete,
    };
  }
}
