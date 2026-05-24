import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Phone, HeartPulse, Scale, Shield, MapPin, ArrowRight } from 'lucide-react';

export default async function VisitorPage() {
  const events = await prisma.event.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up space-y-2 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">Visitor mode</p>
        <h1 className="text-xl font-semibold">Welcome to Rwanda</h1>
        <p className="text-sm text-brand-100">
          Quick access to safe health services, emergency contacts, and local safety guidance. No registration required.
        </p>
      </header>

      {/* Emergency contacts */}
      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-brand-800">Emergency contacts</h2>
        <ul className="space-y-2">
          {[
            { label: 'Police emergency', number: '112', Icon: Shield, tone: 'bg-red-50 border-red-200 text-red-900' },
            { label: 'Medical emergency', number: '912', Icon: HeartPulse, tone: 'bg-rose-50 border-rose-200 text-rose-900' },
            { label: 'Legal aid hotline', number: '+250 788 000 000', Icon: Scale, tone: 'bg-amber-50 border-amber-200 text-amber-900' },
          ].map(({ label, number, Icon, tone }) => (
            <li key={number}>
              <a
                href={`tel:${number.replace(/\s+/g, '')}`}
                className={`press flex items-center justify-between gap-3 rounded-xl border p-4 text-sm shadow-soft hover:shadow-lift ${tone}`}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-medium">{label}</span>
                </span>
                <span className="tabular-nums font-mono text-sm">{number}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick links */}
      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-brand-800">Find safe services</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link href="/directory?category=HEALTH" className="press flex items-center gap-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft hover:border-brand-300">
            <HeartPulse className="h-5 w-5 text-brand-700" />
            <span className="font-medium text-slate-800">Friendly health services</span>
          </Link>
          <Link href="/directory?category=HOUSING" className="press flex items-center gap-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft hover:border-brand-300">
            <MapPin className="h-5 w-5 text-brand-700" />
            <span className="font-medium text-slate-800">Safe accommodation</span>
          </Link>
          <Link href="/directory?category=LEGAL" className="press flex items-center gap-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft hover:border-brand-300">
            <Scale className="h-5 w-5 text-brand-700" />
            <span className="font-medium text-slate-800">Legal resources</span>
          </Link>
        </div>
      </section>

      {/* Safety tips for visitors */}
      <section className="space-y-2 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">Safety guidance for visitors</h2>
        <ul className="list-disc space-y-1 pl-4 text-xs text-slate-700">
          <li>Public displays of affection between same-sex couples attract attention. Exercise discretion.</li>
          <li>Use the Quick Exit button (bottom-right corner) to leave this app instantly if needed.</li>
          <li>Consider using a VPN for additional privacy while browsing.</li>
          <li>Do not discuss your orientation with taxi drivers, hotel staff, or strangers.</li>
          <li>If you feel unsafe, call the emergency numbers above immediately.</li>
        </ul>
      </section>

      {/* Event landing pages */}
      {events.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-brand-800">Events</h2>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/visitor/${event.slug}`}
                  className="press flex items-center justify-between rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft hover:border-brand-300"
                >
                  <span className="font-medium text-slate-800">{event.title}</span>
                  <ArrowRight className="h-4 w-4 text-brand-600" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="pt-2">
        <Link href="/" className="text-xs font-medium text-brand-700 underline">
          Switch to full app
        </Link>
      </div>
    </div>
  );
}
