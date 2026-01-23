/**
 * GitHub Integration Service
 * Handles syncing context briefs to GitHub as Markdown files
 */

import { Context } from '@personal-os/shared';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}

export interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
}

/**
 * GitHub Service for managing context briefs
 */
export class GitHubService {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = {
      ...config,
      branch: config.branch || 'main',
    };
  }

  /**
   * Generate Markdown content for a context
   */
  private generateContextMarkdown(context: Context): string {
    return `# ${context.slug}

**Slug**: ${context.slug}
**Role**: ${context.role}
**Active**: ${context.active ? 'Yes' : 'No'}

## Objective

${context.objective}

## Constraints

${context.constraints || 'None specified'}

## Current Priority

_To be updated_

## Open Decisions

_To be updated_

## Risks

_To be updated_

## Relevant Links

_To be updated_

---

*Last updated: ${new Date(context.updated_at).toLocaleString()}*
`;
  }

  /**
   * Get the SHA of an existing file
   */
  private async getFileSha(path: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.sha;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create or update a file in GitHub
   */
  private async createOrUpdateFile(
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<void> {
    const body: Record<string, unknown> = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch: this.config.branch,
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(
      `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create/update file: ${errorData.message || response.statusText}`
      );
    }
  }

  /**
   * Sync a context brief to GitHub
   */
  async syncContextBrief(context: Context): Promise<void> {
    const path = `contexts/${context.slug}.md`;
    const content = this.generateContextMarkdown(context);
    const sha = await this.getFileSha(path);

    const message = sha
      ? `Update context: ${context.slug}`
      : `Create context: ${context.slug}`;

    await this.createOrUpdateFile(path, content, message, sha || undefined);
  }

  /**
   * Load a context brief from GitHub
   */
  async loadContextBrief(slug: string): Promise<string | null> {
    try {
      const path = `contexts/${slug}.md`;
      const response = await fetch(
        `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete a context brief from GitHub
   */
  async deleteContextBrief(slug: string): Promise<void> {
    const path = `contexts/${slug}.md`;
    const sha = await this.getFileSha(path);

    if (!sha) {
      // File doesn't exist, nothing to delete
      return;
    }

    const response = await fetch(
      `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete context: ${slug}`,
          sha,
          branch: this.config.branch,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to delete file: ${errorData.message || response.statusText}`
      );
    }
  }

  /**
   * Create a context template (for new contexts)
   */
  createContextTemplate(slug: string, role: string, objective: string): string {
    return `# ${slug}

**Slug**: ${slug}
**Role**: ${role}
**Active**: No

## Objective

${objective}

## Constraints

_To be specified_

## Current Priority

_To be updated_

## Open Decisions

_To be updated_

## Risks

_To be updated_

## Relevant Links

_To be updated_
`;
  }

  /**
   * List all context files in the repo
   */
  async listContextBriefs(): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/contexts?ref=${this.config.branch}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.status === 404) {
        return [];
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data
        .filter((file: { name: string; type: string }) => 
          file.type === 'file' && file.name.endsWith('.md')
        )
        .map((file: { name: string }) => file.name.replace('.md', ''));
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return [];
      }
      throw error;
    }
  }
}

/**
 * Create a GitHub service instance from environment variables
 */
export function createGitHubService(): GitHubService {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || 'mattlim-fl';
  const repo = process.env.GITHUB_REPO_NAME || 'personal-os';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  return new GitHubService({ token, owner, repo, branch });
}
