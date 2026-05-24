'use client';

import { useEffect, useState } from 'react';

function getStoredScore(listingId: string): 1 | -1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`mytools_trust_${listingId}`);
    if (raw === '1') return 1;
    if (raw === '-1') return -1;
  } catch {}
  return null;
}

function setStoredScore(listingId: string, score: 1 | -1) {
  try {
    window.localStorage.setItem(`mytools_trust_${listingId}`, String(score));
  } catch {}
}

export default function TrustRatingWidget({
  listingId,
  ratingsLocked,
}: {
  listingId: string;
  ratingsLocked?: boolean;
}) {
  const [storedScore, setStoredScoreState] = useState<1 | -1 | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [avg, setAvg] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStoredScoreState(getStoredScore(listingId));
  }, [listingId]);

  const handleVote = async (score: 1 | -1) => {
    if (ratingsLocked) {
      setError('Ratings are paused while MRI reviews safety reports for this place.');
      return;
    }
    if (storedScore != null) {
      setError(null);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/listings/${listingId}/trust-rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      });
      if (res.ok) {
        const data = (await res.json()) as { ok: boolean; avg: number; count: number };
        setAvg(data.avg);
        setCount(data.count);
        setStoredScore(listingId, score);
        setStoredScoreState(score);
      } else if (res.status === 423) {
        const body = await res.json().catch(() => null);
        setError((body && body.error) || 'Ratings are temporarily locked while MRI reviews recent reports.');
      } else {
        setError('Could not submit rating. Please try again later.');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasVoted = storedScore != null;

  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800">
      <div>
        <div className="font-semibold text-slate-900">Did this place feel safe?</div>
        {hasVoted ? (
          <p className="text-[11px] text-slate-600">
            You already rated this place on this device. Only one rating is saved per
            listing.
          </p>
        ) : ratingsLocked ? (
          <p className="text-[11px] text-amber-800">
            Ratings are paused while MRI reviews safety reports.
          </p>
        ) : (
          <p className="text-[11px] text-slate-600">
            Your anonymous rating helps MRI understand which places feel safe.
          </p>
        )}
        {avg != null && count != null && count > 0 && (
          <p className="mt-1 text-[11px] text-slate-600">
            Community signal: {avg >= 0 ? 'mostly positive' : 'mixed/negative'}
          </p>
        )}
        {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleVote(1)}
          disabled={hasVoted || submitting || ratingsLocked}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm font-semibold ${
            storedScore === 1
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50'
          } disabled:opacity-60`}
          aria-label="This place felt safe"
        >
          👍
        </button>
        <button
          type="button"
          onClick={() => handleVote(-1)}
          disabled={hasVoted || submitting || ratingsLocked}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm font-semibold ${
            storedScore === -1
              ? 'border-rose-500 bg-rose-500 text-white'
              : 'border-rose-300 bg-white text-rose-700 hover:bg-rose-50'
          } disabled:opacity-60`}
          aria-label="This place did not feel safe"
        >
          👎
        </button>
      </div>
    </div>
  );
}
