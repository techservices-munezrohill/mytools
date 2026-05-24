import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const listingId = params.id;

  // delete all trust ratings for this listing
  await prisma.trustRating.deleteMany({ where: { listingId } });
  // unlock ratings after reset
  await prisma.listing.update({ where: { id: listingId }, data: { ratingsLocked: false } });

  return NextResponse.redirect(`/admin/directory/${listingId}`);
}
