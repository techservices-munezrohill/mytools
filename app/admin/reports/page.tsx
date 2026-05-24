import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ReportsExportButton from '@/components/admin/ReportsExportButton';

export default async function AdminReportsPage() {
  const [
    totalUsers, usersWithDemographics, genderCounts, ageCounts, provinceCounts,
    referralSourceCounts, topUsageReasons, totalListings, categoryCounts,
    staleListings, totalArticles, topArticles, totalFlags, topSearchTerms,
    zeroResultCount, totalEvents, recentRegistrations,
  ] = await Promise.all([
    prisma.appUser.count(),
    prisma.appUser.count({ where: { OR: [{ gender: { not: null } }, { ageRange: { not: null } }] } }),
    prisma.appUser.groupBy({ by: ['gender'], _count: { _all: true }, orderBy: { _count: { gender: 'desc' } } }),
    prisma.appUser.groupBy({ by: ['ageRange'], _count: { _all: true }, orderBy: { _count: { ageRange: 'desc' } } }),
    prisma.appUser.groupBy({ by: ['province'], where: { province: { not: null } }, _count: { _all: true }, orderBy: { _count: { province: 'desc' } } }),
    prisma.appUser.groupBy({ by: ['referralSource'], where: { referralSource: { not: null } }, _count: { _all: true }, orderBy: { _count: { referralSource: 'desc' } } }),
    prisma.$queryRaw`SELECT unnest(usage_reasons) AS reason, COUNT(*) AS count FROM app_users WHERE array_length(usage_reasons, 1) > 0 GROUP BY reason ORDER BY count DESC LIMIT 10` as Promise<{ reason: string; count: bigint }[]>,
    prisma.listing.count(),
    prisma.listing.groupBy({ by: ['category'], _count: { _all: true }, orderBy: { _count: { category: 'desc' } } }),
    prisma.listing.count({ where: { OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180) } }] } }),
    prisma.article.count(),
    prisma.article.findMany({ where: { publishedAt: { not: null } }, orderBy: { viewCount: 'desc' }, take: 10, select: { id: true, title: true, slug: true, viewCount: true } }),
    prisma.listingFlag.count(),
    prisma.serviceRequest.groupBy({ by: ['searchTerm'], where: { isLowCoverage: false }, _count: { _all: true }, orderBy: { _count: { searchTerm: 'desc' } }, take: 15 }),
    prisma.serviceRequest.count({ where: { isLowCoverage: false } }),
    prisma.event.count({ where: { active: true } }),
    prisma.appUser.count({ where: { createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) } } }),
  ]);

  const genderLabels: Record<string, string> = {
    MAN: 'Man', WOMAN: 'Woman', NON_BINARY: 'Non-binary', TRANSGENDER_MAN: 'Trans man',
    TRANSGENDER_WOMAN: 'Trans woman', GENDERQUEER: 'Genderqueer', SELF_DESCRIBE: 'Self-described',
    PREFER_NOT_TO_SAY: 'Prefer not to say',
  };
  const ageLabels: Record<string, string> = {
    AGE_18_24: '18–24', AGE_25_34: '25–34', AGE_35_44: '35–44', AGE_45_PLUS: '45+', PREFER_NOT_TO_SAY: 'Prefer not to say',
  };
  const catLabels: Record<string, string> = {
    HEALTH: 'Health', LEGAL: 'Legal', ORGANIZATION: 'Organizations', SAFE_SPACE: 'Safe spaces', HOUSING: 'Housing', EMERGENCY: 'Emergency',
  };

  // Prepare export data
  const exportData = {
    demographics: {
      gender: genderCounts.map((r) => ({ label: genderLabels[r.gender ?? ''] ?? r.gender ?? 'Unknown', count: r._count._all })),
      age: ageCounts.map((r) => ({ label: ageLabels[r.ageRange ?? ''] ?? r.ageRange ?? 'Unknown', count: r._count._all })),
      province: provinceCounts.map((r) => ({ label: r.province ?? 'Unknown', count: r._count._all })),
    },
    articles: topArticles.map((a) => ({ title: a.title, views: a.viewCount })),
    searchGaps: topSearchTerms.map((r) => ({ term: r.searchTerm, searches: r._count._all })),
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">MRI reports</p>
        <h1 className="mt-1 text-2xl font-semibold">Analytics dashboard</h1>
        <p className="mt-1 text-sm text-brand-100">
          Aggregate insights. No individual user records are displayed or exportable.
        </p>
      </section>

      {/* Registration funnel */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Registered users', value: totalUsers },
          { label: 'Last 30 days', value: recentRegistrations },
          { label: 'With demographics', value: usersWithDemographics },
          { label: 'Conversion', value: totalUsers > 0 ? `${Math.round((usersWithDemographics / totalUsers) * 100)}%` : '—' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft">
            <p className="text-xs uppercase tracking-[0.15em] text-brand-700">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{c.value}</p>
          </div>
        ))}
      </section>

      {/* Community demographics */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Gender identity</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {genderCounts.filter((r) => r.gender).map((r) => (
              <li key={r.gender} className="flex items-center justify-between py-2">
                <span className="text-slate-700">{genderLabels[r.gender!] ?? r.gender}</span>
                <span className="text-xs font-medium text-slate-900">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Age range</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {ageCounts.filter((r) => r.ageRange).map((r) => (
              <li key={r.ageRange} className="flex items-center justify-between py-2">
                <span className="text-slate-700">{ageLabels[r.ageRange!] ?? r.ageRange}</span>
                <span className="text-xs font-medium text-slate-900">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Province / region</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {provinceCounts.map((r) => (
              <li key={r.province} className="flex items-center justify-between py-2">
                <span className="text-slate-700">{r.province}</span>
                <span className="text-xs font-medium text-slate-900">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Usage reasons</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {topUsageReasons.map((r) => (
              <li key={r.reason} className="flex items-center justify-between py-2">
                <span className="text-slate-700">{r.reason}</span>
                <span className="text-xs font-medium text-slate-900">{Number(r.count)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Directory insights */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Directory overview</h2>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Total listings</span><span className="font-medium text-slate-900">{totalListings}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Stale (not verified 6 months)</span><span className="font-medium text-amber-700">{staleListings}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total safety reports</span><span className="font-medium text-slate-900">{totalFlags}</span></div>
          </div>
          <h3 className="mt-4 text-xs font-semibold text-slate-800">By category</h3>
          <ul className="mt-2 divide-y divide-slate-100">
            {categoryCounts.map((r) => (
              <li key={r.category} className="flex items-center justify-between py-1.5">
                <span className="text-slate-700">{catLabels[r.category] ?? r.category}</span>
                <span className="text-xs font-medium text-slate-900">{r._count._all}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Article performance</h2>
          <p className="mt-1 text-xs text-slate-500">{totalArticles} total articles</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {topArticles.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2">
                <span className="text-slate-700 line-clamp-1">{a.title}</span>
                <span className="shrink-0 text-xs font-medium text-slate-900">{a.viewCount} views</span>
              </li>
            ))}
            {topArticles.length === 0 && (
              <li className="py-2 text-xs text-slate-500">No articles published yet.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Search analytics & tourism */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Service gaps (top zero-result searches)</h2>
          <p className="mt-1 text-xs text-slate-500">{zeroResultCount} total zero-result searches</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {topSearchTerms.map((r) => (
              <li key={r.searchTerm} className="flex items-center justify-between py-2">
                <span className="text-slate-700">{r.searchTerm}</span>
                <span className="text-xs font-medium text-slate-900">{r._count._all}</span>
              </li>
            ))}
            {topSearchTerms.length === 0 && (
              <li className="py-2 text-xs text-slate-500">No zero-result searches logged yet.</li>
            )}
          </ul>
          <Link href="/admin/service-requests" className="mt-2 block text-xs text-brand-700 underline">Full service gap report →</Link>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
            <h2 className="text-sm font-semibold text-slate-900">Tourism mode</h2>
            <div className="mt-2 text-xs"><span className="text-slate-500">Active events:</span> <span className="font-medium text-slate-900">{totalEvents}</span></div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
            <h2 className="text-sm font-semibold text-slate-900">Referral tracking</h2>
            <Link href="/admin/referrals/report" className="mt-2 block text-xs text-brand-700 underline">Open referral report →</Link>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
            <h2 className="text-sm font-semibold text-slate-900">Referral source breakdown</h2>
            <ul className="mt-2 divide-y divide-slate-100">
              {referralSourceCounts.map((r) => (
                <li key={r.referralSource} className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-slate-700">{r.referralSource}</span>
                  <span className="text-xs font-medium text-slate-900">{r._count._all}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Export */}
      <section className="rounded-xl border border-brand-100 bg-white/80 p-4 shadow-soft">
        <h2 className="text-sm font-semibold text-slate-900">Export</h2>
        <p className="mt-1 text-xs text-slate-500">Download aggregate reports as CSV. No individual user records are included.</p>
        <div className="mt-3">
          <ReportsExportButton data={exportData} />
        </div>
      </section>
    </div>
  );
}
