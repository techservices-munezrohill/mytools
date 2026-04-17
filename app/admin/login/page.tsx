export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <form className="space-y-3">
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
