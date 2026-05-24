"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import DirectorySearchBar from '@/components/DirectorySearchBar';

const PublicDirectoryMap = dynamic(() => import('@/components/PublicDirectoryMap'), {
  ssr: false,
});

function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function formatCategory(category: string): string {
  switch (category) {
    case 'HEALTH':
      return 'Health';
    case 'LEGAL':
      return 'Legal';
    case 'ORGANIZATION':
      return 'Organization';
    case 'SAFE_SPACE':
      return 'Safe space';
    case 'HOUSING':
      return 'Housing';
    case 'EMERGENCY':
      return 'Emergency';
    default:
      return category;
  }
}

type Listing = {
  id: string;
  name: string;
  description: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  category: string;
};

function ZeroResultFeedback({ searchTerm }: { searchTerm: string }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setDone(true); 
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm, freeText: text.trim() }),
      });
      setDone(true);
      setText('');
    } catch (err) {
      setError('Could not send your note. You can try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <p className="text-xs text-slate-600">
        Thank you. This helps MRI understand what services are missing.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-left">
      <label className="block text-xs text-slate-700">
        If you want, tell us briefly what you were hoping to find (optional).
      </label>
      <textarea
        rows={3}
        maxLength={200}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded border border-brand-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="e.g. safe housing in Kayonza, queer-friendly therapist, legal help near Kigali…"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center rounded-full bg-brand-700 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send note (optional)'}
      </button>
    </form>
  );
}

export default function DirectoryPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const category = searchParams.get('category') ?? undefined;
  const q = searchParams.get('q') ?? undefined;
  const userLat = searchParams.get('lat')
    ? Number(searchParams.get('lat'))
    : undefined;
  const userLng = searchParams.get('lng')
    ? Number(searchParams.get('lng'))
    : undefined;

  useEffect(() => {
    const controller = new AbortController();
    const fetchListings = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (q) params.set('q', q);

      try {
        const res = await fetch(`/api/listings?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) {
          setListings([]);
          return;
        }
        const data = (await res.json()) as Listing[];
        setListings(data);
      } catch (err) {
        if ((err as any).name !== 'AbortError') {
          setListings([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();

    return () => controller.abort();
  }, [category, q]);

  const listingsWithDistance = useMemo(() => {
    return listings.map((l) => {
      if (
        userLat == null ||
        userLng == null ||
        l.lat == null ||
        l.lng == null
      ) {
        return { ...l, distanceKm: undefined as number | undefined };
      }
      return {
        ...l,
        distanceKm: haversineKm(userLat, userLng, l.lat, l.lng),
      };
    });
  }, [listings, userLat, userLng]);

  const sortedListings = useMemo(() => {
    return [...listingsWithDistance].sort((a, b) => {
      if (a.distanceKm == null && b.distanceKm == null) return 0;
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [listingsWithDistance]);

  const hasApproxLocation = userLat != null && userLng != null;
  const hasLowCoverage = !loading && listings.length > 0 && listings.length < 3;

  return (
    <div className="space-y-4">
      <header className="animate-fade-in-up space-y-1 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <h1 className="text-xl font-semibold">Service directory</h1>
        {category ? (
          <p className="text-sm text-brand-100">
            Showing services in {category.toLowerCase()}
          </p>
        ) : (
          <p className="text-sm text-brand-100">
            Browse safe health, legal, housing, and community services.
          </p>
        )}
        {hasApproxLocation && (
          <p className="text-xs text-brand-100/80">
            Sorted by approximate distance from your location.
          </p>
        )}
      </header>

      {/* FIXED: Added inline styles directly to the parent wrapper to guarantee it sits above the map layout layer */}
      <div style={{ position: 'relative', zIndex: 99999 }}>
        <DirectorySearchBar />
      </div>

      {loading ? (
        <div className="rounded-xl border border-brand-100 bg-white/80 p-6 text-center text-sm text-slate-500 shadow-soft">
          Loading directory…
        </div>
      ) : listings.length > 0 ? (
        <>
          <PublicDirectoryMap listings={sortedListings} />

          <section className="space-y-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-brand-800">
              Nearby vetted services
            </h2>
            {hasLowCoverage && (
              <p className="text-xs text-amber-700">
                We only have a few options here for now. MRI is still adding more
                safe places in this area and category.
              </p>
            )}
            <ul className="space-y-2">
              {sortedListings.map((listing) => (
                <li
                  key={listing.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      window.location.href = `/directory/${listing.id}`;
                    }
                  }}
                  onClick={() => (window.location.href = `/directory/${listing.id}`)}
                  className="rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft hover:border-brand-300 hover:bg-white cursor-pointer"
                >
                  <div className="block space-y-1">
                    <h3 className="font-semibold text-slate-900">
                      {listing.name}
                    </h3>
                    <p className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-800">
                      {formatCategory((listing as any).category)}
                    </p>
                    {listing.address && (
                      <p className="text-xs text-slate-600">{listing.address}</p>
                    )}
                    {'distanceKm' in listing && listing.distanceKm != null && (
                      <p className="mt-1 text-xs text-slate-500">
                        {(listing.distanceKm as number).toFixed(1)} km away
                      </p>
                    )}
                    <p className="mt-1 line-clamp-3 text-xs text-slate-700">
                      {listing.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <div className="space-y-4 rounded-xl border border-dashed border-brand-200 bg-white/70 p-8 text-sm text-slate-700 shadow-soft">
          <p className="font-medium text-slate-800">
            We don't have this yet, but we've noted your interest.
          </p>
          {q ? (
            <ZeroResultFeedback searchTerm={q} />
          ) : (
            <p className="text-xs text-slate-500">
              Try adjusting your search or choosing a different category.
            </p>
          )}
        </div>
      )}
    </div>
  );
}