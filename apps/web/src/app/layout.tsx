import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'A unified system for managing personal data and workflows',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
