import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'Personal OS v2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 antialiased">
        {children}
      </body>
    </html>
  );
}
