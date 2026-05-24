'use client';

import { useEffect, useState } from 'react';
import { Bookmark as BookmarkIcon, BookmarkCheck } from 'lucide-react';
import {
  isBookmarked as checkBookmarked,
  toggleBookmark,
  type BookmarkType,
} from '@/lib/bookmarks';

export default function BookmarkButton({
  type,
  id,
  title,
  meta,
}: {
  /** 'article' or 'listing'. */
  type: BookmarkType;
  /** Primary key of the item. */
  id: string;
  /** Human-readable label persisted with the bookmark. */
  title: string;
  /** Slug (articles) or category (listings). */
  meta: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(checkBookmarked(type, id));
  }, [type, id]);

  const handleToggle = () => {
    const next = toggleBookmark(type, id, title, meta);
    setSaved(next);
  };

  const Icon = saved ? BookmarkCheck : BookmarkIcon;
  const label = saved ? 'Saved' : 'Save';

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`press inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        saved
          ? 'border-brand-300 bg-brand-50 text-brand-800'
          : 'border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:text-brand-700'
      }`}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from bookmarks` : `Save ${title} to bookmarks`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
  );
}
