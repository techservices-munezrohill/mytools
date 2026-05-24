import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminSignOutButton from '@/components/admin/AdminSignOutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="animate-fade-in-up flex flex-col gap-3 rounded-2xl border border-brand-100 bg-white/80 px-5 py-4 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold text-brand-900"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-600" />
            MyTools Admin
          </Link>
          {session && (
            <nav className="flex flex-wrap gap-4 text-xs font-medium text-slate-600">
              <Link
                href="/admin/directory"
                className="rounded px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                Directory
              </Link>
              <Link
                href="/admin/articles"
                className="rounded px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                Articles
              </Link>
              <Link
                href="/admin/referrals"
                className="rounded px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                Referral codes
              </Link>
              <Link
                href="/admin/service-requests"
                className="rounded px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                Service gaps
              </Link>
              <Link
                href="/admin/flags"
                className="rounded px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                Safety reports
              </Link>
              <Link
                href="/admin/events"
                className="rounded px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                Events
              </Link>
              <Link
                href="/admin/reports"
                className="rounded px-2 py-1 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                Reports
              </Link>
              <Link
                href="/admin/panic-purge"
                className="rounded px-2 py-1 text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-800"
              >
                Panic purge
              </Link>
            </nav>
          )}
        </div>
        {session && (
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="font-medium text-slate-700">{session.user?.email}</span>
            <AdminSignOutButton />
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
