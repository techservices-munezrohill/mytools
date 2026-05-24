'use client';

export default function CopyLinkButton() {
  const handleClick = () => {
    if (typeof window === 'undefined') return;
    try {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full border border-slate-300 px-3 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
    >
      Copy link
    </button>
  );
}
