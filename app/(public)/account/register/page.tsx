'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PROVINCES = [
  'Kigali', 'Eastern', 'Northern', 'Southern', 'Western', 'Outside Rwanda',
];

const USAGE_OPTIONS = [
  'Health services', 'Legal info', 'Safe spaces', 'Housing',
  'Community connection', 'General information', 'Other',
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');

  // Step 2 (optional contact)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 3 (optional demographics)
  const [gender, setGender] = useState('');
  const [selfDescribeGender, setSelfDescribeGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [province, setProvince] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [usageReasons, setUsageReasons] = useState<string[]>([]);

  // Auto-populate referral source from localStorage
  useState(() => {
    if (typeof window !== 'undefined') {
      const ref = window.localStorage.getItem('mytools_ref');
      if (ref) setReferralSource(ref);
    }
  });

  const toggleUsage = (val: string) => {
    setUsageReasons((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          pin,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          gender: gender || undefined,
          selfDescribeGender: gender === 'SELF_DESCRIBE' ? selfDescribeGender : undefined,
          ageRange: ageRange || undefined,
          province: province || undefined,
          referralSource: referralSource || undefined,
          usageReasons: usageReasons.length > 0 ? usageReasons : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? 'Registration failed. Please try again.');
        return;
      }
      // Migrate localStorage bookmarks to account
      try {
        const raw = window.localStorage.getItem('mytools_bookmarks');
        if (raw) {
          const items = JSON.parse(raw) as { type: string; id: string; title: string; meta: string }[];
          for (const b of items) {
            await fetch('/api/users/me/bookmarks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: b.type, itemId: b.id, title: b.title, meta: b.meta }),
            });
          }
        }
      } catch {}
      // After creating an account, go to the home screen
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
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">Create account</p>
        <h1 className="text-xl font-semibold">Join MyTools</h1>
        <p className="text-sm text-brand-100">
          An anonymous account lets you save bookmarks and help MRI understand community needs.
        </p>
      </header>

      {/* Progress indicator */}
      <div className="flex gap-1">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-brand-600' : 'bg-brand-100'}`}
          />
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-xs text-rose-700">{error}</p>
      )}

      {/* Step 1: Nickname + PIN */}
      {step === 1 && (
        <div className="space-y-4 rounded-xl border border-brand-100 bg-white/80 p-4 shadow-soft">
          <div>
            <label className="block text-xs font-medium text-slate-700">Nickname</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={30}
              className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm"
              placeholder="Any name you like"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">6-digit PIN</label>
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
          <div>
            <label className="block text-xs font-medium text-slate-700">Confirm PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm tracking-[0.3em]"
              placeholder="••••••"
            />
          </div>
          <button
            disabled={!nickname.trim() || pin.length !== 6 || pin !== pinConfirm}
            onClick={() => { setError(null); setStep(2); }}
            className="w-full rounded-full bg-brand-700 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Optional contact info */}
      {step === 2 && (
        <div className="space-y-4 rounded-xl border border-brand-100 bg-white/80 p-4 shadow-soft">
          <p className="text-xs text-slate-600">
            <strong>Optional.</strong> This helps us reach you with critical safety alerts.
            Your contact info is encrypted and never visible to anyone — not even our team — unless you request account recovery.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm"
              placeholder="+250 7XX XXX XXX"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 rounded-full border border-brand-200 py-2.5 text-sm text-brand-700">Back</button>
            <button onClick={() => setStep(3)} className="flex-1 rounded-full bg-brand-700 py-2.5 text-sm font-medium text-white hover:bg-brand-800">Next</button>
          </div>
          <button onClick={() => setStep(3)} className="w-full text-center text-xs text-slate-500 underline">Skip</button>
        </div>
      )}

      {/* Step 3: Optional demographics */}
      {step === 3 && (
        <div className="space-y-4 rounded-xl border border-brand-100 bg-white/80 p-4 shadow-soft">
          <p className="text-xs text-slate-600">
            <strong>Optional.</strong> This helps MRI understand the community. All responses are aggregate — never linked to your identity.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-700">Gender identity</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm">
              <option value="">Prefer not to say</option>
              <option value="MAN">Man</option>
              <option value="WOMAN">Woman</option>
              <option value="NON_BINARY">Non-binary</option>
              <option value="TRANSGENDER_MAN">Transgender man</option>
              <option value="TRANSGENDER_WOMAN">Transgender woman</option>
              <option value="GENDERQUEER">Genderqueer</option>
              <option value="SELF_DESCRIBE">Prefer to self-describe</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
            {gender === 'SELF_DESCRIBE' && (
              <input value={selfDescribeGender} onChange={(e) => setSelfDescribeGender(e.target.value)} maxLength={60} className="mt-2 w-full rounded border border-brand-200 px-3 py-2 text-sm" placeholder="How do you identify?" />
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Age range</label>
            <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm">
              <option value="">Prefer not to say</option>
              <option value="AGE_18_24">18–24</option>
              <option value="AGE_25_34">25–34</option>
              <option value="AGE_35_44">35–44</option>
              <option value="AGE_45_PLUS">45+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Province / region</label>
            <select value={province} onChange={(e) => setProvince(e.target.value)} className="mt-1 w-full rounded border border-brand-200 px-3 py-2 text-sm">
              <option value="">Select</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Primary reasons for using this app</label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {USAGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleUsage(opt)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    usageReasons.includes(opt)
                      ? 'bg-brand-700 text-white'
                      : 'bg-brand-50 text-brand-800 ring-1 ring-brand-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 rounded-full border border-brand-200 py-2.5 text-sm text-brand-700">Back</button>
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 rounded-full bg-brand-700 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50">
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link href="/account/login" className="text-brand-700 underline">Log in</Link>
      </p>
    </div>
  );
}
