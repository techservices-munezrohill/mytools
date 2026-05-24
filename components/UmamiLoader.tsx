// Umami snippet loader: injects Umami script on client only
'use client';

import { useEffect } from 'react';

export default function UmamiLoader() {
  useEffect(() => {
    const host = process.env.NEXT_PUBLIC_UMAMI_HOST;
    const site = process.env.NEXT_PUBLIC_UMAMI_SITE_ID;
    if (!host || !site) return;

    // avoid injecting multiple times
    if ((window as any).umami) return;

    const s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.setAttribute('data-website-id', site);
    s.src = `${host.replace(/\/$/, '')}/umami.js`;
    document.head.appendChild(s);

    // create minimal global wrapper
    (window as any).umami = (eventName: string, props?: Record<string, any>) => {
      try {
        // @ts-ignore
        if (window.umami && typeof window.umami.track === 'function') {
          // umami exposes a track function when loaded
          // @ts-ignore
          window.umami.track(eventName, props);
        }
      } catch (e) {}
    };
  }, []);

  return null;
}
