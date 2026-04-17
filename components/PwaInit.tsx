"use client";

import { useEffect } from 'react';

export default function PwaInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Simple registration; can be enhanced later
    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => {
        // ignore errors; app still works online
      });
  }, []);

  return null;
}
