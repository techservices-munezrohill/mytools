import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

const updateSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  title: z.string().trim().min(1).max(240).optional(),
  bodyHtml: z.string().min(1).max(200000).optional(),
  excerpt: z.string().trim().max(500).nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const article = await prisma.article.findUnique({ where: { id: params.id } });
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(article);
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
  try {
    const updated = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...data,
        excerpt: data.excerpt ?? undefined,
        publishedAt:
          data.publishedAt === null
            ? null
            : data.publishedAt
              ? new Date(data.publishedAt)
              : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already in use.' }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  await prisma.article.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
