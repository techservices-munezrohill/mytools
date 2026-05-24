import { requireAdmin } from '@/lib/requireAdmin';
import { prisma } from '@/lib/prisma';
import ReferralReportTable from '@/components/admin/ReferralReportTable';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function ReferralReportPage({ searchParams }: { searchParams?: { code?: string; from?: string; to?: string } }) {
  const { session } = await requireAdmin();

  // SECURITY CHECK & LOGGING
  if (!session) {
    const headerList = headers();
    const ip = headerList.get('x-forwarded-for') || 'Unknown IP';
    const userAgent = headerList.get('user-agent') || 'Unknown Device';
    
    // This logs to your terminal/server logs for audit purposes
    console.warn(`[UNAUTHORIZED ACCESS ATTEMPT]
      Time: ${new Date().toISOString()}
      Path: /admin/referrals/report
      IP Address: ${ip}
      Device: ${userAgent}
    `);

    // Redirect to login page for a better user experience
    redirect('/admin/login');
  }

  const code = searchParams?.code;
  const from = searchParams?.from ? new Date(searchParams.from) : undefined;
  const to = searchParams?.to ? new Date(searchParams.to) : undefined;

  // Aggregate data using Prisma
  const agg = await prisma.referralVisit.groupBy({
    by: ['code'],
    where: {
      code: code ? { contains: code, mode: 'insensitive' } : undefined,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    _count: { _all: true },
    _min: { createdAt: true },
    _max: { createdAt: true },
    orderBy: { _count: { code: 'desc' } },
  });

  const formattedData = agg.map((row) => ({
    code: row.code,
    count: row._count._all,
    first_seen: row._min.createdAt?.toISOString(),
    last_seen: row._max.createdAt?.toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Referral Traffic Report</h1>
          <p className="text-sm text-slate-600">See which codes are driving the most visits.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/referrals"
            className="text-sm bg-slate-100 px-3 py-1 rounded hover:bg-slate-200"
          >
            Manage Codes
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <form className="flex items-center gap-2 mb-4">
          <input
            name="code"
            defaultValue={code ?? ''}
            placeholder="Filter code"
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="from"
            type="date"
            defaultValue={searchParams?.from ?? ''}
            className="rounded border px-2 py-1 text-sm"
          />
          <input
            name="to"
            type="date"
            defaultValue={searchParams?.to ?? ''}
            className="rounded border px-2 py-1 text-sm"
          />
          <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
            Apply
          </button>
        </form>

        {/* This component handles the Table UI and the Export trigger */}
        <ReferralReportTable initial={formattedData as any} />
      </div>
    </div>
  );
}