import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { session, response } = await requireAdmin();
  if (!session) return response!;

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.listing.update({
    where: { id: params.id },
    data: { isHidden: false },
  });

  return NextResponse.redirect(new URL('/admin/flags', _request.url));
}
