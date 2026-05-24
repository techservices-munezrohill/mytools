import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CopyLinkButton from '@/components/CopyLinkButton';
import BookmarkButton from '@/components/BookmarkButton';

export default async function HubArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article || !article.publishedAt) {
    notFound();
  }

  // Fire-and-forget view count increment — no PII captured.
  prisma.article.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  return (
    <div className="space-y-4">
      <header className="space-y-2 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.15em] text-brand-100/80">
          Information hub
        </p>
        <h1 className="text-xl font-semibold">{article.title}</h1>
        {article.publishedAt && (
          <p className="text-xs text-brand-100/80">
            {article.publishedAt.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </header>

      <article className="prose prose-sm max-w-none rounded-xl border border-slate-200 bg-white/90 p-4 text-slate-800 shadow-soft prose-headings:text-slate-900 prose-a:text-brand-700">
        {/* bodyHtml is trusted content from MRI-admin, produced via the editor */}
        <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
      </article>

      <div className="flex items-center justify-between pt-2 text-xs">
        <Link href="/hub" className="font-medium text-brand-700 underline">
          Back to information hub
        </Link>
        <div className="flex items-center gap-2">
          <BookmarkButton
            type="article"
            id={article.id}
            title={article.title}
            meta={article.slug}
          />
          <CopyLinkButton />
        </div>
      </div>
    </div>
  );
}
