/**
 * GitHub Activity Service
 *
 * Fetches GitHub activity data for the Morning Briefing.
 * Uses shared project config from config/github-projects.json.
 */

import type {
  GitHubActivityBriefing,
  GitHubPR,
  GitHubIssue,
  RepoActivity,
  NeedsAttention,
  GitHubProject,
  GitHubProjectsConfig,
  ProjectActivity,
} from '@personal-os/shared';
import projectsConfig from '@config/github-projects.json';

interface GitHubAPIConfig {
  username?: string;
  resolveToken: (tokenEnv: string) => string | undefined;
}

/**
 * GitHub Activity Service
 */
export class GitHubActivityService {
  private baseUrl = 'https://api.github.com';

  constructor(private config: GitHubAPIConfig) {}

  /**
   * Fetch JSON from GitHub API using the token for a given env var
   */
  private async fetchGitHub<T>(url: string, tokenEnv: string): Promise<T> {
    const token = this.config.resolveToken(tokenEnv);
    if (!token) {
      throw new Error(`Token not found for env var: ${tokenEnv}`);
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Calculate days since a date
   */
  private daysSince(dateStr: string): number {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Fetch PRs for a repo
   */
  private async fetchRepoPRs(
    owner: string,
    repo: string,
    tokenEnv: string,
    since: Date
  ): Promise<{
    merged: GitHubPR[];
    opened: GitHubPR[];
    all: GitHubPR[];
  }> {
    const fullName = `${owner}/${repo}`;

    const closedPRs = await this.fetchGitHub<any[]>(
      `${this.baseUrl}/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=50`,
      tokenEnv
    );

    const openPRs = await this.fetchGitHub<any[]>(
      `${this.baseUrl}/repos/${owner}/${repo}/pulls?state=open&sort=updated&direction=desc&per_page=50`,
      tokenEnv
    );

    const merged: GitHubPR[] = [];
    const opened: GitHubPR[] = [];
    const all: GitHubPR[] = [];

    for (const pr of closedPRs) {
      if (pr.merged_at && new Date(pr.merged_at) >= since) {
        const ghPR: GitHubPR = {
          id: pr.id,
          number: pr.number,
          title: pr.title,
          state: 'closed',
          merged: true,
          url: pr.html_url,
          author: pr.user.login,
          createdAt: pr.created_at,
          mergedAt: pr.merged_at,
          repo: fullName,
          daysOld: this.daysSince(pr.created_at),
          authoredByUser: pr.user.login === this.config.username,
        };
        merged.push(ghPR);
        all.push(ghPR);
      }
    }

    for (const pr of openPRs) {
      const ghPR: GitHubPR = {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: 'open',
        merged: false,
        url: pr.html_url,
        author: pr.user.login,
        createdAt: pr.created_at,
        repo: fullName,
        daysOld: this.daysSince(pr.created_at),
        reviewRequested: pr.requested_reviewers?.some(
          (r: any) => r.login === this.config.username
        ),
        authoredByUser: pr.user.login === this.config.username,
      };
      all.push(ghPR);

      if (new Date(pr.created_at) >= since) {
        opened.push(ghPR);
      }
    }

    return { merged, opened, all };
  }

  /**
   * Fetch commits for a repo
   */
  private async fetchRepoCommits(
    owner: string,
    repo: string,
    tokenEnv: string,
    since: Date
  ): Promise<number> {
    const commits = await this.fetchGitHub<any[]>(
      `${this.baseUrl}/repos/${owner}/${repo}/commits?since=${since.toISOString()}&per_page=100`,
      tokenEnv
    );

    const directCommits = commits.filter(
      (c) =>
        !c.commit.message.startsWith('Merge pull request') &&
        !c.commit.message.startsWith('Merge branch')
    );

    return directCommits.length;
  }

  /**
   * Fetch open issues for a repo
   */
  private async fetchRepoIssues(
    owner: string,
    repo: string,
    tokenEnv: string
  ): Promise<GitHubIssue[]> {
    const fullName = `${owner}/${repo}`;

    const issues = await this.fetchGitHub<any[]>(
      `${this.baseUrl}/repos/${owner}/${repo}/issues?state=open&sort=updated&direction=desc&per_page=30`,
      tokenEnv
    );

    return issues
      .filter((i) => !i.pull_request)
      .map((issue) => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        state: 'open' as const,
        url: issue.html_url,
        author: issue.user.login,
        createdAt: issue.created_at,
        repo: fullName,
        labels: issue.labels?.map((l: any) => l.name) || [],
        assignee: issue.assignee?.login,
        daysOld: this.daysSince(issue.created_at),
      }));
  }

  /**
   * Get activity briefing for configured projects
   */
  async getActivityBriefing(projects: GitHubProject[]): Promise<GitHubActivityBriefing> {
    const hoursAgo = 24;
    const since = new Date();
    since.setHours(since.getHours() - hoursAgo);

    const projectActivities: ProjectActivity[] = [];
    const allRepoActivities: RepoActivity[] = [];
    const allPRs: GitHubPR[] = [];
    const allIssues: GitHubIssue[] = [];
    let totalPRsMerged = 0;
    let totalPRsOpened = 0;
    let totalCommits = 0;

    for (const project of projects) {
      const projectRepos: RepoActivity[] = [];
      let projectMerged = 0;
      let projectOpened = 0;
      let projectCommits = 0;

      for (const repoConfig of project.repos) {
        const { owner, repo, label, tokenEnv } = repoConfig;
        const fullName = `${owner}/${repo}`;

        try {
          const { merged, opened, all } = await this.fetchRepoPRs(owner, repo, tokenEnv, since);
          allPRs.push(...all);
          projectMerged += merged.length;
          projectOpened += opened.length;

          const commitsCount = await this.fetchRepoCommits(owner, repo, tokenEnv, since);
          projectCommits += commitsCount;

          const issues = await this.fetchRepoIssues(owner, repo, tokenEnv);
          allIssues.push(...issues);

          const repoActivity: RepoActivity = {
            name: label || repo,
            fullName,
            url: `https://github.com/${fullName}`,
            prsOpened: opened.length,
            prsMerged: merged.length,
            commitsCount,
            prsWaitingReview: all.filter(
              (pr) => pr.state === 'open' && pr.reviewRequested
            ),
          };

          projectRepos.push(repoActivity);
          allRepoActivities.push(repoActivity);
        } catch (error) {
          console.error(`Error fetching activity for ${fullName}:`, error);
        }
      }

      totalPRsMerged += projectMerged;
      totalPRsOpened += projectOpened;
      totalCommits += projectCommits;

      projectActivities.push({
        name: project.name,
        repos: projectRepos,
        totalPRsMerged: projectMerged,
        totalPRsOpened: projectOpened,
        totalCommits: projectCommits,
      });
    }

    const staleThresholdDays = 3;
    const needsAttention: NeedsAttention = {
      stalePRs: allPRs.filter(
        (pr) => pr.state === 'open' && pr.daysOld >= staleThresholdDays
      ),
      prsAwaitingYourReview: allPRs.filter(
        (pr) => pr.state === 'open' && pr.reviewRequested
      ),
      yourPRsAwaitingReview: allPRs.filter(
        (pr) => pr.state === 'open' && pr.authoredByUser && !pr.merged
      ),
      unassignedIssues: allIssues.filter((issue) => !issue.assignee),
    };

    return {
      projects: projectActivities,
      repos: allRepoActivities,
      needsAttention,
      totalPRsMerged,
      totalPRsOpened,
      totalCommits,
      period: 'Last 24 hours',
    };
  }
}

/**
 * Get projects config from shared JSON file
 */
export function getProjectsConfig(): GitHubProject[] {
  return (projectsConfig as GitHubProjectsConfig).projects;
}

/**
 * Create GitHub Activity service from environment
 */
export function createGitHubActivityService(): GitHubActivityService {
  return new GitHubActivityService({
    username: process.env.GITHUB_USERNAME,
    resolveToken: (tokenEnv: string) => process.env[tokenEnv],
  });
}
