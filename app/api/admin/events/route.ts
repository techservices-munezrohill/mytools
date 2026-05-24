import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(events);
}

const createSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  bodyHtml: z.string(),
  emergencyContacts: z.any().optional(),
  safetyTips: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

export async function POST(req: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const event = await prisma.event.create({ data: parsed.data as any });
  return NextResponse.json(event, { status: 201 });
}
