'use client';

import { useState } from 'react';

export default function ReportProblemForm({
  listingId,
}: {
  listingId: string;
}) {
  const [reason, setReason] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [hiddenNotice, setHiddenNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/listing-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          reason,
          freeText: text.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        listingHidden?: boolean;
        error?: string;
      };

      if (res.status === 404) {
        setError(
          'This listing is no longer in the directory. MRI may already be reviewing it.',
        );
        return;
      }

      if (!res.ok) {
        setError(
          data.error === 'Invalid payload'
            ? 'Please choose a reason and try again.'
            : 'Could not send your report. Please try again later.',
        );
        return;
      }

      setDone(true);
      setText('');
      setReason('');
      if (data.listingHidden) {
        setHiddenNotice(true);
      }
    } catch {
      setError('Could not send your report. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-1 text-[11px] text-rose-900/80">
        <p>
          Thank you. MRI will review this report within 48 hours. Your input helps
          keep the directory safe.
        </p>
        {hiddenNotice && (
          <p className="font-medium text-rose-900">
            This listing has been temporarily hidden from the directory while MRI
            reviews recent reports.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded border border-rose-200 bg-white px-3 py-2 text-xs text-slate-900"
        required
      >
        <option value="" disabled>
          Choose a reason
        </option>
        <option value="no-longer-safe">
          Staff or surroundings feel no longer safe for LGBTQ+ people
        </option>
        <option value="closed-or-moved">Place is closed or has moved</option>
        <option value="harassment-or-violence">
          Harassment, threats, or violence reported
        </option>
        <option value="police-or-authorities">
          Police or authorities regularly present
        </option>
        <option value="other">Other safety concern
        </option>
      </select>
      <textarea
        rows={3}
        maxLength={200}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded border border-rose-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400"
        placeholder="Optional: share brief details (no names or identifying info)."
      />
      {error && <p className="text-[11px] text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center rounded-full bg-rose-700 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-rose-800 disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send anonymous report'}
      </button>
      <p className="text-[11px] text-rose-900/80">
        MRI reviews safety reports within 48 hours. If several reports are
        received, this listing may be temporarily hidden while MRI checks.
      </p>
    </form>
  );
}
