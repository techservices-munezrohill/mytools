"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Referral = {
  id: string;
  code: string;
  label: string;
  active: boolean;
  createdAt: string;
};

export default function ReferralManager({ initial }: { initial: Referral[] }) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch('/api/admin/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim(), label: label.trim() }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Could not create code.');
      return;
    }

    setCode('');
    setLabel('');
    router.refresh();
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch(`/api/admin/referrals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this referral code?')) return;
    await fetch(`/api/admin/referrals/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 text-sm shadow-sm sm:flex-row"
      >
        <div className="flex-1 space-y-1">
          <label className="block text-xs text-slate-600">Code</label>
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="chw01"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="block text-xs text-slate-600">Label</label>
          <input
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Kigali CHW cohort 1"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-900 disabled:opacity-60 sm:self-end"
        >
          {submitting ? 'Saving…' : 'Add code'}
        </button>
      </form>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {initial.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No referral codes yet.
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {initial.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm text-slate-900">{r.code}</p>
                <p className="text-xs text-slate-500">{r.label}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    r.active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {r.active ? 'active' : 'paused'}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(r.id, r.active)}
                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  {r.active ? 'Pause' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
