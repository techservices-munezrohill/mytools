import { prisma } from '@/lib/prisma';

export default async function ReferralDashboardWidget() {
  // Use SQL casting (::int) to ensure JavaScript treats the count as a number
  const top: any = await prisma.$queryRaw`
    SELECT code, COUNT(*)::int as count
    FROM referral_visit
    GROUP BY code
    ORDER BY count DESC
    LIMIT 5
  `;

  const recent = await prisma.referralVisit.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
      <h3 className="text-sm font-semibold">Referral snapshot</h3>
      <div className="mt-3 space-y-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Top codes</div>
          <ul className="mt-2 space-y-1">
            {top.map((r: any) => (
              <li key={r.code} className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{r.code}</span>
                <span className="text-xs font-semibold text-brand-700">{String(r.count)} visits</span>
              </li>
            ))}
            {top.length === 0 && <li className="text-xs text-slate-500">No data yet</li>}
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent visits</div>
          <ul className="mt-2 space-y-1">
            {recent.map((v: any) => (
              <li key={v.id} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{v.code}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            ))}
            {recent.length === 0 && <li className="text-xs text-slate-500">No visits yet</li>}
          </ul>
        </div>
      </div>
    </aside>
  );
}