import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show online toast
      const offlineMessage = document.getElementById('offline-message');
      if (offlineMessage) {
        offlineMessage.classList.remove('visible');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Show offline toast
      const offlineMessage = document.getElementById('offline-message');
      if (offlineMessage) {
        offlineMessage.classList.add('visible');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
