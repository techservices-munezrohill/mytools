import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatFlagReason } from '@/lib/flag-reasons';

function formatWhen(date: Date) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default async function AdminFlagsPage() {
  const listings = await prisma.listing.findMany({
    where: {
      flags: { some: {} },
    },
    include: {
      flags: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: [{ isHidden: 'desc' }, { updatedAt: 'desc' }],
  });

  const pendingCount = listings.filter((l) => l.isHidden).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">
          Safety review
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Listing reports</h1>
        <p className="mt-1 text-sm text-brand-100">
          Anonymous user reports. Listings with 3 or more reports are hidden from the
          public directory until you restore them.
        </p>
        {pendingCount > 0 && (
          <p className="mt-3 rounded-lg bg-amber-500/20 px-3 py-2 text-sm text-amber-50">
            {pendingCount} listing{pendingCount === 1 ? '' : 's'} currently hidden pending
            review.
          </p>
        )}
      </section>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
          No safety reports yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-900">
                      {listing.name}
                    </h2>
                    {listing.isHidden ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900">
                        Hidden from public
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                        Still visible
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {listing.category} · {listing.flags.length} report
                    {listing.flags.length === 1 ? '' : 's'}
                    {listing.flags[0] && (
                      <>
                        {' '}
                        · latest {formatWhen(listing.flags[0].createdAt)}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    href={`/admin/directory/${listing.id}`}
                    className="rounded bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-200"
                  >
                    Edit listing
                  </Link>
                  {listing.isHidden && (
                    <form
                      action={`/api/admin/listings/${listing.id}/restore`}
                      method="POST"
                    >
                      <button
                        type="submit"
                        className="rounded bg-brand-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800"
                      >
                        Restore to directory
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                {listing.flags.map((flag) => (
                  <li key={flag.id} className="py-3 first:pt-3">
                    <p className="font-medium text-slate-800">
                      {formatFlagReason(flag.reason)}
                    </p>
                    <p className="text-xs text-slate-500">{formatWhen(flag.createdAt)}</p>
                    {flag.freeText && (
                      <p className="mt-1 text-xs text-slate-700">{flag.freeText}</p>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
