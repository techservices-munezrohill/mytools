import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ListingForm from '@/components/admin/ListingForm';
import RatingsAdminControls from '@/components/admin/RatingsAdminControls';

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
  });

  if (!listing) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit listing</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ListingForm
            mode="edit"
            initial={{
              id: listing.id,
              name: listing.name,
              category: listing.category,
              description: listing.description,
              services: listing.services,
              address: listing.address ?? '',
              lat: listing.lat,
              lng: listing.lng,
              hours: listing.hours ?? '',
              contactMethod: listing.contactMethod ?? '',
              acceptsWalkIns: listing.acceptsWalkIns,
              missionStatement: listing.missionStatement ?? '',
              focusAreas: listing.focusAreas,
              lastVerifiedAt: listing.lastVerifiedAt
                ? listing.lastVerifiedAt.toISOString().slice(0, 10)
                : '',
              isHidden: listing.isHidden,
            }}
          />
        </div>

        <aside className="rounded-lg border bg-white p-4">
          {/* @ts-ignore server component */}
          <RatingsAdminControls listingId={listing.id} />
        </aside>
      </div>
    </div>
  );
}
