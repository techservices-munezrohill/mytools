import { getTranslations } from 'next-intl/server';
import { Phone, HeartPulse, Scale, Shield } from 'lucide-react';

// Static values for Sprint 1. MRI will make these admin-configurable in a later sprint.
// Using internationally-known emergency numbers for Rwanda with safe placeholders.
const EMERGENCY_CONTACTS = [
  {
    labelKey: 'emergency.contacts.police',
    number: '112',
    Icon: Shield,
    tone: 'bg-red-50 border-red-200 text-red-900',
  },
  {
    labelKey: 'emergency.contacts.medical',
    number: '912',
    Icon: HeartPulse,
    tone: 'bg-rose-50 border-rose-200 text-rose-900',
  },
  {
    labelKey: 'emergency.contacts.legalAid',
    number: '+250 788 000 000',
    Icon: Scale,
    tone: 'bg-amber-50 border-amber-200 text-amber-900',
  },
];

const SAFETY_TIPS_KEYS = [
  'emergency.tips.1',
  'emergency.tips.2',
  'emergency.tips.3',
  'emergency.tips.4',
  'emergency.tips.5',
  'emergency.tips.6',
] as const;

export default async function EmergencyPage() {
  const t = await getTranslations();

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up space-y-1 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-100/90">
          {t('emergency.title')}
        </p>
        <p className="text-sm text-amber-50">{t('emergency.subtitle')}</p>
      </header>

      <section aria-labelledby="contacts-heading" className="space-y-3">
        <h2
          id="contacts-heading"
          className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500"
        >
          {t('emergency.contactsHeading')}
        </h2>
        <ul className="space-y-2">
          {EMERGENCY_CONTACTS.map(({ labelKey, number, Icon, tone }, idx) => (
            <li key={number} style={{ animationDelay: `${idx * 80}ms` }} className="animate-fade-in-up">
              <a
                href={`tel:${number.replace(/\s+/g, '')}`}
                className={`press flex items-center justify-between gap-3 rounded-xl border p-4 text-sm shadow-soft hover:shadow-lift ${tone} ${
                  idx === 0 ? 'animate-pulse-glow' : ''
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-medium">{t(labelKey)}</span>
                </span>
                <span className="tabular-nums font-mono text-sm">{number}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="center-heading" className="space-y-2">
        <h2
          id="center-heading"
          className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500"
        >
          {t('emergency.nearestCenterHeading')}
        </h2>
        <div className="rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft backdrop-blur">
          <p className="font-medium text-slate-900">
            {t('emergency.defaultCenter.name')}
          </p>
          <p className="text-slate-600">{t('emergency.defaultCenter.city')}</p>
          <p className="mt-2 text-xs text-slate-500">
            {t('emergency.defaultCenter.note')}
          </p>
        </div>
      </section>

      <section aria-labelledby="tips-heading" className="space-y-2">
        <h2
          id="tips-heading"
          className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500"
        >
          {t('emergency.tipsHeading')}
        </h2>
        <ul className="list-disc space-y-1 rounded-xl border border-brand-100 bg-white/80 p-4 pl-9 text-sm text-slate-700 shadow-soft">
          {SAFETY_TIPS_KEYS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-gradient-to-br from-brand-800 to-brand-900 p-4 text-center text-sm text-brand-50 shadow-soft">
        <div className="flex items-center justify-center gap-2">
          <Phone className="h-4 w-4" aria-hidden />
          <span>{t('emergency.quickExitReminder')}</span>
        </div>
      </section>
    </div>
  );
}
