'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppIcon } from '../icons/AppIcon';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/75 backdrop-blur supports-[backdrop-filter]:bg-gray-950/75">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
            <AppIcon size={28} className="text-indigo-500" />
            <span className="hidden font-semibold sm:inline">Neural Network Simulator</span>
            <span className="font-semibold sm:hidden">NN Sim</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        >
          <span className="sr-only">Open main menu</span>
          {!isMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
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

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          <Link
            href="/examples"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Examples
          </Link>
          <Link
            href="/documentation"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Documentation
          </Link>
          <a
            href="https://github.com/yourusername/neural-network-training-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};
