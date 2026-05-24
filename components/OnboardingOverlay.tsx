'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Home, LogOut, Smartphone } from 'lucide-react';

const STORAGE_KEY = 'mytools.onboardingDone';

export default function OnboardingOverlay() {
  const t = useTranslations('onboarding');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-brand-100 bg-white p-6 shadow-lift">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-700">
          {t('eyebrow')}
        </p>
        <h2 id="onboarding-title" className="mt-1 text-xl font-semibold text-slate-900">
          {t('title')}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{t('body')}</p>

        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          <li className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Home className="h-4 w-4" aria-hidden />
            </span>
            <span>{t('tipBrowse')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Smartphone className="h-4 w-4" aria-hidden />
            </span>
            <span>{t('tipInstall')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <LogOut className="h-4 w-4" aria-hidden />
            </span>
            <span>{t('tipQuickExit')}</span>
          </li>
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={dismiss}
            className="order-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:order-1"
          >
            {t('skip')}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="order-1 rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 sm:order-2"
          >
            {t('continue')}
          </button>
        </div>
      </div>
    </div>
  );
}