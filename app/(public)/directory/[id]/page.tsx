import Link from 'next/link';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

import { prisma } from '@/lib/prisma';
import ReportProblemForm from '@/components/ReportProblemForm';
import TrustRatingWidget from '@/components/TrustRatingWidget';
import BookmarkButton from '@/components/BookmarkButton';

const ListingLocationMap = dynamic(
  () => import('@/components/ListingLocationMap'),
  { ssr: false },
);

function isStaleVerifiedDate(lastVerifiedAt: Date | null): boolean {
  if (!lastVerifiedAt) return true;
  const sixMonthsMs = 1000 * 60 * 60 * 24 * 30 * 6;
  const now = Date.now();
  return now - lastVerifiedAt.getTime() > sixMonthsMs;
}

async function getListingWithFlags(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      flags: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      trustRatings: true,
    },
  });
  return listing;
}

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getListingWithFlags(params.id);

  if (!listing || listing.isHidden) {
    notFound();
  }

  const stale = isStaleVerifiedDate(listing.lastVerifiedAt);
  const ratingsLocked = listing.ratingsLocked;

  const flagCount = listing.flags.length;
  const hasSeriousFlags = listing.flags.some((f) =>
    ['no-longer-safe', 'harassment-or-violence', 'police-or-authorities'].includes(
      f.reason,
    ),
  );
const showSafetyNotice = hasSeriousFlags || flagCount >= 2 || listing.ratingsLocked;

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

  return (
    <div className="space-y-4">
      <header className="space-y-2 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.15em] text-brand-100/80">
          Service detail
        </p>
        <h1 className="text-xl font-semibold">{listing.name}</h1>
        <p className="inline-flex rounded-full bg-brand-100/10 px-3 py-1 text-[11px] text-brand-50 ring-1 ring-brand-100/40">
          {formatCategory(listing.category)}
        </p>
        {listing.address && (
          <p className="text-xs text-brand-100/90">{listing.address}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {listing.lastVerifiedAt && (
            <span className="inline-flex items-center rounded-full bg-brand-100/10 px-3 py-1 text-[11px] text-brand-50 ring-1 ring-brand-100/40">
              Last verified{' '}
              {listing.lastVerifiedAt.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
          {stale && (
            <span className="inline-flex items-center rounded-full bg-amber-100/10 px-3 py-1 text-[11px] text-amber-50 ring-1 ring-amber-200/60">
              Not recently verified – contact to confirm.
            </span>
          )}
          {flagCount >= 2 && (
            <span className="inline-flex items-center rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-medium text-amber-50 ring-1 ring-amber-200/50">
              {flagCount} safety report{flagCount === 1 ? '' : 's'} on file
            </span>
          )}
        </div>
      </header>

      <section className="rounded-xl border border-brand-100 bg-white/90 p-4 text-sm shadow-soft space-y-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">
            About this service
          </h2>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-800">
            {listing.description}
          </p>
        </div>

        {listing.services && listing.services.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">
              Services offered
            </h3>
            <ul className="mt-1 flex flex-wrap gap-1">
              {listing.services.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-brand-50 px-2 py-1 text-[11px] text-brand-800 ring-1 ring-brand-100"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {listing.focusAreas && listing.focusAreas.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">
              Focus areas
            </h3>
            <ul className="mt-1 flex flex-wrap gap-1">
              {listing.focusAreas.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-slate-50 px-2 py-1 text-[11px] text-slate-700 ring-1 ring-slate-200"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(listing.hours || listing.acceptsWalkIns) && (
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            {listing.hours && (
              <div>
                <div className="font-semibold text-slate-800">Hours</div>
                <div className="mt-0.5 text-slate-700">{listing.hours}</div>
              </div>
            )}
            <div>
              <div className="font-semibold text-slate-800">Walk-ins</div>
              <div className="mt-0.5 text-slate-700">
                {listing.acceptsWalkIns
                  ? 'Walk-ins are accepted.'
                  : 'Please contact first; walk-ins may not be accepted.'}
              </div>
            </div>
          </div>
        )}

        {listing.missionStatement && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">
              Organization mission
            </h3>
            <p className="mt-1 whitespace-pre-line text-sm text-slate-800">
              {listing.missionStatement}
            </p>
          </div>
        )}

        {(listing.phone || listing.email || listing.website) && (
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            {listing.phone && (
              <div>
                <div className="font-semibold text-slate-800">Phone</div>
                <div className="mt-0.5 text-slate-700">{listing.phone}</div>
              </div>
            )}
            {listing.email && (
              <div>
                <div className="font-semibold text-slate-800">Email</div>
                <div className="mt-0.5 text-slate-700 break-all">
                  {listing.email}
                </div>
              </div>
            )}
            {listing.website && (
              <div>
                <div className="font-semibold text-slate-800">Website</div>
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1 text-brand-700 underline"
                >
                  Open website
                </a>
              </div>
            )}
          </div>
        )}

        {
          listing.ratingsLocked ? (
            <div
              className="w-full rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              role="status"
            >
              <p className="font-semibold">Safety notice</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-900">
                MRI is reviewing recent community reports about this place. Trust ratings
                are paused until the review is complete.
              </p>
            </div>
          ) : (
            hasSeriousFlags && (
              <div
                className="w-full rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                role="status"
              >
                <p className="font-semibold">Safety notice</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-900">
                  Recent reports mention safety concerns about this place. Use extra
                  caution and consider contacting the service before you visit.
                </p>
              </div>
            )
          )
        }

        <TrustRatingWidget listingId={listing.id} ratingsLocked={listing.ratingsLocked} />
      </section>

      {listing.lat != null && listing.lng != null && (
        <section className="space-y-2 rounded-xl border border-brand-100 bg-white/90 p-4 text-sm shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">
            Location &amp; directions
          </h2>
          <p className="text-xs text-slate-700">
            For your safety, only use directions if it is safe to travel.
          </p>
          <ListingLocationMap
            lat={listing.lat}
            lng={listing.lng}
            name={listing.name}
            address={listing.address}
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${listing.lat},${listing.lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-brand-700 px-4 py-2 text-xs font-medium text-white hover:bg-brand-800"
          >
            Open in Maps
          </a>
        </section>
      )}

      <section className="space-y-2 rounded-xl border border-rose-100 bg-rose-50/80 p-4 text-xs text-rose-900 shadow-soft">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em]">
          Is this place no longer safe?
        </h2>
        <p>
          If you've had a bad or unsafe experience here, you can anonymously
          let MRI know. Your report won't be linked to your identity.
        </p>
        <ReportProblemForm listingId={listing.id} />
      </section>

      <div className="flex items-center justify-between pt-2">
        <Link
          href="/directory"
          className="text-xs font-medium text-brand-700 underline"
        >
          Back to directory
        </Link>
        <BookmarkButton
          type="listing"
          id={listing.id}
          title={listing.name}
          meta={listing.category}
        />
      </div>
    </div>
  );
}
