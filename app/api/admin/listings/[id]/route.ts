import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

const CATEGORIES = [
  'HEALTH',
  'LEGAL',
  'ORGANIZATION',
  'SAFE_SPACE',
  'HOUSING',
  'EMERGENCY',
] as const;

const updateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  category: z.enum(CATEGORIES).optional(),
  description: z.string().trim().min(1).max(4000).optional(),
  services: z.array(z.string().trim()).optional(),
  address: z.string().trim().max(500).nullable().optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  hours: z.string().trim().max(200).nullable().optional(),
  contactMethod: z.string().trim().max(200).nullable().optional(),
  acceptsWalkIns: z.boolean().optional(),
  missionStatement: z.string().trim().max(2000).nullable().optional(),
  focusAreas: z.array(z.string().trim()).optional(),
  lastVerifiedAt: z.string().nullable().optional(),
  isHidden: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
  });
  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(listing);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const updateData: any = {
    ...data,
    address: data.address ?? undefined,
    hours: data.hours ?? undefined,
    missionStatement: data.missionStatement ?? undefined,
    lastVerifiedAt:
      data.lastVerifiedAt === null
        ? null
        : data.lastVerifiedAt
        ? new Date(data.lastVerifiedAt)
        : undefined,
    isHidden: data.isHidden ?? undefined,
  };

  // Map contactMethod (frontend) to phone (db)
  if (data.contactMethod !== undefined) {
    updateData.phone = data.contactMethod;
  }
  // remove fields that don't exist in the Prisma model
  delete updateData.contactMethod;

  const updated = await prisma.listing.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  await prisma.listing.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
