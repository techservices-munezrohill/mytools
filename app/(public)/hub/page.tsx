import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function InfoHubPage() {
  const articles = await prisma.article.findMany({
    where: {
      publishedAt: {
        not: null,
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 30,
  });

  return (
    <div className="space-y-4">
      <header className="animate-fade-in-up space-y-1 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <h1 className="text-xl font-semibold">Information hub</h1>
        <p className="text-sm text-brand-100">
          Trusted updates on health, legal rights, safety, and community in Rwanda.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-200 bg-white/70 p-8 text-center text-sm text-slate-500 shadow-soft">
          Articles will appear here once MRI publishes them in the admin panel.
        </div>
      ) : (
        <section className="space-y-3">
          <ul className="space-y-3">
            {articles.map((article) => (
              <li
                key={article.id}
                className="rounded-xl border border-slate-200 bg-white/90 p-4 text-sm shadow-soft hover:border-brand-200 hover:bg-white"
              >
                <Link href={`/hub/${article.slug}`} className="block space-y-1">
                  <h2 className="text-base font-semibold text-slate-900">
                    {article.title}
                  </h2>
                  {article.publishedAt && (
                    <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">
                      {article.publishedAt.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  {article.excerpt && (
                    <p className="line-clamp-3 text-xs text-slate-700">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
