'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  User,
  Menu,
  X,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavSection {
  name: string;
  basePath: string;
  icon: React.ElementType;
  links: { label: string; href: string }[];
}

const navSections: NavSection[] = [
  {
    name: 'Sophie de Kok',
    basePath: '/interview/hg-capital/sophie',
    icon: User,
    links: [
      { label: 'Full Prep', href: '/interview/hg-capital/sophie' },
    ],
  },
  {
    name: 'Nick Barrington',
    basePath: '/interview/hg-capital/nick',
    icon: User,
    links: [
      { label: 'Full Prep', href: '/interview/hg-capital/nick' },
    ],
  },
];

function NavSectionComponent({ section, isExpanded, onToggle }: {
  section: NavSection;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(section.basePath) ?? false;
  const Icon = section.icon;

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300'
            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{section.name}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {section.links.map((link) => {
            const isLinkActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-1.5 rounded-md text-sm transition-colors',
                  isLinkActive
                    ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Sidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // Auto-expand the section that contains the current path
    const activeSection = navSections.find(s => pathname?.startsWith(s.basePath) ?? false);
    return activeSection ? [activeSection.name] : [navSections[0]?.name || ''];
  });

  const toggleSection = (name: string) => {
    setExpandedSections(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  return (
    <aside className={cn('flex flex-col', className)}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center justify-between">
          <Link
            href="/interview/hg-capital"
            className="flex items-center gap-2 text-surface-900 dark:text-surface-50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Building2 className="w-5 h-5" />
            <span className="font-semibold">Hg Capital</span>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          Interview Prep
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-3">
          <Link
            href="/interview/hg-capital"
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === '/interview/hg-capital'
                ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
            )}
          >
            Overview
          </Link>
        </div>

        <div className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider px-3 mb-2">
          Interviewers
        </div>

        {navSections.map((section) => (
          <NavSectionComponent
            key={section.name}
            section={section}
            isExpanded={expandedSections.includes(section.name)}
            onToggle={() => toggleSection(section.name)}
          />
        ))}
      </nav>
    </aside>
  );
}

export default function HgCapitalLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex w-64 border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 sticky top-[60px] h-[calc(100vh-60px)]" />

      {/* Mobile Menu Button - Fixed position */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-40 p-3 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-surface-950 transform transition-transform duration-200 ease-in-out',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar onClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
