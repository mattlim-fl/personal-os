import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createGitHubActivityService,
  getProjectsConfig,
} from '@/lib/integrations/github-activity';
import { createTodoistService } from '@/lib/integrations/todoist';
import type { ImportableItem } from '@personal-os/shared';

const LIFE_PROJECTS = ['Goose + Moose tasks'];

export async function GET() {
  try {
    // Get already-imported source IDs for deduplication
    const { data: existingTasks } = await supabase
      .from('work_tasks')
      .select('source_type, source_id')
      .not('source_id', 'is', null);

    const importedKeys = new Set(
      (existingTasks || []).map((t) => `${t.source_type}:${t.source_id}`)
    );

    const items: ImportableItem[] = [];

    // Fetch GitHub items
    try {
      const projects = getProjectsConfig();
      if (projects.length > 0) {
        const activityService = createGitHubActivityService();
        const briefing = await activityService.getActivityBriefing(projects);

        const { prsAwaitingYourReview, stalePRs, unassignedIssues } =
          briefing.needsAttention;

        for (const pr of prsAwaitingYourReview) {
          const sourceId = `${pr.repo}#${pr.number}`;
          if (importedKeys.has(`github:${sourceId}`)) continue;
          items.push({
            source_type: 'github',
            source_id: sourceId,
            title: pr.title,
            source_url: pr.url,
            metadata: { repo: pr.repo, type: 'pr' },
          });
        }

        for (const pr of stalePRs) {
          const sourceId = `${pr.repo}#${pr.number}`;
          if (importedKeys.has(`github:${sourceId}`)) continue;
          // Skip if already added from prsAwaitingYourReview
          if (items.some((i) => i.source_id === sourceId)) continue;
          items.push({
            source_type: 'github',
            source_id: sourceId,
            title: pr.title,
            source_url: pr.url,
            metadata: { repo: pr.repo, type: 'pr' },
          });
        }

        for (const issue of unassignedIssues) {
          const sourceId = `${issue.repo}#${issue.number}`;
          if (importedKeys.has(`github:${sourceId}`)) continue;
          items.push({
            source_type: 'github',
            source_id: sourceId,
            title: issue.title,
            source_url: issue.url,
            metadata: { repo: issue.repo, type: 'issue' },
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch GitHub importable items:', err);
    }

    // Fetch Todoist items
    try {
      const todoistService = createTodoistService();
      const briefing = await todoistService.getTaskBriefing();

      // Filter to work projects only (exclude life projects)
      const workTasks = briefing.byProject
        .filter((group) => !LIFE_PROJECTS.includes(group.projectName))
        .flatMap((group) => group.tasks);

      for (const task of workTasks) {
        if (importedKeys.has(`todoist:${task.id}`)) continue;
        items.push({
          source_type: 'todoist',
          source_id: task.id,
          title: task.content,
          source_url: task.url,
          due_date: task.due?.date || null,
          metadata: { priority: task.priority },
        });
      }
    } catch (err) {
      console.error('Failed to fetch Todoist importable items:', err);
    }

    return NextResponse.json({ data: items });
  } catch (error) {
    console.error('Error in importable endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch importable items' },
      { status: 500 }
    );
  }
}
