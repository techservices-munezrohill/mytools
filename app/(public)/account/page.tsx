'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, Trash2, Shield } from 'lucide-react';

type Profile = {
  id: string;
  nickname: string;
  gender: string | null;
  selfDescribeGender: string | null;
  ageRange: string | null;
  province: string | null;
  referralSource: string | null;
  usageReasons: string[];
  hasEmail: boolean;
  hasPhone: boolean;
  createdAt: string;
};

function formatGender(g: string | null, selfDescribe: string | null): string {
  if (!g) return 'Not specified';
  const map: Record<string, string> = {
    MAN: 'Man', WOMAN: 'Woman', NON_BINARY: 'Non-binary',
    TRANSGENDER_MAN: 'Transgender man', TRANSGENDER_WOMAN: 'Transgender woman',
    GENDERQUEER: 'Genderqueer', PREFER_NOT_TO_SAY: 'Prefer not to say',
    SELF_DESCRIBE: selfDescribe || 'Self-described',
  };
  return map[g] ?? g;
}

function formatAge(a: string | null): string {
  if (!a) return 'Not specified';
  const map: Record<string, string> = {
    AGE_18_24: '18–24', AGE_25_34: '25–34', AGE_35_44: '35–44',
    AGE_45_PLUS: '45+', PREFER_NOT_TO_SAY: 'Prefer not to say',
  };
  return map[a] ?? a;
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetch('/api/users/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || data.error) {
          router.replace('/account/login');
          return;
        }
        setProfile(data);
      })
      .catch(() => router.replace('/account/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/users/me', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await fetch('/api/users/me', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-500">Loading…</div>;
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header className="animate-fade-in-up space-y-1 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">Your account</p>
        <h1 className="text-xl font-semibold">{profile.nickname}</h1>
        <p className="text-sm text-brand-100">
          Member since {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">Profile</h2>
        <div className="grid gap-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Gender</span><span className="text-slate-800">{formatGender(profile.gender, profile.selfDescribeGender)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Age range</span><span className="text-slate-800">{formatAge(profile.ageRange)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Province</span><span className="text-slate-800">{profile.province || 'Not specified'}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Contact on file</span><span className="text-slate-800">{profile.hasEmail || profile.hasPhone ? 'Encrypted ✓' : 'None'}</span></div>
        </div>
        {profile.usageReasons.length > 0 && (
          <div>
            <p className="text-xs text-slate-500">Using this app for</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {profile.usageReasons.map((r) => (
                <span key={r} className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] text-brand-800 ring-1 ring-brand-100">{r}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-2">
        <Link
          href="/bookmarks"
          className="press flex items-center gap-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft hover:border-brand-300"
        >
          <User className="h-4 w-4 text-brand-700" />
          <span className="font-medium text-slate-800">My saved items</span>
        </Link>
        <Link
          href="/privacy"
          className="press flex items-center gap-3 rounded-xl border border-brand-100 bg-white/80 p-4 text-sm shadow-soft hover:border-brand-300"
        >
          <Shield className="h-4 w-4 text-brand-700" />
          <span className="font-medium text-slate-800">Privacy & trust</span>
        </Link>
      </section>

      <div className="space-y-2 pt-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-200 py-2.5 text-sm text-brand-700 hover:bg-brand-50"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 py-2.5 text-sm text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" /> Delete my account
          </button>
        ) : (
          <div className="space-y-2 rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900">
            <p className="font-semibold">This will permanently delete your account.</p>
            <p>Your nickname, demographics, encrypted contact info, and all bookmarks will be removed instantly. This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-full border border-rose-200 py-2 text-sm text-rose-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-rose-700 py-2 text-sm font-medium text-white hover:bg-rose-800 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Yes, delete everything'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
