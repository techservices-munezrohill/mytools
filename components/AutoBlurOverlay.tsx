"use client";

import { useEffect, useState } from 'react';

export default function AutoBlurOverlay() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVisibilityChange = () => {
      setHidden(document.visibilityState === 'hidden');
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  if (!hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 bg-slate-900" aria-hidden="true" />
  );
}
