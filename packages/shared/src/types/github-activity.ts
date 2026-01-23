/**
 * GitHub Activity types for Morning Briefing
 */

/**
 * A repo entry within a project, with token env var reference
 */
export interface GitHubProjectRepo {
  owner: string;
  repo: string;
  label?: string;
  tokenEnv: string;
}

/**
 * A project groups related repos (e.g., frontend + backend)
 */
export interface GitHubProject {
  name: string;
  repos: GitHubProjectRepo[];
}

/**
 * Root config shape for github-projects.json
 */
export interface GitHubProjectsConfig {
  projects: GitHubProject[];
}

/**
 * Pull request summary
 */
export interface GitHubPR {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  merged: boolean;
  url: string;
  author: string;
  createdAt: string;
  mergedAt?: string;
  repo: string;
  daysOld: number;
  reviewRequested?: boolean;
  authoredByUser?: boolean;
}

/**
 * Issue summary
 */
export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  url: string;
  author: string;
  createdAt: string;
  repo: string;
  labels: string[];
  assignee?: string;
  daysOld: number;
}

/**
 * Repository activity summary
 */
export interface RepoActivity {
  name: string;
  fullName: string;
  url: string;
  prsOpened: number;
  prsMerged: number;
  commitsCount: number;
  prsWaitingReview: GitHubPR[];
}

/**
 * Project-level activity (groups multiple repos)
 */
export interface ProjectActivity {
  name: string;
  repos: RepoActivity[];
  totalPRsMerged: number;
  totalPRsOpened: number;
  totalCommits: number;
}

/**
 * Items needing attention
 */
export interface NeedsAttention {
  stalePRs: GitHubPR[];
  prsAwaitingYourReview: GitHubPR[];
  yourPRsAwaitingReview: GitHubPR[];
  unassignedIssues: GitHubIssue[];
}

/**
 * GitHub activity briefing for dashboard
 */
export interface GitHubActivityBriefing {
  projects: ProjectActivity[];
  repos: RepoActivity[];
  needsAttention: NeedsAttention;
  totalPRsMerged: number;
  totalPRsOpened: number;
  totalCommits: number;
  period: string;
}
