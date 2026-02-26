'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Code2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

interface InterviewCardProps {
  name: string;
  role: string;
  focus: string;
  description: string;
  href: string;
  icon: React.ElementType;
  variant: 'primary' | 'secondary';
}

function InterviewCard({ name, role, focus, description, href, icon: Icon, variant }: InterviewCardProps) {
  const variants = {
    primary: 'border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/30',
    secondary: 'border-surface-200 dark:border-surface-700 hover:border-surface-400 dark:hover:border-surface-500 hover:bg-surface-50/50 dark:hover:bg-surface-800/50',
  };

  return (
    <Link href={href}>
      <Card className={`transition-all duration-200 cursor-pointer h-full ${variants[variant]}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${variant === 'primary' ? 'bg-primary-100 dark:bg-primary-950/50' : 'bg-surface-100 dark:bg-surface-800'}`}>
                <Icon className={`w-5 h-5 ${variant === 'primary' ? 'text-primary-600 dark:text-primary-400' : 'text-surface-600 dark:text-surface-400'}`} />
              </div>
              <div>
                <Badge variant={variant === 'primary' ? 'info' : 'default'} className="mb-1">
                  {name}
                </Badge>
                <CardTitle className="text-lg">{role}</CardTitle>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-surface-400 dark:text-surface-500" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            {focus}
          </p>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HgCapitalOverviewPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 md:py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm mb-2">
          <Sparkles className="w-4 h-4" />
          Interview Prep
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-2">
          Hg Capital
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400">
          AI Transformation Roles — Internal & Portfolio
        </p>
      </div>

      {/* Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InterviewCard
          name="Sophie de Kok"
          role="AI Transformation Specialist"
          focus="Internal: Transform how Hg itself operates"
          description="Internal fund transformation — applying AI to Hg's own operations, processes, and workflows."
          href="/interview/hg-capital/sophie"
          icon={Users}
          variant="primary"
        />

        <InterviewCard
          name="Nick Barrington"
          role="AI-First Engineering"
          focus="Portfolio: AI-first engineering across 58+ companies"
          description="Value Creation Data Team — implementing AI-first engineering practices across Hg's portfolio companies."
          href="/interview/hg-capital/nick"
          icon={Code2}
          variant="secondary"
        />
      </div>

      {/* Quick Context */}
      <div className="mt-8 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
        <h3 className="font-semibold text-surface-900 dark:text-surface-50 mb-3">About Hg</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-surface-500 dark:text-surface-400">Portfolio</p>
            <p className="font-medium text-surface-900 dark:text-surface-50">58+ companies</p>
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400">Catalyst Team</p>
            <p className="font-medium text-surface-900 dark:text-surface-50">80+ engineers</p>
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400">EBITDA Uplift</p>
            <p className="font-medium text-surface-900 dark:text-surface-50">$130m+</p>
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400">AI Products</p>
            <p className="font-medium text-surface-900 dark:text-surface-50">15+ launched</p>
          </div>
        </div>
      </div>
    </div>
  );
}
