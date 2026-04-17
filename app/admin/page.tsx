import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">MyTools Admin</h1>
      <p className="text-sm text-slate-600">
        Use the links below to sign in and manage the service directory and content.
      </p>
      <div className="space-y-2 text-sm">
        <div>
          <Link
            href="/admin/login"
            className="text-slate-800 underline hover:text-slate-900"
          >
            Go to Admin Login
          </Link>
        </div>
        <div>
          <span className="text-slate-500">
            After signing in, Directory Management will be available at
          </span>{' '}
          <code className="rounded bg-slate-100 px-1 text-xs">/admin/directory</code>.
        </div>
      </div>
    </div>
  );
}
