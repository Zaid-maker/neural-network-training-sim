import { useState, useEffect } from 'react';

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setPrompt(null);
      // Track installation in analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'pwa_installed');
      }
    };

    // Check if app is installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    checkInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async () => {
    if (!prompt) return;

    // Show the install prompt
    const result = await prompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await result;
    
    if (outcome === 'accepted') {
      setPrompt(null);
      setIsInstallable(false);
    }

    return outcome;
  };

  return {
    isInstallable,
    isInstalled,
    showInstallPrompt
  };
}
