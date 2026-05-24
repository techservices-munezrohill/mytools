import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') ?? '').trim();

  // Do not hit DB for empty / 1-char queries
  if (!q || q.length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  const term = `%${q.toLowerCase()}%`;

  const suggestions = await prisma.$queryRaw<
    { id: string; name: string; category: string; address: string | null }[]
  >`
    SELECT id, name, category, address
    FROM listings
    WHERE is_hidden = false
      AND (
        LOWER(name) LIKE ${term}
        OR LOWER(description) LIKE ${term}
        OR LOWER(array_to_string(services, ' ')) LIKE ${term}
        OR LOWER(array_to_string(focus_areas, ' ')) LIKE ${term}
      )
    ORDER BY name ASC
    LIMIT 8
  `;

  return NextResponse.json(suggestions, { status: 200 });
}
