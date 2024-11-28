import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Header } from './components/layout/Header';
import { InstallPrompt } from './components/InstallPrompt';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Neural Network Training Simulator',
    default: 'Neural Network Training Simulator',
  },
  description:
    'An interactive web application for understanding and experimenting with neural network training techniques.',
  keywords: [
    'Neural Network',
    'Machine Learning',
    'Deep Learning',
    'Training Simulator',
    'Interactive Learning',
    'AI Education',
  ],
  authors: [
    {
      name: 'Neural Network Training Simulator Team',
    },
  ],
  creator: 'Neural Network Training Simulator Team',
  publisher: 'Neural Network Training Simulator',
  robots: {
    index: true,
    follow: true,
  },
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
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
};

import { useEffect } from 'react';
import { registerServiceWorker } from './utils/serviceWorker';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="Interactive neural network training visualization and experimentation platform" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Neural Network Training Simulator</title>
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-50 antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-800 bg-gray-950/50 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
              <div className="flex justify-center space-x-6 md:order-2">
                <a
                  href="https://github.com/yourusername/neural-network-training-simulator"
                  className="text-gray-400 hover:text-gray-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <div className="mt-8 md:order-1 md:mt-0">
                <p className="text-center text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} Neural Network Training Simulator. All rights
                  reserved.
                </p>
              </div>
            </div>
          </footer>
          <div id="offline-message" className="hidden fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded shadow-lg">
            You are currently offline. Some features may be limited.
          </div>
          <InstallPrompt />
        </div>
      </body>
    </html>
  );
}
