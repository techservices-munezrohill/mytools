import Link from 'next/link';
import { prisma } from '@/lib/prisma';

const STALE_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 180; // 6 months

function formatDate(date: Date | null) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

export default async function AdminDirectoryPage() {
  const listings = await prisma.listing.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  const now = Date.now();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Directory</h1>
          <p className="text-sm text-slate-600">
            {listings.length} listing{listings.length === 1 ? '' : 's'}. Stale listings
            are flagged in amber.
          </p>
        </div>
        <Link
          href="/admin/directory/new"
          className="rounded bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-900"
        >
          New listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No listings yet. Add the first vetted service to get started.
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {listings.map((listing) => {
            const stale =
              !listing.lastVerifiedAt ||
              now - listing.lastVerifiedAt.getTime() > STALE_THRESHOLD_MS;
            return (
              <li key={listing.id}>
                <Link
                  href={`/admin/directory/${listing.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-slate-50"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate font-medium text-slate-900">{listing.name}</p>
                    <p className="text-xs text-slate-500">
                      {listing.category} · last verified{' '}
                      {formatDate(listing.lastVerifiedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {listing.isHidden && (
                      <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">
                        hidden
                      </span>
                    )}
                    {stale && (
                      <span className="rounded bg-amber-100 px-2 py-1 text-amber-800">
                        stale
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
