'use client';

import { useState, useEffect } from 'react';

const RATINGS: { emoji: string; label: string }[] = [
  { emoji: '😕', label: 'Too complex' },
  { emoji: '😐', label: 'Needs work'  },
  { emoji: '🙂', label: 'Pretty good' },
  { emoji: '😊', label: 'Really good' },
  { emoji: '🤩', label: 'Perfect!'    },
];

export default function ParentFeedbackModal({ onClose }: { onClose: () => void }) {
  const [rating,      setRating]      = useState<number | null>(null);
  const [hovered,     setHovered]     = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState('');
  const [status,      setStatus]      = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Auto-close 2 s after success
  useEffect(() => {
    if (status !== 'success') return;
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [status, onClose]);

  async function handleSubmit() {
    if (!rating) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ rating, suggestions }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const display = hovered ?? rating; // which rating is "lit up"

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-5 animate-fade-in">

          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="pf-title" className="text-xl font-extrabold text-zuzu-teal-dark leading-tight">
                Help us improve AskZuZu! 🤖
              </h2>
              <p className="text-slate-500 font-semibold text-sm mt-1 leading-snug">
                Parents, let us know how well ZuZu is explaining concepts to your child.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close feedback form"
              className="shrink-0 text-slate-400 hover:text-slate-600 text-3xl leading-none mt-0.5 focus:outline-none"
            >
              ×
            </button>
          </div>

          {/* ── Success state ── */}
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-10 animate-fade-in">
              <span className="text-6xl">❤️</span>
              <p className="text-zuzu-teal-dark font-extrabold text-xl text-center">
                Thank you for helping ZuZu learn!
              </p>
            </div>
          ) : (
            <>
              {/* ── Emoji rating row ── */}
              <div className="flex flex-col gap-2">
                <p className="text-slate-700 font-bold text-sm">How is ZuZu doing?</p>
                <div className="flex gap-2">
                  {RATINGS.map(({ emoji, label }, idx) => {
                    const value    = idx + 1;
                    const isActive = display !== null && value <= display;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHovered(value)}
                        onMouseLeave={() => setHovered(null)}
                        aria-label={`${value} — ${label}`}
                        aria-pressed={rating === value}
                        className={`
                          flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2
                          transition-all duration-150 active:scale-95
                          focus:outline-none focus:ring-2 focus:ring-teal-300
                          ${isActive
                            ? 'bg-zuzu-teal-bg border-zuzu-teal'
                            : 'bg-white border-slate-200 hover:border-zuzu-teal-bg'
                          }
                        `}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className={`text-xs font-bold ${isActive ? 'text-zuzu-teal' : 'text-slate-400'}`}>
                          {value}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Dynamic label under the selected rating */}
                {display !== null && (
                  <p className="text-center text-zuzu-teal font-bold text-sm animate-fade-in">
                    {display === 1 ? '1 — Too complex' : display === 5 ? '5 — Perfect!' : RATINGS[display - 1].label}
                  </p>
                )}
                {/* Extremes legend */}
                <div className="flex justify-between text-xs text-slate-400 font-semibold px-1">
                  <span>Too complex</span>
                  <span>Perfect!</span>
                </div>
              </div>

              {/* ── Suggestions textarea ── */}
              <textarea
                value={suggestions}
                onChange={e => setSuggestions(e.target.value)}
                placeholder="What features should we add or fix next?"
                rows={4}
                maxLength={1000}
                className="
                  w-full rounded-2xl border-2 border-slate-200 px-4 py-3
                  text-slate-700 font-semibold text-base placeholder:text-slate-300
                  resize-none transition-all duration-150
                  focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-zuzu-teal
                "
              />

              {/* ── Error notice ── */}
              {status === 'error' && (
                <p className="text-orange-500 font-semibold text-sm text-center -mt-2">
                  Something went wrong — please try again.
                </p>
              )}

              {/* ── Submit ── */}
              <button
                onClick={handleSubmit}
                disabled={!rating || status === 'submitting'}
                className="
                  w-full bg-zuzu-teal hover:bg-zuzu-teal-dark active:scale-95
                  text-white font-extrabold text-lg
                  py-4 rounded-2xl shadow-md
                  transition-all duration-150
                  disabled:opacity-40 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-4 focus:ring-teal-300
                "
              >
                {status === 'submitting' ? 'Sending…' : 'Submit Feedback'}
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}
