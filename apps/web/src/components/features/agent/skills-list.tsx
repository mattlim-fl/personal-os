'use client';

import { Wrench, FolderOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

const bundledSkills = [
  '1password', 'blogwatcher', 'coding-agent', 'gh-issues', 'github',
  'healthcheck', 'himalaya', 'nano-pdf', 'openai-image-gen', 'openai-whisper',
  'openai-whisper-api', 'skill-creator', 'summarize', 'tmux', 'video-frames',
  'wacli', 'weather', 'acp-router',
];

const workspaceSkills = [
  'todoist', 'notion', 'agent-team-orchestration', 'self-improving-agent',
  'data-analysis', 'google-calendar', 'repo-agent-audit', 'repo-agent-bootstrap',
];

export function SkillsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {/* Bundled */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-4 w-4 text-surface-400" />
              <h3 className="text-sm font-medium text-surface-600 dark:text-surface-300">
                Bundled
              </h3>
              <Badge variant="default" size="sm">
                {bundledSkills.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {bundledSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md bg-surface-100 dark:bg-surface-800 text-xs font-mono text-surface-600 dark:text-surface-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Workspace */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="h-4 w-4 text-primary-500" />
              <h3 className="text-sm font-medium text-surface-600 dark:text-surface-300">
                Workspace
              </h3>
              <Badge variant="info" size="sm">
                {workspaceSkills.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {workspaceSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md bg-primary-50 dark:bg-primary-950/30 text-xs font-mono text-primary-700 dark:text-primary-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
