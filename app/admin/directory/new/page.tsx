import { prisma } from '@/lib/prisma';
import ListingForm, { ListingInitial } from '@/components/admin/ListingForm';

type NewListingPageProps = {
  searchParams?: { from?: string };
};

export default async function NewListingPage({ searchParams }: NewListingPageProps) {
  const fromId = searchParams?.from;
  let initial: ListingInitial | undefined;

  if (fromId) {
    const listing = await prisma.listing.findUnique({ where: { id: fromId } });

    if (listing) {
      initial = {
        name: listing.name,
        category: listing.category as ListingInitial['category'],
        description: listing.description,
        services: listing.services,
        address: listing.address ?? '',
        lat: listing.lat,
        lng: listing.lng,
        hours: listing.hours ?? '',
        contactMethod: listing.phone ?? '',
        acceptsWalkIns: listing.acceptsWalkIns,
        missionStatement: listing.missionStatement ?? '',
        focusAreas: listing.focusAreas,
        lastVerifiedAt: '',
        isHidden: listing.isHidden,
      };
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        {fromId ? 'Duplicate listing' : 'New listing'}
      </h1>
      <ListingForm mode="create" initial={initial} />
    </div>
  );
}
