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

const listingSchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.enum(CATEGORIES),
  description: z.string().trim().min(1).max(4000),
  services: z.array(z.string().trim()).default([]),
  address: z.string().trim().max(500).optional().or(z.literal('')),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  contactMethod: z.string().trim().max(200).optional().or(z.literal('')),

  missionStatement: z.string().trim().max(2000).optional().or(z.literal('')),
  focusAreas: z.array(z.string().trim()).default([]),
  lastVerifiedAt: z.string().nullable().optional(),
  isHidden: z.boolean().default(false),
});

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const listings = await prisma.listing.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(listings);
}

export async function POST(request: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const body = await request.json();
  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const created = await prisma.listing.create({
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      services: data.services,
      address: data.address || null,
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      hours: data.hours || null,
      phone: data.contactMethod || null,
      acceptsWalkIns: data.acceptsWalkIns,
      missionStatement: data.missionStatement || null,
      focusAreas: data.focusAreas,
      lastVerifiedAt: data.lastVerifiedAt ? new Date(data.lastVerifiedAt) : null,
      isHidden: false,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
