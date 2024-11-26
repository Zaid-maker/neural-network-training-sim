import React from 'react';
import Link from 'next/link';
import { AppIcon } from '../icons/AppIcon';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/75 backdrop-blur supports-[backdrop-filter]:bg-gray-950/75">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link 
            href="/"
            className="flex items-center space-x-2 hover:opacity-90"
          >
            <AppIcon size={32} className="text-indigo-500" />
            <span className="font-semibold">
              Neural Network Simulator
            </span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
          <Link 
            href="/examples"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-50"
          >
            Examples
          </Link>
          <Link 
            href="/documentation"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-50"
          >
            Documentation
          </Link>
          <a
            href="https://github.com/yourusername/neural-network-training-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-50"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};
