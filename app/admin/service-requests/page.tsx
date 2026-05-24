import { prisma } from '@/lib/prisma';

export default async function ServiceGapReportPage() {
  const [zeroResultTerms, lowCoverageTerms, recentRequests] = await Promise.all([
    prisma.serviceRequest.groupBy({
      by: ['searchTerm'],
      where: { isLowCoverage: false },
      _count: { _all: true },
      orderBy: { searchTerm: 'asc' },
      take: 50,
    }),
    prisma.serviceRequest.groupBy({
      by: ['searchTerm'],
      where: { isLowCoverage: true },
      _count: { _all: true },
      orderBy: { searchTerm: 'asc' },
      take: 50,
    }),
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">
          Reports
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Service gaps</h1>
        <p className="mt-1 text-sm text-brand-100">
          Top search terms where the directory has no or very few results. Use this
          to plan which services to add next.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">No results</h2>
          <p className="mt-1 text-xs text-slate-500">
            Searches that returned zero listings. These are the clearest gaps.
          </p>
          <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
            {zeroResultTerms.length === 0 && (
              <li className="py-2 text-xs text-slate-500">
                No zero-result searches logged yet.
              </li>
            )}
            {zeroResultTerms.map((row) => (
              <li key={row.searchTerm} className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-800">{row.searchTerm}</span>
                <span className="text-xs text-slate-500">{row._count._all} searches</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Low coverage</h2>
          <p className="mt-1 text-xs text-slate-500">
            Searches that returned only a few listings (&lt;3). These indicate areas
            where MRI could expand options.
          </p>
          <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
            {lowCoverageTerms.length === 0 && (
              <li className="py-2 text-xs text-slate-500">
                No low-coverage searches logged yet.
              </li>
            )}
            {lowCoverageTerms.map((row) => (
              <li key={row.searchTerm} className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-800">{row.searchTerm}</span>
                <span className="text-xs text-slate-500">{row._count._all} searches</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm shadow-soft">
        <h2 className="text-sm font-semibold text-slate-900">Recent notes from users</h2>
        <p className="mt-1 text-xs text-slate-500">
          Anonymous explanations users shared when they could not find what they
          needed.
        </p>
        <ul className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
          {recentRequests.filter((r) => r.freeText).length === 0 && (
            <li className="py-2 text-xs text-slate-500">
              No free-text notes submitted yet.
            </li>
          )}
          {recentRequests
            .filter((r) => r.freeText)
            .map((r) => (
              <li key={r.id} className="py-2">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  {r.searchTerm}{' '}
                  <span className="inline-block text-[10px] font-normal text-slate-400">
                    · {r.createdAt.toLocaleString()}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-800">{r.freeText}</p>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
