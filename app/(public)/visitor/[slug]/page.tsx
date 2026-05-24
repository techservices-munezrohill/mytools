import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Phone } from 'lucide-react';

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } });

  if (!event || !event.active) {
    notFound();
  }

  const contacts = (event.emergencyContacts ?? []) as { label: string; number: string }[];

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up space-y-2 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">Event</p>
        <h1 className="text-xl font-semibold">{event.title}</h1>
      </header>

      <article className="prose prose-sm max-w-none rounded-xl border border-slate-200 bg-white/90 p-4 text-slate-800 shadow-soft prose-headings:text-slate-900 prose-a:text-brand-700">
        <div dangerouslySetInnerHTML={{ __html: event.bodyHtml }} />
      </article>

      {contacts.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-brand-800">Emergency contacts</h2>
          <ul className="space-y-2">
            {contacts.map((c, i) => (
              <li key={i}>
                <a
                  href={`tel:${c.number.replace(/\s+/g, '')}`}
                  className="press flex items-center justify-between rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft hover:shadow-lift"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-700" />
                    <span className="font-medium text-slate-800">{c.label}</span>
                  </span>
                  <span className="font-mono text-sm text-slate-600">{c.number}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {event.safetyTips.length > 0 && (
        <section className="rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">Safety tips</h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-700">
            {event.safetyTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex gap-3 pt-2 text-xs">
        <Link href="/visitor" className="font-medium text-brand-700 underline">
          Back to visitor home
        </Link>
        <Link href="/" className="font-medium text-brand-700 underline">
          Full app
        </Link>
      </div>
    </div>
  );
}
