"use client";

import Link from 'next/link';
import { I18nProvider, useT } from '@/components/I18n';

function HomeContent() {
  const t = useT();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{t('app.name')}</h1>
        <p className="text-sm text-slate-600">{t('home.tagline')}</p>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Link
          href="/directory"
          className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm shadow-sm hover:border-slate-300"
        >
          {t('home.directory')}
        </Link>
        <Link
          href="/hub"
          className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm shadow-sm hover:border-slate-300"
        >
          {t('home.hub')}
        </Link>
        <Link
          href="/emergency"
          className="rounded-lg border border-amber-200 bg-white p-4 text-center text-sm shadow-sm hover:border-amber-300"
        >
          {t('home.emergency')}
        </Link>
      </section>

      <section className="space-y-2 text-xs text-slate-500">
        <p>Quick safety tips and privacy information will appear here.</p>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <I18nProvider locale="en">
      <HomeContent />
    </I18nProvider>
  );
}
