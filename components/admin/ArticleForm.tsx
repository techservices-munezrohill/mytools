"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const ArticleEditor = dynamic(() => import('./ArticleEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
      Loading editor…
    </div>
  ),
});

export type ArticleInitial = {
  id?: string;
  slug: string;
  title: string;
  bodyHtml: string;
  excerpt: string;
  publishedAt: string;
};

const DEFAULT_INITIAL: ArticleInitial = {
  slug: '',
  title: '',
  bodyHtml: '',
  excerpt: '',
  publishedAt: '',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

export default function ArticleForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit';
  initial?: ArticleInitial;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleInitial>(initial ?? DEFAULT_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ArticleInitial>(key: K, value: ArticleInitial[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || slugify(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      publishedAt: form.publishedAt || null,
    };

    const url =
      mode === 'create'
        ? '/api/admin/articles'
        : `/api/admin/articles/${initial?.id}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Could not save.');
      return;
    }

    router.push('/admin/articles');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initial?.id) return;
    if (!confirm('Delete this article? This cannot be undone.')) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/articles/${initial.id}`, { method: 'DELETE' });
    setDeleting(false);
    if (!res.ok) {
      setError('Could not delete article.');
      return;
    }
    router.push('/admin/articles');
    router.refresh();
  };

  return (
    <form
      className="space-y-4 rounded border border-slate-200 bg-white p-4 text-sm shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <label className="block text-slate-700">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-slate-700">Slug</label>
          <input
            required
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-slate-700">Publish date (optional)</label>
          <input
            type="date"
            value={form.publishedAt}
            onChange={(e) => update('publishedAt', e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
          <p className="text-xs text-slate-500">Leave blank to save as a draft.</p>
        </div>
      </div>
      <div className="space-y-1">
        <label className="block text-slate-700">Excerpt</label>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={(e) => update('excerpt', e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-slate-700">Body</label>
        <ArticleEditor value={form.bodyHtml} onChange={(html) => update('bodyHtml', html)} />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded border border-red-300 px-3 py-2 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? 'Deleting…' : 'Delete article'}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-900 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
