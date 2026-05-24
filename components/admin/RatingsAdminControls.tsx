import { prisma } from '@/lib/prisma';

export default async function ListingAdminControls({ listingId }: { listingId: string }) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Ratings</h3>
      <p className="text-xs text-slate-500">
        Ratings locked: {listing.ratingsLocked ? 'Yes' : 'No'}
      </p>
      <form action={`/api/admin/listings/${listingId}/ratings-lock`} method="POST">
        <input type="hidden" name="lock" value={listing.ratingsLocked ? '0' : '1'} />
        <button
          type="submit"
          className="rounded bg-brand-700 px-3 py-1 text-xs text-white hover:bg-brand-800"
        >
          {listing.ratingsLocked ? 'Unlock ratings' : 'Lock ratings'}
        </button>
      </form>
      <form action={`/api/admin/listings/${listingId}/ratings-reset`} method="POST">
        <button
          type="submit"
          className="mt-2 rounded bg-rose-600 px-3 py-1 text-xs text-white hover:bg-rose-700"
        >
          Reset ratings (delete all)
        </button>
      </form>
    </div>
  );
}
