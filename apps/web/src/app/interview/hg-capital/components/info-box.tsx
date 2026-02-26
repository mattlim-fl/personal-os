'use client';

import { ExternalLink } from 'lucide-react';

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'amber';
  links?: { label: string; href: string }[];
}

export function InfoBox({ title, children, variant = 'default', links }: InfoBoxProps) {
  const variants = {
    default: 'bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700',
    primary: 'bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800',
    amber: 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800',
  };

  const titleColors = {
    default: 'text-surface-900 dark:text-surface-100',
    primary: 'text-primary-900 dark:text-primary-100',
    amber: 'text-amber-900 dark:text-amber-100',
  };

  return (
    <div className={`rounded-xl p-4 ${variants[variant]}`}>
      <h4 className={`font-semibold mb-2 ${titleColors[variant]}`}>{title}</h4>
      <div className="text-sm text-surface-700 dark:text-surface-300">{children}</div>
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
