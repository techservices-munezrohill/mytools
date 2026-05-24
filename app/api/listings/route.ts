import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') as
    | 'HEALTH'
    | 'LEGAL'
    | 'ORGANIZATION'
    | 'SAFE_SPACE'
    | 'HOUSING'
    | 'EMERGENCY'
    | null;
  const q = searchParams.get('q')?.trim() || null;

  const listings = await prisma.listing.findMany({
    where: {
      isHidden: false,
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { services: { has: q } },
              { focusAreas: { has: q } },
            ],
          }
        : {}),
    },
    orderBy: { name: 'asc' },
  });

  // Service gap logging: zero-result and low-coverage searches
  if (q) {
    const count = listings.length;
    const isZeroResult = count === 0;
    const isLowCoverage = count > 0 && count < 3;

    if (isZeroResult || isLowCoverage) {
      prisma.serviceRequest
        .create({
          data: {
            searchTerm: q,
            isLowCoverage,
          },
        })
        .catch(() => {
          // do not break user search if logging fails
        });
    }
  }

  return NextResponse.json(listings);
}
