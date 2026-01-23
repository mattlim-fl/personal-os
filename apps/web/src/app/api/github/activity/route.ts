import { NextResponse } from 'next/server';
import {
  createGitHubActivityService,
  getProjectsConfig,
} from '@/lib/integrations/github-activity';
import type { ApiResponse, GitHubActivityBriefing } from '@personal-os/shared';

/**
 * GET /api/github/activity
 * Fetch GitHub activity for the Morning Briefing
 */
export async function GET() {
  try {
    const projects = getProjectsConfig();

    if (projects.length === 0) {
      return NextResponse.json<ApiResponse<GitHubActivityBriefing>>(
        {
          data: {
            projects: [],
            repos: [],
            needsAttention: {
              stalePRs: [],
              prsAwaitingYourReview: [],
              yourPRsAwaitingReview: [],
              unassignedIssues: [],
            },
            totalPRsMerged: 0,
            totalPRsOpened: 0,
            totalCommits: 0,
            period: 'Last 24 hours',
          },
          message: 'No GitHub projects configured. Edit config/github-projects.json to add repos.',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    const activityService = createGitHubActivityService();
    const briefing = await activityService.getActivityBriefing(projects);

    return NextResponse.json<ApiResponse<GitHubActivityBriefing>>(
      {
        data: briefing,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch activity';

    return NextResponse.json<ApiResponse>(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
