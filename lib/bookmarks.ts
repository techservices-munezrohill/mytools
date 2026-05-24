// Sprint 2 bookmarks — localStorage-based.
// When user accounts land in Sprint 3, bookmarks will be persisted to the DB
// for registered users and this localStorage layer will remain the fallback
// for anonymous (Tier 1) access.

const STORAGE_KEY = 'mytools_bookmarks';

export type BookmarkType = 'article' | 'listing';

export interface Bookmark {
  /** Type of the bookmarked item. */
  type: BookmarkType;
  /** Primary key — article.id or listing.id. */
  id: string;
  /** Human-readable label shown in the bookmarks list. */
  title: string;
  /** URL-safe slug (articles) or category string (listings). */
  meta: string;
  /** Epoch ms when the bookmark was created. */
  savedAt: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readAll(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Bookmark[];
  } catch {
    return [];
  }
}

function writeAll(bookmarks: Bookmark[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // Storage full or disabled — silently degrade.
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Return every saved bookmark, newest first. */
export function getAllBookmarks(): Bookmark[] {
  return readAll().sort((a, b) => b.savedAt - a.savedAt);
}

/** Return bookmarks of a given type, newest first. */
export function getBookmarksByType(type: BookmarkType): Bookmark[] {
  return getAllBookmarks().filter((b) => b.type === type);
}

/** Check whether an item is already bookmarked. */
export function isBookmarked(type: BookmarkType, id: string): boolean {
  return readAll().some((b) => b.type === type && b.id === id);
}

/** Add a bookmark. No-op if already saved. */
export function addBookmark(
  type: BookmarkType,
  id: string,
  title: string,
  meta: string,
): void {
  const all = readAll();
  if (all.some((b) => b.type === type && b.id === id)) return;
  all.push({ type, id, title, meta, savedAt: Date.now() });
  writeAll(all);
}

/** Remove a bookmark by type + id. */
export function removeBookmark(type: BookmarkType, id: string): void {
  writeAll(readAll().filter((b) => !(b.type === type && b.id === id)));
}

/** Toggle a bookmark and return the new bookmarked state. */
export function toggleBookmark(
  type: BookmarkType,
  id: string,
  title: string,
  meta: string,
): boolean {
  if (isBookmarked(type, id)) {
    removeBookmark(type, id);
    return false;
  }
  addBookmark(type, id, title, meta);
  return true;
}
