export default function AdminDirectoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Directory Management</h1>
      <p className="text-sm text-slate-600">
        Add and update vetted services. This is a skeleton only; saving to the database
        will be wired in a later sprint.
      </p>

      <form className="grid gap-4 rounded border border-slate-200 bg-white p-4 text-sm shadow-sm md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-slate-700">Name</label>
          <input className="w-full rounded border border-slate-300 px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="block text-slate-700">Category</label>
          <select className="w-full rounded border border-slate-300 px-3 py-2">
            <option>Health</option>
            <option>Legal</option>
            <option>Organization</option>
            <option>Safe Social Space</option>
            <option>Inclusive Housing</option>
            <option>Emergency</option>
          </select>
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="block text-slate-700">Address / Location description</label>
          <input className="w-full rounded border border-slate-300 px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="block text-slate-700">Latitude</label>
          <input className="w-full rounded border border-slate-300 px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="block text-slate-700">Longitude</label>
          <input className="w-full rounded border border-slate-300 px-3 py-2" />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="block text-slate-700">Services offered (comma-separated)</label>
          <input className="w-full rounded border border-slate-300 px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="block text-slate-700">Last verified date</label>
          <input type="date" className="w-full rounded border border-slate-300 px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="block text-slate-700">Accepts walk-ins?</label>
          <select className="w-full rounded border border-slate-300 px-3 py-2">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
          <button
            type="button"
            className="rounded bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-900"
          >
            Save (disabled in Sprint 1)
          </button>
        </div>
      </form>

      <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
        In later sprints this page will:
        <ul className="mt-2 list-disc pl-4">
          <li>List all existing directory entries with search and filters.</li>
          <li>Highlight listings not verified in the last 6 months.</li>
          <li>Show flags from users who reported a place as unsafe.</li>
        </ul>
      </div>
    </div>
  );
}
