import { getTranslations } from 'next-intl/server';
import { Bookmark, BookOpen, LifeBuoy } from 'lucide-react';
import CategoryGrid from '@/components/CategoryGrid';
import InstallPrompt from '@/components/InstallPrompt';
import Link from 'next/link';

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="space-y-10">
      <header className="animate-fade-in-up space-y-2 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">
          {t('app.name')}
        </p>
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">
          {t('home.tagline')}
        </h1>
      </header>

      <section aria-labelledby="categories-heading" className="space-y-3">
        <h2
          id="categories-heading"
          className="text-xs font-medium uppercase tracking-[0.15em] text-brand-800"
        >
          {t('home.categoriesHeading')}
        </h2>
        <CategoryGrid />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/hub"
          className="press group flex items-center gap-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft backdrop-blur hover:border-brand-300 hover:shadow-lift"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-transform group-hover:scale-110">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-medium text-slate-800">{t('home.hub')}</span>
        </Link>
        <Link
          href="/bookmarks"
          className="press group flex items-center gap-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft backdrop-blur hover:border-brand-300 hover:shadow-lift"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-transform group-hover:scale-110">
            <Bookmark className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-medium text-slate-800">{t('home.bookmarks')}</span>
        </Link>
        <Link
          href="/emergency"
          className="press group flex items-center gap-3 rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 p-4 text-sm font-medium text-amber-900 shadow-soft hover:shadow-lift animate-pulse-glow sm:col-span-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-200 text-amber-800 transition-transform group-hover:scale-110">
            <LifeBuoy className="h-5 w-5" aria-hidden />
          </span>
          <span>{t('home.emergency')}</span>
        </Link>
      </section>

      <InstallPrompt />

      <p className="text-xs text-slate-500">{t('home.privacyFooter')}</p>
    </div>
  );
}
