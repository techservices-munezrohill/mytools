import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const listingId = params.id;

  // Count negative ratings in last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const recentNegatives = await prisma.trustRating.count({
    where: { listingId, score: -1, createdAt: { gt: twentyFourHoursAgo } },
  });

  const threshold = 5;
  if (recentNegatives >= threshold) {
    await prisma.listing.update({ where: { id: listingId }, data: { ratingsLocked: true } });
    return NextResponse.json({ ok: true, locked: true, recentNegatives });
  }

  return NextResponse.json({ ok: true, locked: false, recentNegatives });
}
