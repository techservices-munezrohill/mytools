import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm animate-fade-in-up rounded-2xl border border-brand-100 bg-white/90 p-6 shadow-soft backdrop-blur">
      <div className="mb-4 space-y-1">
        <div className="flex items-center gap-2 text-brand-800">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-600" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">
            MyTools Admin
          </span>
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
        <p className="text-xs text-slate-600">
          Use the credentials MRI issued for the admin panel. Accounts are provisioned
          by a super-admin via the seed script.
        </p>
      </div>
      <AdminLoginForm />
    </div>
  );
}
