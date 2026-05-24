'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookOpen, MapPin, Trash2 } from 'lucide-react';
import {
  getAllBookmarks,
  removeBookmark,
  type Bookmark as BookmarkItem,
} from '@/lib/bookmarks';

function formatCategory(category: string): string {
  switch (category) {
    case 'HEALTH':
      return 'Health';
    case 'LEGAL':
      return 'Legal';
    case 'ORGANIZATION':
      return 'Organization';
    case 'SAFE_SPACE':
      return 'Safe space';
    case 'HOUSING':
      return 'Housing';
    case 'EMERGENCY':
      return 'Emergency';
    default:
      return category;
  }
}

function BookmarkCard({
  item,
  onRemove,
}: {
  item: BookmarkItem;
  onRemove: () => void;
}) {
  const href =
    item.type === 'article' ? `/hub/${item.meta}` : `/directory/${item.id}`;

  const Icon = item.type === 'article' ? BookOpen : MapPin;
  const typeLabel = item.type === 'article' ? 'Article' : formatCategory(item.meta);

  return (
    <li className="group flex items-start gap-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft backdrop-blur hover:border-brand-300 hover:bg-white">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <Link href={href} className="block font-medium text-slate-900 hover:text-brand-700">
          {item.title}
        </Link>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {typeLabel} · saved{' '}
          {new Date(item.savedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-full p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
        aria-label={`Remove ${item.title} from bookmarks`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBookmarks(getAllBookmarks());
    setLoaded(true);
  }, []);

  const handleRemove = (item: BookmarkItem) => {
    removeBookmark(item.type, item.id);
    setBookmarks(getAllBookmarks());
  };

  const articles = bookmarks.filter((b) => b.type === 'article');
  const listings = bookmarks.filter((b) => b.type === 'listing');

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up space-y-1 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">
          MyTools
        </p>
        <h1 className="text-xl font-semibold">Saved items</h1>
        <p className="text-sm text-brand-100">
          Your bookmarked services and articles, stored on this device.
        </p>
      </header>

      {loaded && bookmarks.length === 0 && (
        <div className="rounded-xl border border-dashed border-brand-200 bg-white/70 p-8 text-center text-sm text-slate-600 shadow-soft">
          <Bookmark className="mx-auto mb-2 h-8 w-8 text-brand-300" />
          <p className="font-medium text-slate-800">No saved items yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Tap <strong>Save</strong> on any directory listing or article to keep it here
            for quick access — even offline.
          </p>
        </div>
      )}

      {listings.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-brand-800">
            Directory listings
          </h2>
          <ul className="space-y-2">
            {listings.map((item) => (
              <BookmarkCard
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </ul>
        </section>
      )}

      {articles.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-brand-800">
            Articles
          </h2>
          <ul className="space-y-2">
            {articles.map((item) => (
              <BookmarkCard
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-slate-500">
        Bookmarks are saved in your browser on this device. They are not linked
        to any account and are never sent to our server.
      </p>
    </div>
  );
}
