import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold text-surface-900 dark:text-surface-50">404</h1>
      <p className="text-surface-600 dark:text-surface-400">Page not found</p>
      <Link
        href="/"
        className="text-primary-600 dark:text-primary-400 hover:underline"
      >
        Go home
      </Link>
    </div>
  );
}
