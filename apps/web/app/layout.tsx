import type { Metadata } from 'next';
import './globals.css';
import { DisclaimerFooter } from '@/components/disclaimer-footer';
import { Navbar } from '@/components/navbar';
import { QueryProvider } from '@/providers/query-provider';

export const metadata: Metadata = {
  title: 'ViewFuture',
  description: 'Global stock trend & theme screener',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <QueryProvider>
          <Navbar />
          {children}
          <DisclaimerFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
