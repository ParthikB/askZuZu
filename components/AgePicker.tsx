'use client';

import { useState, useRef } from 'react';
import ZuZu from './ZuZu';

interface AgePickerProps {
  onAgeSelected: (age: number) => void;
}

const MIN_AGE = 6;
const MAX_AGE = 15;

export default function AgePicker({ onAgeSelected }: AgePickerProps) {
  const [selectedAge, setSelectedAge] = useState(10);
  const touchStartX = useRef<number | null>(null);

  function decrement() {
    setSelectedAge(a => Math.max(MIN_AGE, a - 1));
  }

  function increment() {
    setSelectedAge(a => Math.min(MAX_AGE, a + 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 30) {
      dx < 0 ? increment() : decrement();
    }
    touchStartX.current = null;
  }

  const prevAge = selectedAge > MIN_AGE ? selectedAge - 1 : null;
  const nextAge = selectedAge < MAX_AGE ? selectedAge + 1 : null;

  return (
    <div className="min-h-screen bg-zuzu-bg flex flex-col items-center px-6 pt-10 pb-8 gap-5">

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

      {/* Drum-roll age picker — swipe left/right on touch, arrows on desktop */}
      <div
        className="animate-fade-in flex items-center justify-center gap-3 w-full select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={decrement}
          disabled={selectedAge === MIN_AGE}
          aria-label="Decrease age"
          className="text-zuzu-teal font-black text-5xl w-10 flex items-center justify-center disabled:opacity-20 transition-opacity focus:outline-none"
        >
          ‹
        </button>

        <span className="text-3xl font-extrabold text-slate-300 w-10 text-center">
          {prevAge ?? ''}
        </span>

        {/* Selected age box */}
        <div className="w-28 h-28 rounded-3xl bg-white border-3 border-zuzu-teal-bg shadow-lg flex items-center justify-center">
          <span className="text-6xl font-extrabold text-zuzu-teal leading-none">{selectedAge}</span>
        </div>

        <span className="text-3xl font-extrabold text-slate-300 w-10 text-center">
          {nextAge ?? ''}
        </span>

        <button
          onClick={increment}
          disabled={selectedAge === MAX_AGE}
          aria-label="Increase age"
          className="text-zuzu-teal font-black text-5xl w-10 flex items-center justify-center disabled:opacity-20 transition-opacity focus:outline-none"
        >
          ›
        </button>
      </div>

      {/* Let's go — mt-auto sticks it to the bottom */}
      <button
        onClick={() => onAgeSelected(selectedAge)}
        className="
          animate-gentle-bounce mt-auto
          w-full bg-zuzu-amber hover:bg-zuzu-amber-dark active:scale-95
          text-white font-extrabold text-3xl
          py-7 rounded-3xl
          shadow-lg shadow-amber-200
          transition-colors duration-150
          focus:outline-none focus:ring-4 focus:ring-amber-300
        "
        aria-label={`Continue as age ${selectedAge}`}
      >
        Let&apos;s go! 🚀
      </button>
    </div>
  );
}
