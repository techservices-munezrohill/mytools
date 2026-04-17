export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-6">
      <header className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h1 className="text-lg font-semibold">MyTools Admin</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
