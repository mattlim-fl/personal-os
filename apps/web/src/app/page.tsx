'use client';

import { useState, useEffect } from 'react';
import {
  CalendarSection,
  GitHubSection,
  FocusSection,
  TodoistSection,
} from '@/components/features/briefing';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const [today, setToday] = useState('');
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setToday(
      now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    );
    setGreeting(getGreeting());
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
            {greeting}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
            Morning Briefing
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">{today}</p>
        </div>

        {/* Tier 1: Focus (Hero) */}
        <section className="mb-6">
          <FocusSection />
        </section>

        {/* Tier 2: Schedule + Goals (Twin Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <section>
            <CalendarSection />
          </section>
          <section>
            <TodoistSection mode="goals" />
          </section>
        </div>

        {/* Tier 3: Work Tasks | Life Admin */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <section>
            <TodoistSection mode="work" />
          </section>
          <section>
            <TodoistSection mode="life" />
          </section>
        </div>

        {/* Tier 4: GitHub (Needs Attention only) */}
        <section className="mb-6">
          <GitHubSection />
        </section>
      </div>
    </main>
  );
}
