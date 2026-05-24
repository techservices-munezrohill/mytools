"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_STORAGE_KEY = 'mytools.installPromptDismissedAt';
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 2 weeks

export default function InstallPrompt() {
  const t = useTranslations();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (raw) {
      const at = Number(raw);
      if (!Number.isNaN(at) && Date.now() - at < DISMISS_TTL_MS) {
        setDismissed(true);
      }
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (dismissed || !deferred) {
    return null;
  }

  const handleInstall = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
  };

  const handleDismiss = () => {
    setDeferred(null);
    setDismissed(true);
    localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm">
      <p className="font-medium text-slate-900">{t('install.title')}</p>
      <p className="mt-1 text-xs text-slate-600">{t('install.body')}</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="rounded bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-900"
        >
          {t('install.cta')}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
        >
          {t('install.dismiss')}
        </button>
      </div>
    </div>
  );
}
