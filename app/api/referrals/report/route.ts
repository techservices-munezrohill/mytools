import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(request: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code') || undefined;
    const from = searchParams.get('from')
      ? new Date(searchParams.get('from') as string)
      : undefined;
    const to = searchParams.get('to')
      ? new Date(searchParams.get('to') as string)
      : undefined;

    // aggregated counts per code
    const agg = await prisma.$queryRaw`
      SELECT code, COUNT(*) as count, MIN(created_at) as first_seen, MAX(created_at) as last_seen
      FROM referral_visit
      ${code ? prisma.$queryRawUnsafe(`WHERE code = ${code}`) : ''}
      ${from ? prisma.$queryRawUnsafe(`AND created_at >= ${from.toISOString()}`) : ''}
      ${to ? prisma.$queryRawUnsafe(`AND created_at <= ${to.toISOString()}`) : ''}
      GROUP BY code
      ORDER BY count DESC
    `;

    // recent raw visits (limit 100)
    const visits = await prisma.referralVisit.findMany({
      where: {
        code: code,
        ...(from ? { createdAt: { gte: from } } : {}),
        ...(to ? { createdAt: { lte: to } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ agg, visits });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
