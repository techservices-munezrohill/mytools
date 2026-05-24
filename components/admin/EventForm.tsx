'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type EmergencyContact = {
  label: string;
  number: string;
};

const EMPTY_CONTACT: EmergencyContact = { label: '', number: '' };

export default function EventForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { ...EMPTY_CONTACT },
  ]);
  const [safetyTipsRaw, setSafetyTipsRaw] = useState('');
  const [active, setActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContactChange = (
    index: number,
    field: keyof EmergencyContact,
    value: string,
  ) => {
    setContacts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addContact = () => {
    setContacts((prev) => [...prev, { ...EMPTY_CONTACT }]);
  };

  const removeContact = (index: number) => {
    setContacts((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const trimmedTitle = title.trim();
      const trimmedSlug = slug.trim();

      if (!trimmedTitle || !trimmedSlug) {
        setError('Title and slug are required.');
        setSubmitting(false);
        return;
      }

      const safetyTips = safetyTipsRaw
        ? safetyTipsRaw
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

      const emergencyContacts = contacts
        .map((c) => ({ label: c.label.trim(), number: c.number.trim() }))
        .filter((c) => c.label || c.number);

      const payload = {
        title: trimmedTitle,
        slug: trimmedSlug,
        bodyHtml: bodyHtml.trim() || '',
        emergencyContacts: emergencyContacts.length > 0 ? emergencyContacts : undefined,
        safetyTips,
        active,
      };

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? 'Could not create event.');
        setSubmitting(false);
        return;
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-brand-100 bg-white p-4 text-sm shadow-soft"
    >
      {error && (
        <p className="rounded bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
          placeholder="Event name"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700">Slug</label>
        <input
          value={slug}
          onChange={(e) =>
            setSlug(e.target.value.replace(/[^a-z0-9-]/g, '').toLowerCase())
          }
          className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
          placeholder="kigali-conf-2026"
        />
        <p className="mt-1 text-[11px] text-slate-500">
          This becomes part of the visitor URL: <code>/visitor/slug</code>
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700">Description</label>
        <textarea
          value={bodyHtml}
          onChange={(e) => setBodyHtml(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
          placeholder="Optional event details for visitors. You can write plain text."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-700">
          Emergency contacts
        </label>
        <p className="text-[11px] text-slate-500">
          Add up to 3 important numbers visitors may need (event hotline, organizer, etc.).
        </p>
        {contacts.map((c, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={c.label}
              onChange={(e) => handleContactChange(index, 'label', e.target.value)}
              className="w-1/2 rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="e.g. Event hotline"
            />
            <input
              value={c.number}
              onChange={(e) => handleContactChange(index, 'number', e.target.value)}
              className="w-1/2 rounded border border-slate-200 px-3 py-2 text-xs"
              placeholder="e.g. +250 7XX XXX XXX"
            />
            <button
              type="button"
              onClick={() => removeContact(index)}
              className="rounded border border-slate-200 px-2 text-[11px] text-slate-600 hover:bg-slate-50"
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addContact}
          className="rounded border border-dashed border-slate-300 px-3 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
        >
          + Add another contact
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700">
          Safety tips (one per line)
        </label>
        <textarea
          value={safetyTipsRaw}
          onChange={(e) => setSafetyTipsRaw(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
          placeholder={
            'Example:\nUse the Quick Exit button if someone approaches.\nKeep badges out of public photos.'
          }
        />
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-700">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-3 w-3 rounded border-slate-300"
        />
        Active (visible in visitor mode)
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-brand-700 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {submitting ? 'Creating…' : 'Create event'}
      </button>
    </form>
  );
}
