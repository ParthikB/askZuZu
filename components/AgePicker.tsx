'use client';

import { useState } from 'react';
import ZuZu from './ZuZu';

interface AgePickerProps {
  onAgeSelected: (age: number) => void;
}

const MIN_AGE = 6;
const MAX_AGE = 15;

export default function AgePicker({ onAgeSelected }: AgePickerProps) {
  const [selectedAge, setSelectedAge] = useState(10);

  const fillPct = ((selectedAge - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100;

  function decrement() {
    setSelectedAge(a => Math.max(MIN_AGE, a - 1));
  }

  function increment() {
    setSelectedAge(a => Math.min(MAX_AGE, a + 1));
  }

  return (
    <div className="min-h-screen bg-zuzu-bg flex flex-col items-center justify-center px-6 py-6 gap-5">

      <div className="animate-pop-in">
        <ZuZu expression="idle" size="small" />
      </div>

      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-extrabold text-zuzu-teal-dark leading-tight">
          Hi! I&apos;m ZuZu!
        </h1>
        <p className="text-xl text-slate-600 font-semibold mt-1">
          How old are you?
        </p>
      </div>

      {/* Selected age display */}
      <div className="animate-fade-in flex flex-col items-center gap-5 w-full max-w-xs">
        <div className="w-28 h-28 rounded-full bg-white border-3 border-zuzu-teal-bg shadow-md flex items-center justify-center">
          <span className="text-6xl font-extrabold text-zuzu-teal leading-none">{selectedAge}</span>
        </div>

        {/* Slider row */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={decrement}
            disabled={selectedAge === MIN_AGE}
            aria-label="Decrease age"
            className="
              w-12 h-12 shrink-0 rounded-full
              bg-white border-2 border-zuzu-teal-bg
              text-zuzu-teal font-extrabold text-3xl
              flex items-center justify-center
              shadow-sm hover:bg-zuzu-teal-bg active:scale-95
              transition-all duration-150
              disabled:opacity-30 disabled:cursor-not-allowed
              focus:outline-none focus:ring-4 focus:ring-teal-200
            "
          >
            ‹
          </button>

          <div className="flex-1 flex flex-col gap-2">
            <input
              type="range"
              min={MIN_AGE}
              max={MAX_AGE}
              step={1}
              value={selectedAge}
              onChange={e => setSelectedAge(Number(e.target.value))}
              className="age-slider w-full"
              style={{
                background: `linear-gradient(to right, #0D9488 ${fillPct}%, #CCFBF1 ${fillPct}%)`,
              }}
              aria-label={`Age: ${selectedAge}`}
            />
            <div className="flex justify-between text-sm text-slate-400 font-bold px-1">
              <span>{MIN_AGE}</span>
              <span>{MAX_AGE}</span>
            </div>
          </div>

          <button
            onClick={increment}
            disabled={selectedAge === MAX_AGE}
            aria-label="Increase age"
            className="
              w-12 h-12 shrink-0 rounded-full
              bg-white border-2 border-zuzu-teal-bg
              text-zuzu-teal font-extrabold text-3xl
              flex items-center justify-center
              shadow-sm hover:bg-zuzu-teal-bg active:scale-95
              transition-all duration-150
              disabled:opacity-30 disabled:cursor-not-allowed
              focus:outline-none focus:ring-4 focus:ring-teal-200
            "
          >
            ›
          </button>
        </div>
      </div>

      <button
        onClick={() => onAgeSelected(selectedAge)}
        className="
          animate-gentle-bounce
          bg-zuzu-amber hover:bg-zuzu-amber-dark active:scale-95
          text-white font-extrabold text-2xl
          px-12 py-5 rounded-3xl
          shadow-lg shadow-amber-200
          transition-colors duration-150
          min-w-[220px]
          focus:outline-none focus:ring-4 focus:ring-amber-300
        "
        aria-label={`Continue as age ${selectedAge}`}
      >
        Let&apos;s go! 🚀
      </button>
    </div>
  );
}
