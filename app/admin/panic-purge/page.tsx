'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function PanicPurgePage() {
  const [confirmation, setConfirmation] = useState('');
  const [retainDemographics, setRetainDemographics] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurge = async () => {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/panic-purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation, retainDemographics }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Purge failed.');
        return;
      }
      setResult(`Purge completed at ${data.timestamp}. Demographics retained: ${data.retainedDemographics}.`);
      setConfirmation('');
    } catch {
      setError('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 p-6 text-white shadow-soft">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-rose-200" />
          <div>
            <h1 className="text-2xl font-semibold">Emergency Data Destruction</h1>
            <p className="mt-1 text-sm text-rose-100">
              Panic Purge — PRD §5.5.4. This action is <strong>irreversible</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 shadow-soft">
        <h2 className="font-semibold">What this does</h2>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
          <li>Permanently deletes all encrypted email and phone fields from every user account.</li>
          <li>Optionally retains nicknames and demographic data (non-identifying).</li>
          <li>Cannot be undone. The encrypted contact information is gone forever.</li>
          <li>Use only if MRI learns of an imminent legal threat, server seizure, or security breach.</li>
        </ul>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-soft">
        <div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={retainDemographics}
              onChange={(e) => setRetainDemographics(e.target.checked)}
              className="rounded"
            />
            Retain nicknames and demographics (recommended — they are non-identifying)
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Type <code className="rounded bg-slate-100 px-1 font-mono">PURGE</code> to confirm
          </label>
          <input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="mt-1 w-full rounded border border-rose-300 px-3 py-2 text-sm font-mono"
            placeholder="PURGE"
          />
        </div>
        <button
          onClick={handlePurge}
          disabled={confirmation !== 'PURGE' || submitting}
          className="w-full rounded-full bg-rose-700 py-2.5 text-sm font-medium text-white hover:bg-rose-800 disabled:opacity-50"
        >
          {submitting ? 'Purging…' : 'Execute Emergency Purge'}
        </button>
        {error && <p className="text-xs text-rose-700">{error}</p>}
        {result && <p className="text-xs text-emerald-700">{result}</p>}
      </section>
    </div>
  );
}
