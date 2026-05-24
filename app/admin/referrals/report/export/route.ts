import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

export async function GET(request: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code') || undefined;
    const from = searchParams.get('from') ? new Date(searchParams.get('from') as string) : undefined;
    const to = searchParams.get('to') ? new Date(searchParams.get('to') as string) : undefined;

    const rows = await prisma.referralVisit.findMany({
      where: {
        ...(code ? { code } : {}),
        ...(from ? { createdAt: { gte: from } } : {}),
        ...(to ? { createdAt: { lte: to } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    const csvRows = [['code', 'created_at'], ...rows.map((r) => [r.code, r.createdAt.toISOString()])];
    const csv = csvRows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="referral_visits.csv"',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

