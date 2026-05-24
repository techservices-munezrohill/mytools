import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const existing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const duplicated = await prisma.listing.create({
    data: {
      name: `${existing.name} (copy)`,
      category: existing.category,
      description: existing.description,
      services: existing.services,
      address: existing.address,
      lat: existing.lat,
      lng: existing.lng,
      hours: existing.hours,
      contactMethod: existing.contactMethod,
      acceptsWalkIns: existing.acceptsWalkIns,
      missionStatement: existing.missionStatement,
      focusAreas: existing.focusAreas,
      lastVerifiedAt: existing.lastVerifiedAt,
      isHidden: false,
    },
  });

  return NextResponse.json(duplicated, { status: 201 });
}
