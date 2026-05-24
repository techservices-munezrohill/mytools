import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleForm from '@/components/admin/ArticleForm';

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit article</h1>
      <ArticleForm
        mode="edit"
        initial={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          bodyHtml: article.bodyHtml,
          excerpt: article.excerpt ?? '',
          publishedAt: article.publishedAt
            ? article.publishedAt.toISOString().slice(0, 10)
            : '',
        }}
      />
    </div>
  );
}
