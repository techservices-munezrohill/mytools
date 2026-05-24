'use client';

import { useEffect } from 'react';

export default function CaptureReferral() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (!ref) return;

      // CHANGE: Only skip if we already have THIS EXACT code saved.
      // This allows you to test different referral codes.
      if (localStorage.getItem('mytools_ref') === ref) return; 
      
      localStorage.setItem('mytools_ref', ref);

      // send to Umami if present
      if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track('referral', { ref });
      }

      // send fallback to server
      fetch('/api/referrals/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ref }),
      }).catch(() => {});
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
