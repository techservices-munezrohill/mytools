/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, NetworkFirst, StaleWhileRevalidate, ExpirationPlugin } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// ---------------------------------------------------------------------------
// Sprint 2 — offline caching for directory data and articles.
// These rules run BEFORE the Serwist defaults so that our explicit strategies
// take priority over the generic catch-all.
// ---------------------------------------------------------------------------

const appCaching = [
  // Cache directory API responses so the listing data is available offline.
  {
    matcher: /^\/api\/listings(?:\/|\?|$)/,
    handler: new StaleWhileRevalidate({
      cacheName: 'directory-api',
      plugins: [
        new ExpirationPlugin({ maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 }), // 1 day
      ],
    }),
  },
  // Cache individual article pages for offline reading.
  {
    matcher: /^\/hub\/.+/,
    handler: new NetworkFirst({
      cacheName: 'hub-articles',
      plugins: [
        new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }), // 7 days
      ],
    }),
  },
  // Cache individual directory listing pages for offline access.
  {
    matcher: /^\/directory\/.+/,
    handler: new NetworkFirst({
      cacheName: 'directory-pages',
      plugins: [
        new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 3 }), // 3 days
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...appCaching, ...defaultCache],
  // Make sure the offline Emergency Card is always cached and usable without network.
  fallbacks: {
    entries: [
      {
        url: '/emergency',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },
});

serwist.addEventListeners();
