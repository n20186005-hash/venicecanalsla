'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    // Only register the service worker in production to avoid stale caches
    // during local development.
    if (
      typeof window === 'undefined' ||
      process.env.NODE_ENV !== 'production' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Ignore SW registration failures - the site works fine without it.
      });
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}
