'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
}

export function NavLink({ href, children, className, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-surface-900 dark:hover:text-surface-50',
        isActive ? 'text-surface-900 dark:text-surface-50 font-medium' : 'text-surface-500 dark:text-surface-400',
        className
      )}
    >
      {children}
    </Link>
  );
}
