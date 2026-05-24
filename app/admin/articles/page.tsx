import Link from 'next/link';
import { prisma } from '@/lib/prisma';

function formatDate(date: Date | null) {
  if (!date) return 'draft';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Articles</h1>
          <p className="text-sm text-slate-600">
            {articles.length} article{articles.length === 1 ? '' : 's'}. Drafts are not
            visible to the public.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-900"
        >
          New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No articles yet.
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/admin/articles/${article.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-slate-50"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate font-medium text-slate-900">{article.title}</p>
                  <p className="text-xs text-slate-500">/{article.slug}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {formatDate(article.publishedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
