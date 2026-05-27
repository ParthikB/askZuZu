'use client';

import { useState } from 'react';
import ZuZu from './ZuZu';

interface AgePickerProps {
  onAgeSelected: (age: number) => void;
}

const AGES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// Dial geometry
const CX = 155; // SVG center x
const CY = 155; // SVG center y
const NUMBER_RADIUS = 115; // radius to number circle centers
const HAND_RADIUS = 90;    // hand length (stops before the number circles)

function angleFor(index: number): number {
  // Start at top (–90°) going clockwise, 36° per step
  return (-90 + index * 36) * (Math.PI / 180);
}

function positionFor(index: number, r: number) {
  const a = angleFor(index);
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

export default function AgePicker({ onAgeSelected }: AgePickerProps) {
  const [selectedAge, setSelectedAge] = useState(10);

  const selectedIndex = AGES.indexOf(selectedAge);
  const handEnd = positionFor(selectedIndex, HAND_RADIUS);

  return (
    <div className="min-h-screen bg-zuzu-bg flex flex-col items-center justify-center px-4 py-8 gap-6">
      {/* ZuZu greeting */}
      <div className="animate-pop-in">
        <ZuZu expression="idle" size="large" />
      </div>

      <div className="text-center animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zuzu-teal-dark leading-tight">
          Hi! I&apos;m ZuZu!
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 font-semibold mt-1">
          How old are you?
        </p>
      </div>

      {/* Rotary dial */}
      <div className="animate-fade-in">
        <svg
          width="310"
          height="310"
          viewBox="0 0 310 310"
          className="touch-none"
          role="group"
          aria-label="Age selector dial"
        >
          {/* Outer decorative ring */}
          <circle cx={CX} cy={CY} r="148" fill="white" stroke="#CCFBF1" strokeWidth="3" />
          <circle cx={CX} cy={CY} r="136" fill="#F0FDFA" />

          {/* Tick marks */}
          {AGES.map((_, i) => {
            const inner = positionFor(i, 126);
            const outer = positionFor(i, 134);
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="#99F6E4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Hand / pointer */}
          <line
            x1={CX}
            y1={CY}
            x2={handEnd.x}
            y2={handEnd.y}
            stroke="#0D9488"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ transition: 'x2 0.25s ease, y2 0.25s ease' }}
          />
          {/* Hand tip dot */}
          <circle
            cx={handEnd.x}
            cy={handEnd.y}
            r="7"
            fill="#FBBF24"
            style={{ transition: 'cx 0.25s ease, cy 0.25s ease' }}
          />

          {/* Center hub */}
          <circle cx={CX} cy={CY} r="52" fill="white" stroke="#CCFBF1" strokeWidth="3" />
          <text
            x={CX}
            y={CY + 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="46"
            fontWeight="800"
            fill="#0D9488"
            fontFamily="Nunito, sans-serif"
          >
            {selectedAge}
          </text>

          {/* Age numbers around the dial */}
          {AGES.map((age, i) => {
            const pos = positionFor(i, NUMBER_RADIUS);
            const isSelected = age === selectedAge;
            return (
              <g
                key={age}
                onClick={() => setSelectedAge(age)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`Age ${age}`}
                aria-pressed={isSelected}
              >
                {/* Outer glow ring on selected */}
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r="26" fill="#5EEAD4" opacity="0.35" />
                )}
                {/* Number background circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  fill={isSelected ? '#0D9488' : 'white'}
                  stroke={isSelected ? '#0D9488' : '#CCFBF1'}
                  strokeWidth="2"
                  style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
                />
                {/* Number label */}
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fontWeight="800"
                  fill={isSelected ? 'white' : '#0D9488'}
                  fontFamily="Nunito, sans-serif"
                  style={{ transition: 'fill 0.2s ease' }}
                >
                  {age}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Let's go button */}
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
