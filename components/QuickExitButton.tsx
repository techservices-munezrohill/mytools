"use client";

export default function QuickExitButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.location.replace('https://www.google.com');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-slate-800 px-4 py-2 text-xs font-medium text-white shadow-lg hover:bg-slate-900"
    >
      Quick Exit
    </button>
  );
}
