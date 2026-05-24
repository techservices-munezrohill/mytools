import ReferralDashboardWidget from '@/components/admin/ReferralDashboardWidget';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminHomePage() {
  const [listingCount, articleCount, referralCount, staleCount] = await Promise.all([
    prisma.listing.count(),
    prisma.article.count(),
    prisma.referralCode.count({ where: { active: true } }),
    prisma.listing.count({
      where: {
        OR: [
          { lastVerifiedAt: null },
          {
            lastVerifiedAt: {
              lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
            },
          },
        ],
      },
    }),
  ]);

  const cards = [
    {
      href: '/admin/directory',
      label: 'Service Directory',
      value: listingCount,
      hint: `${staleCount} not verified in 6 months`,
    },
    {
      href: '/admin/articles',
      label: 'Articles',
      value: articleCount,
      hint: 'Information Hub content',
    },
    {
      href: '/admin/referrals',
      label: 'Active referral codes',
      value: referralCount,
      hint: 'For peer-to-peer distribution',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="animate-fade-in-up rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-brand-100">
          Manage directory entries, publish articles, and track referral links.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <Link
            key={card.href}
            href={card.href}
            style={{ animationDelay: `${idx * 70}ms` }}
            className="press group animate-fade-in-up rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-brand-700">
              {card.label}
            </p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
          </Link>
        ))}
      </section>

      {/* New Referral Snapshot & Quick Actions Section */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* @ts-ignore server component */}
        <ReferralDashboardWidget />
        
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
          <div className="mt-3 space-y-2">
            <Link href="/admin/referrals/report" className="block text-xs text-brand-700 underline">
              Open full referral reports
            </Link>
            <Link href="/admin/referrals" className="block text-xs text-brand-700 underline">
              Manage referral codes
            </Link>
            <Link href="/admin/directory" className="block text-xs text-brand-700 underline">
              Manage directory listings
            </Link>
            <Link href="/admin/flags" className="block text-xs text-brand-700 underline">
              Review safety reports
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-brand-100 bg-white/80 p-4 text-xs text-slate-600 shadow-soft">
        <p className="font-medium text-brand-800">Admin quick guide</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>
            <strong>Directory</strong> — add or edit listings, set map pin and last-verified
            date. Amber &quot;stale&quot; means not verified in 6 months.
          </li>
          <li>
            <strong>Articles</strong> — publish to the public Information Hub (set a publish
            date).
          </li>
          <li>
            <strong>Referral codes</strong> — share links like{' '}
            <code className="rounded bg-slate-100 px-1">?ref=chw01</code> for distribution
            tracking.
          </li>
          <li>
            <strong>Service gaps</strong> —{' '}
            <Link href="/admin/service-requests" className="text-brand-700 underline">
              see what users searched for
            </Link>{' '}
            when nothing (or little) was found.
          </li>
          <li>
            <strong>Safety reports</strong> —{' '}
            <Link href="/admin/flags" className="text-brand-700 underline">
              review flagged listings
            </Link>
            . Three or more reports auto-hide a place until you restore it.
          </li>
        </ul>
      </section>
    </div>
  );
}