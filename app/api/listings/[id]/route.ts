import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/listings/[id]
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing || listing.isHidden) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(listing);
}
