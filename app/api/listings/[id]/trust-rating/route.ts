import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bodySchema = z.object({
  score: z.number().int().refine((v) => v === 1 || v === -1, {
    message: 'Score must be 1 or -1',
  }),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const listingId = params.id;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.isHidden) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  if (listing.ratingsLocked) {
    return NextResponse.json({ error: 'Ratings are locked for this listing' }, { status: 423 });
  }

  const { score } = parsed.data;

  await prisma.trustRating.create({
    data: {
      listingId,
      score,
    },
  });

  // Compute aggregate
  const aggregate = await prisma.trustRating.aggregate({
    where: { listingId },
    _avg: { score: true },
    _count: { _all: true },
  });

  const avg = aggregate._avg?.score ?? 0;
  const count = aggregate._count ?? 0;

  // Anomaly detection: if there are 5+ negative votes in the last 24 hours, lock ratings
  const twentyFourHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const recentNegatives = await prisma.trustRating.count({
    where: { listingId, score: -1, createdAt: { gt: twentyFourHoursAgo } },
  });

  if (recentNegatives >= 5) {
    await prisma.listing.update({ where: { id: listingId }, data: { ratingsLocked: true } });
    // Here you could also create an admin notification row; for now we just lock
  }

  return NextResponse.json({ ok: true, avg, count });
}
