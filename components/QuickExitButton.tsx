"use client";

import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';

const EXIT_URL = 'https://www.google.com';

export default function QuickExitButton() {
  const t = useTranslations();

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    // Replace so the back button does not return to the app.
    window.location.replace(EXIT_URL);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce-soft">
      <button
        type="button"
        onClick={handleClick}
        aria-label={t('quickExit')}
        className="press flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2 text-xs font-semibold text-white shadow-lift ring-1 ring-brand-900/10 hover:bg-brand-800 animate-pulse-ring"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        <span>{t('quickExit')}</span>
      </button>
    </div>
  );
}
