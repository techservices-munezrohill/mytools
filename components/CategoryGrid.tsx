import Link from 'next/link';
import { HeartPulse, Scale, Users, Coffee, Home, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

type Category = {
  key: string;
  category: string;
  labelKey: string;
  Icon: typeof HeartPulse;
  tone: string;
};

const CATEGORIES: Category[] = [
  {
    key: 'health',
    category: 'HEALTH',
    labelKey: 'categories.health',
    Icon: HeartPulse,
    tone: 'border-rose-200 bg-rose-50 text-rose-900',
  },
  {
    key: 'legal',
    category: 'LEGAL',
    labelKey: 'categories.legal',
    Icon: Scale,
    tone: 'border-indigo-200 bg-indigo-50 text-indigo-900',
  },
  {
    key: 'organizations',
    category: 'ORGANIZATION',
    labelKey: 'categories.organizations',
    Icon: Users,
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  {
    key: 'safeSpaces',
    category: 'SAFE_SPACE',
    labelKey: 'categories.safeSpaces',
    Icon: Coffee,
    tone: 'border-sky-200 bg-sky-50 text-sky-900',
  },
  {
    key: 'housing',
    category: 'HOUSING',
    labelKey: 'categories.housing',
    Icon: Home,
    tone: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  {
    key: 'emergency',
    category: 'EMERGENCY',
    labelKey: 'categories.emergency',
    Icon: Phone,
    tone: 'border-red-200 bg-red-50 text-red-900',
  },
];

export default async function CategoryGrid() {
  const t = await getTranslations();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {CATEGORIES.map(({ key, category, labelKey, Icon, tone }, idx) => (
        <Link
          key={key}
          href={`/directory?category=${category}`}
          style={{ animationDelay: `${idx * 60}ms` }}
          className={`press group relative flex min-h-[96px] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-4 text-center text-sm font-medium shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift animate-fade-in-up ${tone}`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 transition-transform duration-200 group-hover:scale-110">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <span>{t(labelKey)}</span>
        </Link>
      ))}
    </div>
  );
}
