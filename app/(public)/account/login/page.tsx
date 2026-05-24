'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), pin }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? 'Login failed.');
        return;
      }
      // Go to home after successful login
      router.push('/');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="animate-fade-in-up space-y-1 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">Log in</p>
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-brand-100">Enter your nickname and 6-digit PIN.</p>
      </header>

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-xs text-rose-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-brand-100 bg-white/80 p-4 shadow-soft">
        <div>
          <label className="block text-xs font-medium text-slate-700">Nickname</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={30}
            className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm"
            placeholder="Your nickname"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">PIN</label>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm tracking-[0.3em]"
            placeholder="••••••"
          />
        </div>
        <button
          type="submit"
          disabled={!nickname.trim() || pin.length !== 6 || submitting}
          className="w-full rounded-full bg-brand-700 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        No account yet?{' '}
        <Link href="/account/register" className="text-brand-700 underline">Create one</Link>
      </p>
    </div>
  );
}
