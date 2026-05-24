import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const listingId = params.id;
  const form = await req.formData();
  const lock = form.get('lock');

  if (lock === '1') {
    await prisma.listing.update({ where: { id: listingId }, data: { ratingsLocked: true } });
  } else {
    await prisma.listing.update({ where: { id: listingId }, data: { ratingsLocked: false } });
  }

  return NextResponse.redirect(`/admin/directory/${listingId}`);
}
