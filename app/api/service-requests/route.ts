import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  searchTerm: z.string().trim().min(1).max(200),
  freeText: z.string().trim().max(200).optional(),
  isLowCoverage: z.boolean().optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { searchTerm, freeText, isLowCoverage } = parsed.data;

  await prisma.serviceRequest.create({
    data: {
      searchTerm,
      freeText: freeText || null,
      isLowCoverage: isLowCoverage ?? false,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
