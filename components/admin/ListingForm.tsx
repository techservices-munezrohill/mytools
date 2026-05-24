"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const ListingMapPicker = dynamic(() => import('./ListingMapPicker'), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded border border-slate-200 bg-slate-50 text-xs text-slate-500">
      Loading map…
    </div>
  ),
});

const CATEGORIES = [
  'HEALTH',
  'LEGAL',
  'ORGANIZATION',
  'SAFE_SPACE',
  'HOUSING',
  'EMERGENCY',
] as const;

type Category = (typeof CATEGORIES)[number];

export type ListingInitial = {
  id?: string;
  name: string;
  category: Category;
  description: string;
  services: string[];
  address: string;
  lat: number | null;
  lng: number | null;
  hours: string;
  contactMethod: string;
  acceptsWalkIns: boolean;
  missionStatement: string;
  focusAreas: string[];
  lastVerifiedAt: string;
  isHidden: boolean;
};

const DEFAULT_INITIAL: ListingInitial = {
  name: '',
  category: 'HEALTH',
  description: '',
  services: [],
  address: '',
  lat: null,
  lng: null,
  hours: '',
  contactMethod: '',
  acceptsWalkIns: false,
  missionStatement: '',
  focusAreas: [],
  lastVerifiedAt: '',
  isHidden: false,
};

export default function ListingForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit';
  initial?: ListingInitial;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ListingInitial>(initial ?? DEFAULT_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ListingInitial>(key: K, value: ListingInitial[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      lat: form.lat,
      lng: form.lng,
      lastVerifiedAt: form.lastVerifiedAt || null,
    };

    const url =
      mode === 'create'
        ? '/api/admin/listings'
        : `/api/admin/listings/${initial?.id}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.error) {
        setError(String(data.error));
      } else if (data?.details) {
        setError(JSON.stringify(data.details));
      } else {
        setError(data?.message ?? 'Could not save. Check required fields.');
      }
      return;
    }

    router.push('/admin/directory');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initial?.id) return;
    if (!confirm('Delete this listing? This cannot be undone.')) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/listings/${initial.id}`, {
      method: 'DELETE',
    });
    setDeleting(false);

    if (!res.ok) {
      setError('Could not delete listing.');
      return;
    }

    router.push('/admin/directory');
    router.refresh();
  };

  const handleDuplicate = () => {
    if (!initial?.id) return;

    router.push(`/admin/directory/new?from=${initial.id}`);
  };

  return (
    <form
      className="grid gap-4 rounded border border-slate-200 bg-white p-4 text-sm shadow-sm md:grid-cols-2"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1 md:col-span-2">
        <label className="block text-slate-700">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-700">Category</label>
        <select
          value={form.category}
          onChange={(e) => update('category', e.target.value as Category)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-slate-700">Last verified date</label>
        <input
          type="date"
          value={form.lastVerifiedAt}
          onChange={(e) => update('lastVerifiedAt', e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <label className="block text-slate-700">Description</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <label className="block text-slate-700">Services (comma-separated)</label>
        <input
          value={form.services.join(', ')}
          onChange={(e) =>
            update(
              'services',
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <label className="block text-slate-700">Address / location description</label>
        <input
          value={form.address}
          onChange={(e) => update('address', e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="block text-slate-700">Map pin (click to place) or enter coordinates</label>
        <ListingMapPicker
          lat={form.lat}
          lng={form.lng}
          onChange={(lat, lng) => {
            update('lat', lat);
            update('lng', lng);
          }}
        />

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-slate-600 text-xs">Latitude</label>
            <input
              value={form.lat ?? ''}
              onChange={(e) => {
                const v = e.target.value.trim();
                update('lat', v === '' ? null : Number(v));
              }}
              placeholder="e.g. -1.9536"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-600 text-xs">Longitude</label>
            <input
              value={form.lng ?? ''}
              onChange={(e) => {
                const v = e.target.value.trim();
                update('lng', v === '' ? null : Number(v));
              }}
              placeholder="e.g. 30.0605"
              className="w-full rounded border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          {form.lat != null && form.lng != null
            ? `Selected: ${Number(form.lat).toFixed(5)}, ${Number(form.lng).toFixed(5)}`
            : 'No pin selected yet. You can place the pin on the map above or paste coordinates from Google Maps/OpenStreetMap.'}
        </p>

        <p className="text-xs text-slate-400">
          Tip: In Google Maps search your address, right-click the pin → "What's here?" → copy the latitude and longitude shown at the bottom.
        </p>
      </div>

      
      <div className="space-y-1">
        <label className="block text-slate-700">Hours</label>
        <input
          value={form.hours}
          onChange={(e) => update('hours', e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Mon–Fri 9am–5pm"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-slate-700">Contact method</label>
        <input
          value={form.contactMethod}
          onChange={(e) => update('contactMethod', e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Phone / email / website"
        />
      </div>

      <div className="space-y-1 flex items-center gap-2 md:col-span-2">
        <input
          id="walkins"
          type="checkbox"
          checked={form.acceptsWalkIns}
          onChange={(e) => update('acceptsWalkIns', e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="walkins" className="text-sm text-slate-700">
          Accepts walk-ins
        </label>
      </div>

      <div className="space-y-1 md:col-span-2">
        <label className="block text-slate-700">Mission statement (organizations only)</label>
        <textarea
          rows={2}
          value={form.missionStatement}
          onChange={(e) => update('missionStatement', e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="space-y-1 md:col-span-2">
        <label className="block text-slate-700">Focus areas (comma-separated)</label>
        <input
          value={form.focusAreas.join(', ')}
          onChange={(e) =>
            update(
              'focusAreas',
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="health, advocacy, youth"
        />
      </div>

      <div className="space-y-1 flex items-center gap-2 md:col-span-2">
        <input
          id="hidden"
          type="checkbox"
          checked={form.isHidden}
          onChange={(e) => update('isHidden', e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="hidden" className="text-sm text-slate-700">
          Hide from public directory
        </label>
      </div>

      {error && <p className="md:col-span-2 text-xs text-red-600">{error}</p>}

      <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {mode === 'edit' && (
            <>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded border border-red-300 px-3 py-2 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete listing'}
              </button>
              <button
                type="button"
                onClick={handleDuplicate}
                className="rounded border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                Duplicate listing
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-900 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
