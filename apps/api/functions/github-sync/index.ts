import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * GitHub Sync Edge Function
 * Syncs context briefs to GitHub as Markdown files
 */

interface Context {
  id: string;
  slug: string;
  role: string;
  objective: string;
  constraints: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface SyncRequest {
  contextId: string;
  action: 'create' | 'update' | 'delete';
}

/**
 * Generate Markdown content for a context
 */
function generateContextMarkdown(context: Context): string {
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
 * Get file SHA from GitHub
 */
async function getFileSha(
  owner: string,
  repo: string,
  path: string,
  token: string,
  branch: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
 * Create or update file in GitHub
 */
async function syncToGitHub(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  token: string,
  branch: string,
  sha?: string
): Promise<void> {
  const body: Record<string, unknown> = {
    message,
    content: btoa(content),
    branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to sync to GitHub: ${errorData.message || response.statusText}`
    );
  }
}

/**
 * Delete file from GitHub
 */
async function deleteFromGitHub(
  owner: string,
  repo: string,
  path: string,
  token: string,
  branch: string
): Promise<void> {
  const sha = await getFileSha(owner, repo, path, token, branch);

  if (!sha) {
    // File doesn't exist, nothing to delete
    return;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Delete context: ${path}`,
        sha,
        branch,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to delete from GitHub: ${errorData.message || response.statusText}`
    );
  }
}

serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    const githubOwner = Deno.env.get('GITHUB_REPO_OWNER') || 'mattlim-fl';
    const githubRepo = Deno.env.get('GITHUB_REPO_NAME') || 'personal-os';
    const githubBranch = Deno.env.get('GITHUB_BRANCH') || 'main';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase configuration' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: 'Missing GitHub token' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const body: SyncRequest = await req.json();
    const { contextId, action } = body;

    if (!contextId || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing contextId or action' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch context from database
    const { data: context, error: fetchError } = await supabase
      .from('contexts')
      .select('*')
      .eq('id', contextId)
      .single();

    if (fetchError || !context) {
      return new Response(
        JSON.stringify({ error: 'Context not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const path = `contexts/${context.slug}.md`;

    // Perform the requested action
    if (action === 'delete') {
      await deleteFromGitHub(githubOwner, githubRepo, path, githubToken, githubBranch);
    } else {
      const content = generateContextMarkdown(context);
      const sha = await getFileSha(githubOwner, githubRepo, path, githubToken, githubBranch);
      const message = sha
        ? `Update context: ${context.slug}`
        : `Create context: ${context.slug}`;

      await syncToGitHub(
        githubOwner,
        githubRepo,
        path,
        content,
        message,
        githubToken,
        githubBranch,
        sha || undefined
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Context ${action}d successfully`,
        context: context.slug,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('GitHub sync error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
