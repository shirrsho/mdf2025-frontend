import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { Providers } from '@/providers';
import { LogoLoader } from '@/components/common';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Marketron',
    default: 'Marketron',
  },
  description: 'Marketron',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.marketron.com'
  ),
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='dark'>
      <head>
        <link rel='icon' href='/logo.png' />
        <meta name='description' content='Marketron Digital Dair 2025' />
        <link rel='apple-touch-icon' href='/logo.png' />
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body className={`${inter.className} bg-background dark`}>
        <Providers>
          <Suspense fallback={<LogoLoader />}>
          {children}
                  </Suspense>
        </Providers>
      </body>
    </html>
  );
}
