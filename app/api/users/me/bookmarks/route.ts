import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/user-auth';

// GET /api/users/me/bookmarks
export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const bookmarks = await prisma.userBookmark.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(bookmarks);
}

const addSchema = z.object({
  type: z.enum(['article', 'listing']),
  itemId: z.string().min(1),
  title: z.string().min(1).max(200),
  meta: z.string().max(200),
});

// POST /api/users/me/bookmarks
export async function POST(req: Request) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { type, itemId, title, meta } = parsed.data;

  // Upsert to avoid duplicate errors
  const bookmark = await prisma.userBookmark.upsert({
    where: {
      userId_type_itemId: {
        userId: session.userId,
        type,
        itemId,
      },
    },
    update: {},
    create: {
      userId: session.userId,
      type,
      itemId,
      title,
      meta,
    },
  });

  return NextResponse.json({ ok: true, bookmark }, { status: 201 });
}

const deleteSchema = z.object({
  type: z.enum(['article', 'listing']),
  itemId: z.string().min(1),
});

// DELETE /api/users/me/bookmarks — body: { type, itemId }
export async function DELETE(req: Request) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = deleteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await prisma.userBookmark.deleteMany({
    where: {
      userId: session.userId,
      type: parsed.data.type,
      itemId: parsed.data.itemId,
    },
  });

  return NextResponse.json({ ok: true });
}
