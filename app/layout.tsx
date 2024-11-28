import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ClientLayout } from './components/layout/ClientLayout';
import './globals.css';
import React from 'react';

const satoshi = localFont({
  src: '../public/fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Neural Network Training Simulator',
    default: 'Neural Network Training Simulator',
  },
  description: 'An interactive web application for understanding and experimenting with neural network training techniques.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  keywords: [
    'Neural Network',
    'Machine Learning',
    'Deep Learning',
    'Training Simulator',
    'Interactive Learning',
    'AI Education',
  ],
  authors: [{ name: 'Neural Network Training Simulator Team' }],
  creator: 'Neural Network Training Simulator Team',
  publisher: 'Neural Network Training Simulator',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neural-network-simulator.example.com',
    title: 'Neural Network Training Simulator',
    description: 'Interactive neural network training visualization and experimentation platform',
    siteName: 'Neural Network Training Simulator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neural Network Training Simulator',
    description: 'Interactive neural network training visualization and experimentation platform',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={satoshi.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-950 text-gray-50 antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
