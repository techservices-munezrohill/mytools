import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const event = await prisma.event.update({ where: { id: params.id }, data: json });
  return NextResponse.json(event);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
