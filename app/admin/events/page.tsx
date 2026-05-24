import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import EventQrCode from '@/components/admin/EventQrCode';

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">Tourism mode</p>
          <h1 className="mt-1 text-2xl font-semibold">Events</h1>
          <p className="mt-1 text-sm text-brand-100">Create event landing pages for visitors. Each gets a shareable QR code.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
        >
          + New event
        </Link>
      </section>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
          No events yet. Create one to generate a QR-shareable visitor landing page.
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-900">{event.title}</h2>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${event.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {event.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Slug: <code className="rounded bg-slate-100 px-1">/visitor/{event.slug}</code>
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="rounded bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-200"
                  >
                    Edit
                  </Link>
                </div>
              </div>
              <div className="mt-3">
                <EventQrCode slug={event.slug} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
