import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and dashes.'),
  title: z.string().trim().min(1).max(240),
  bodyHtml: z.string().min(1).max(200000),
  excerpt: z.string().trim().max(500).optional().or(z.literal('')),
  publishedAt: z.string().nullable().optional(),
});

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const articles = await prisma.article.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const body = await request.json();
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const created = await prisma.article.create({
      data: {
        slug: data.slug,
        title: data.title,
        bodyHtml: data.bodyHtml,
        excerpt: data.excerpt || null,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already in use.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Could not create article.' }, { status: 500 });
  }
}
