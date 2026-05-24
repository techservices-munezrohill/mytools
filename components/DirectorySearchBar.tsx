"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Suggestion = {
  id: string;
  name: string;
  category: string;
  address: string | null;
};

export default function DirectorySearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState("");
  const [locating, setLocating] = useState(false);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const current = searchParams.get("q") || "";
    setValue(current);
  }, [searchParams]);

  // --- type-ahead: debounce search term ---
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/listings/suggest?q=${encodeURIComponent(value.trim().toLowerCase())}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!res.ok) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }
        const data = (await res.json()) as Suggestion[];
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  const pushSearch = (q: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }
    router.push(`/directory?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    pushSearch(value);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const params = new URLSearchParams(
          Array.from(searchParams.entries()),
        );
        params.set("lat", String(pos.coords.latitude));
        params.set("lng", String(pos.coords.longitude));
        router.push(`/directory?${params.toString()}`);
        setLocating(false);
      },
      () => {
        alert("Could not determine your location.");
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const handleClearLocation = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("lat");
    params.delete("lng");
    router.push(`/directory?${params.toString()}`);
  };

  const hasLocation = Boolean(
    searchParams.get("lat") && searchParams.get("lng"),
  );

  // click suggestion → fill search and show list
  const handleSuggestionClick = (s: Suggestion) => {
    const name = s.name.trim();
    setValue(name);
    setShowSuggestions(false);
    pushSearch(name);
  };

  const formattedSuggestions = useMemo(
    () =>
      suggestions.map((s) => ({
        ...s,
        categoryLabel: formatCategory(s.category),
      })),
    [suggestions],
  );

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-sm shadow-soft"
      >
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Search by name or service"
          className="w-full border-none bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded bg-brand-700 px-3 py-1 text-xs font-medium text-white hover:bg-brand-800"
        >
          Search
        </button>
        {!hasLocation ? (
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={locating}
            className="ml-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {locating ? "Locating…" : "Use my location"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClearLocation}
            className="ml-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
          >
            Clear location
          </button>
        )}
      </form>

      {showSuggestions && (
        /* FIXED: Changed z-50 to z-[9999] to strongly force the dropdown above the map layout */
        <div className="absolute left-0 right-0 z-[9999] mt-1 w-full rounded-xl border border-slate-200 bg-white text-sm shadow-lg">
          {loadingSuggestions ? (
            <div className="px-3 py-2 text-xs text-slate-500">
              Searching…
            </div>
          ) : formattedSuggestions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500">
              No suggestions yet
            </div>
          ) : (
            <ul className="max-h-64 overflow-auto">
              {formattedSuggestions.map((s) => (
                <li
                  key={s.id}
                  className="cursor-pointer px-3 py-2 hover:bg-slate-50"
                  onMouseDown={(e) => {
                    // prevent input from losing focus before click
                    e.preventDefault();
                    handleSuggestionClick(s);
                  }}
                >
                  <div className="font-medium text-slate-900">
                    {s.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {s.categoryLabel}
                    {s.address ? ` • ${s.address}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function formatCategory(category: string): string {
  switch (category) {
    case "HEALTH":
      return "Health";
    case "LEGAL":
      return "Legal";
    case "ORGANIZATION":
      return "Organization";
    case "SAFE_SPACE":
      return "Safe space";
    case "HOUSING":
      return "Housing";
    case "EMERGENCY":
      return "Emergency";
    default:
      return category;
  }
}