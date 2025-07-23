'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export default function PWAProvider() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      
      // Add event listeners to handle any of the waiting or controlling workers
      wb.addEventListener('installed', (event) => {
        console.log('Service Worker installed', event);
      });

      wb.addEventListener('waiting', (event) => {
        console.log('Service Worker waiting', event);
        // Show update available notification
        if (confirm('A new version is available. Reload to update?')) {
          wb.messageSkipWaiting();
        }
      });

      wb.addEventListener('controlling', (event) => {
        console.log('Service Worker controlling', event);
        window.location.reload();
      });

      wb.addEventListener('activated', (event) => {
        console.log('Service Worker activated', event);
      });

      wb.register();
    }
  }, []);

  return null;
}

// Extend the Window interface to include workbox
declare global {
  interface Window {
    workbox: Workbox;
  }
}
