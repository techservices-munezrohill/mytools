'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      // 1. Save to LocalStorage so we remember this user
      localStorage.setItem('mytools_ref', ref);

      // 2. Tell the database about the visit
      fetch('/api/referrals/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ref }),
      }).catch((err) => console.error('Referral log failed', err));
    }
  }, [searchParams]);

  return null; // This component doesn't show anything, it just works in the background
}