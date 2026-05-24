import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

const referralSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, dashes and underscores.'),
  label: z.string().trim().min(1).max(120),
});

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const codes = await prisma.referralCode.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(codes);
}

export async function POST(request: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const body = await request.json();
  const parsed = referralSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const created = await prisma.referralCode.create({
      data: { code: parsed.data.code, label: parsed.data.label },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Code already in use.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Could not create code.' }, { status: 500 });
  }
}
