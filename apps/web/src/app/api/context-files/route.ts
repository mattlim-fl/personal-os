import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  type ContextFilesResponse,
  type ProjectFile,
  type ProjectStatus,
  type ApiResponse,
} from '@personal-os/shared';

export const dynamic = 'force-dynamic';

// Get the context directory path (relative to project root)
function getContextPath(): string {
  // In development, we're in apps/web, so go up to project root
  return path.join(process.cwd(), '..', '..', 'context');
}

// Parse project status from markdown content
function parseProjectStatus(content: string): ProjectStatus {
  const statusMatch = content.match(/##\s*Status\s*\n+([^\n#]+)/i);
  if (statusMatch) {
    const status = statusMatch[1].trim().toLowerCase();
    if (status.includes('active')) return 'Active';
    if (status.includes('incoming')) return 'Incoming';
    if (status.includes('winding')) return 'Winding Down';
  }
  return 'Active'; // Default
}

// Parse project name from markdown title or filename
function parseProjectName(slug: string, content: string): string {
  const titleMatch = content.match(/^#\s+([^\n]+)/);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  // Convert slug to title case
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Parse overview from markdown content
function parseOverview(content: string): string {
  const overviewMatch = content.match(/##\s*Overview\s*\n+([^\n#]+)/i);
  if (overviewMatch) {
    return overviewMatch[1].trim();
  }
  // Fallback: get first paragraph after title
  const paragraphMatch = content.match(/^#[^\n]+\n+([^\n#]+)/);
  return paragraphMatch ? paragraphMatch[1].trim() : '';
}

// Read a single context file
async function readContextFile(filePath: string, slug: string) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    return {
      slug,
      content,
      lastModified: stats.mtime.toISOString(),
    };
  } catch {
    return {
      slug,
      content: '',
      lastModified: new Date().toISOString(),
    };
  }
}

// Read all project files from the projects directory
async function readProjectFiles(projectsDir: string): Promise<ProjectFile[]> {
  try {
    const files = await fs.readdir(projectsDir);
    const mdFiles = files.filter((f) => f.endsWith('.md'));

    const projects = await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = path.join(projectsDir, file);
        const slug = file.replace('.md', '');
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);

        return {
          slug,
          name: parseProjectName(slug, content),
          status: parseProjectStatus(content),
          overview: parseOverview(content),
          content,
          lastModified: stats.mtime.toISOString(),
        };
      })
    );

    // Sort by status: Active first, then Incoming, then Winding Down
    const statusOrder: Record<ProjectStatus, number> = {
      Active: 0,
      Incoming: 1,
      'Winding Down': 2,
    };
    return projects.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const contextPath = getContextPath();

    // Read all context files in parallel
    const [global, currentState, preferences, projects] = await Promise.all([
      readContextFile(path.join(contextPath, 'global.md'), 'global'),
      readContextFile(path.join(contextPath, 'current-state.md'), 'current-state'),
      readContextFile(path.join(contextPath, 'preferences.md'), 'preferences'),
      readProjectFiles(path.join(contextPath, 'projects')),
    ]);

    const response: ContextFilesResponse = {
      global,
      currentState,
      preferences,
      projects,
    };

    return NextResponse.json<ApiResponse<ContextFilesResponse>>(
      { data: response, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        error: error instanceof Error ? error.message : 'Failed to read context files',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
