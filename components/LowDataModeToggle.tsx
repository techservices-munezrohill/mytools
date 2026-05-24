'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mytools_low_data';

export default function LowDataModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === '1') {
      setEnabled(true);
      document.documentElement.classList.add('low-data');
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      document.documentElement.classList.add('low-data');
      window.localStorage.setItem(STORAGE_KEY, '1');
    } else {
      document.documentElement.classList.remove('low-data');
      window.localStorage.setItem(STORAGE_KEY, '0');
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded border px-2 py-1 text-[11px] transition-colors ${
        enabled
          ? 'border-amber-300 bg-amber-50 text-amber-800'
          : 'border-brand-200 bg-white/80 text-slate-600 hover:text-brand-700'
      }`}
      aria-pressed={enabled}
    >
      {enabled ? 'Low data ✓' : 'Low data'}
    </button>
  );
}
