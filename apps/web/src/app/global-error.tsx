'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 antialiased">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
