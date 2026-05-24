'use client';

import { useRouter } from 'next/navigation';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'fr', label: 'Français' },
] as const;

export default function LanguageSwitcher() {
  const router = useRouter();

  const current =
    typeof document !== 'undefined'
      ? (document.cookie.match(/(?:^|; )locale=([^;]*)/)?.[1] ?? 'en')
      : 'en';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value;
    document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    router.refresh();
  };

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      className="rounded border border-brand-200 bg-white/80 px-2 py-1 text-xs text-slate-700 backdrop-blur"
      aria-label="Language"
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
