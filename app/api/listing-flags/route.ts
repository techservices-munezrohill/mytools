import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bodySchema = z.object({
  listingId: z.string().min(1),
  reason: z.string().trim().min(1).max(100),
  freeText: z.string().trim().max(200).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { listingId, reason, freeText } = parsed.data;

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  await prisma.listingFlag.create({
    data: {
      listingId,
      reason,
      freeText: freeText || null,
    },
  });

  const flagCount = await prisma.listingFlag.count({ where: { listingId } });
  const AUTO_HIDE_THRESHOLD = 3;
  let listingHidden = listing.isHidden;

  if (flagCount >= AUTO_HIDE_THRESHOLD && !listing.isHidden) {
    await prisma.listing.update({
      where: { id: listingId },
      data: { isHidden: true },
    });
    listingHidden = true;
  }

  return NextResponse.json(
    { ok: true, flagCount, listingHidden },
    { status: 201 },
  );
}
