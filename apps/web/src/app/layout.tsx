import type { Metadata } from 'next';
import { Header, ThemeProvider } from '@/components/layout';
import { ToastProvider } from '@/components/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'A unified system for managing personal data and workflows',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <Header />
            <main className="container mx-auto px-4 py-6">{children}</main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
