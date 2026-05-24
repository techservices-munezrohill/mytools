import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New article</h1>
      <ArticleForm mode="create" />
    </div>
  );
}
