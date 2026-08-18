import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SITE_NAME } from '@/lib/constants';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: 'A multi-vendor marketplace — shop from independent stores in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
