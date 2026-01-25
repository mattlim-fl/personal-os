import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { updateWorkTaskSchema } from '@personal-os/shared';
import { getProjectsConfig } from '@/lib/integrations/github-activity';

interface TaskWithSource {
  source_type: string | null;
  source_id: string | null;
  source_url: string | null;
}

async function syncBackCompletion(task: TaskWithSource) {
  if (task.source_type === 'todoist' && task.source_id) {
    const token = process.env.TODOIST_API_TOKEN;
    if (!token) return;
    await fetch(`https://api.todoist.com/rest/v2/tasks/${task.source_id}/close`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (task.source_type === 'github' && task.source_id) {
    // Only close issues, not PRs (completing a PR review != closing it)
    if (!task.source_url?.includes('/issues/')) return;

    // source_id format: "owner/repo#number"
    const match = task.source_id.match(/^(.+?)\/(.+?)#(\d+)$/);
    if (!match) return;
    const [, owner, repo, number] = match;

    // Resolve per-repo token from config
    const projects = getProjectsConfig();
    const repoConfig = projects
      .flatMap((p) => p.repos)
      .find((r) => r.owner === owner && r.repo === repo);
    if (!repoConfig) return;

    const token = process.env[repoConfig.tokenEnv];
    if (!token) return;

    await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({ state: 'closed' }),
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateWorkTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('work_tasks')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sync back to source on completion (non-blocking)
  if (parsed.data.status === 'done' && data.source_id) {
    syncBackCompletion(data).catch((err) =>
      console.error('Sync-back failed (non-blocking):', err)
    );
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase.from('work_tasks').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
