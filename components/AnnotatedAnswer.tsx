'use client';

import { useState, useEffect } from 'react';

// Matches [Word](definition) — the only custom markup ZuZu emits
const ANNOTATION_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

interface TextSeg  { type: 'text'; content: string }
interface WordSeg  { type: 'word'; word: string; def: string; index: number }
type Segment = TextSeg | WordSeg;

function parse(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  let wi   = 0;
  let m: RegExpExecArray | null;

  ANNOTATION_RE.lastIndex = 0;
  while ((m = ANNOTATION_RE.exec(text)) !== null) {
    if (m.index > last) out.push({ type: 'text', content: text.slice(last, m.index) });
    out.push({ type: 'word', word: m[1], def: m[2], index: wi++ });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: 'text', content: text.slice(last) });
  return out;
}

export default function AnnotatedAnswer({ text, logId }: { text: string; logId: number | null }) {
  const [active, setActive] = useState<number | null>(null);

  // Close on any outside click while a tooltip is open
  useEffect(() => {
    if (active === null) return;
    const close = () => setActive(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [active]);

  const segments = parse(text);

  return (
    <p className="text-slate-700 text-xl font-semibold leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === 'text') return <span key={i}>{seg.content}</span>;

        const isOpen = active === seg.index;

        return (
          <span key={i} className="relative inline-block">

            {/* Clickable word badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const opening = !isOpen;
                setActive(opening ? seg.index : null);
                if (opening && logId) {
                  fetch('/api/log/word-click', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ logId, word: seg.word }),
                  }).catch(() => {});
                }
              }}
              aria-expanded={isOpen}
              aria-label={`Tap to learn what "${seg.word}" means`}
              className="
                inline-flex items-baseline gap-0.5
                bg-teal-50 text-zuzu-teal
                border-b-2 border-dashed border-zuzu-teal
                px-1 rounded-sm font-bold cursor-pointer
                hover:bg-zuzu-teal-bg
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-teal-300
              "
            >
              {seg.word}
              <span className="text-[9px] leading-none opacity-40 translate-y-[-2px]">✦</span>
            </button>

            {/* Tooltip bubble */}
            {isOpen && (
              <span
                role="tooltip"
                onClick={(e) => e.stopPropagation()}
                className="
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                  w-56 z-50 block
                  bg-white border-2 border-zuzu-teal-bg rounded-2xl
                  shadow-lg px-4 py-3
                  animate-fade-in
                "
              >
                {/* Downward arrow */}
                <span
                  className="absolute top-full left-1/2 -translate-x-1/2 block w-0 h-0"
                  style={{
                    borderLeft:   '8px solid transparent',
                    borderRight:  '8px solid transparent',
                    borderTop:    '8px solid #CCFBF1',
                  }}
                />
                <span className="block text-zuzu-teal font-extrabold text-xs uppercase tracking-wide mb-1.5">
                  ZuZu says ✨
                </span>
                <span className="block text-slate-700 font-semibold text-sm leading-snug">
                  {seg.def}
                </span>
              </span>
            )}

          </span>
        );
      })}
    </p>
  );
}
