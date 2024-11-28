'use client';

import React, { useState, useEffect } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { storage } from '../utils/storage';

const PROMPT_DELAY = 30000; // 30 seconds
const PROMPT_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function InstallPrompt() {
  const { isInstallable, isInstalled, showInstallPrompt } = useInstallPrompt();
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (isInstalled || !isInstallable || hasInteracted) return;

    // Check last prompt time
    const lastPrompt = storage.getSettings().lastInstallPrompt;
    const now = Date.now();

    if (!lastPrompt || (now - lastPrompt > PROMPT_INTERVAL)) {
      // Show prompt after delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Update last prompt time
        const settings = storage.getSettings();
        settings.lastInstallPrompt = now;
        storage.saveSettings(settings);
      }, PROMPT_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, hasInteracted]);

  const handleInstall = async () => {
    setHasInteracted(true);
    setIsVisible(false);
    try {
      const outcome = await showInstallPrompt();
      if (outcome === 'accepted') {
        // Track successful installation
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'install_accepted');
        }
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setHasInteracted(true);
    setIsVisible(false);
    // Track dismissal
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'install_dismissed');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-800 rounded-lg shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <img src="/icon.svg" alt="App Icon" className="h-10 w-10" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-100">
            Install Neural Network Simulator
          </h3>
          <p className="mt-1 text-sm text-gray-300">
            Install our app for a better experience! Get offline access, faster loading, and desktop shortcuts.
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              onClick={handleInstall}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Install App
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Maybe Later
            </button>
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-700 focus:outline-none"
          onClick={handleDismiss}
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
