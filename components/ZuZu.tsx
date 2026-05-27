'use client';

export type ZuZuExpression = 'idle' | 'thinking' | 'happy' | 'gentle';

interface ZuZuProps {
  expression: ZuZuExpression;
  size?: 'large' | 'small';
  className?: string;
}

/**
 * ZuZu — the robot character.
 *
 * Robot anatomy (all coordinates within 200×285 viewBox):
 *   Antenna ball  (100, 14)
 *   Head          x=22,  y=50,  w=156, h=100
 *   Screen face   x=36,  y=63,  w=128, h=74   ← expressions live here
 *   Body          x=32,  y=158, w=136, h=80
 *   Left arm      x=2,   y=165, w=28,  h=62
 *   Right arm     x=170, y=165, w=28,  h=62
 *   Left leg      x=52,  y=240, w=38,  h=40
 *   Right leg     x=110, y=240, w=38,  h=40
 *
 * Expression states:
 *   idle     — calm oval eyes (with CSS blink animation)
 *   thinking — three bouncing dots
 *   happy    — squinting arc eyes + small smile
 *   gentle   — soft downward-tilted eyes (shown on safety redirects)
 */
export default function ZuZu({ expression, size = 'large', className = '' }: ZuZuProps) {
  const height = size === 'large' ? 210 : 160;
  const width = Math.round(height * (200 / 285));

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 285"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label={`ZuZu the robot, ${expression}`}
      role="img"
    >
      {/* ── Antenna ──────────────────────────────────────────────────────── */}
      <line x1="100" y1="24" x2="100" y2="50" stroke="#0F766E" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="14" r="11" fill="#FBBF24" />
      <circle cx="100" cy="14" r="6" fill="#F59E0B" />

      {/* ── Head ─────────────────────────────────────────────────────────── */}
      {/* Head shadow/depth */}
      <rect x="25" y="55" width="156" height="100" rx="22" fill="#0F766E" />
      {/* Head main */}
      <rect x="22" y="50" width="156" height="100" rx="22" fill="#0D9488" />
      {/* Head highlight (top-left sheen) */}
      <rect x="34" y="58" width="50" height="14" rx="7" fill="#2DD4BF" opacity="0.45" />

      {/* ── Screen / face ────────────────────────────────────────────────── */}
      <rect x="36" y="63" width="128" height="74" rx="12" fill="#0F172A" />
      {/* Screen subtle scanline sheen */}
      <rect x="36" y="63" width="128" height="6" rx="4" fill="#1E293B" opacity="0.8" />

      {/* Expression content */}
      <FaceExpression expression={expression} />

      {/* ── Ear bolts ────────────────────────────────────────────────────── */}
      <circle cx="22" cy="100" r="8" fill="#0F766E" />
      <circle cx="22" cy="100" r="4" fill="#5EEAD4" />
      <circle cx="178" cy="100" r="8" fill="#0F766E" />
      <circle cx="178" cy="100" r="4" fill="#5EEAD4" />

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      {/* Body shadow/depth */}
      <rect x="35" y="163" width="136" height="80" rx="20" fill="#0F766E" />
      {/* Body main */}
      <rect x="32" y="158" width="136" height="80" rx="20" fill="#0D9488" />
      {/* Body highlight */}
      <rect x="44" y="167" width="48" height="12" rx="6" fill="#2DD4BF" opacity="0.4" />

      {/* Chest lights */}
      <circle cx="76" cy="200" r="9" fill="#FBBF24" />
      <circle cx="76" cy="200" r="5" fill="#FDE68A" />
      <circle cx="100" cy="200" r="9" fill="#5EEAD4" />
      <circle cx="100" cy="200" r="5" fill="#CCFBF1" />
      <circle cx="124" cy="200" r="9" fill="#FBBF24" />
      <circle cx="124" cy="200" r="5" fill="#FDE68A" />

      {/* ── Arms ─────────────────────────────────────────────────────────── */}
      {/* Left arm */}
      <rect x="4" y="168" width="26" height="62" rx="12" fill="#0F766E" />
      <rect x="2" y="165" width="26" height="62" rx="12" fill="#0D9488" />
      {/* Left hand */}
      <rect x="4" y="220" width="22" height="14" rx="7" fill="#0F766E" />

      {/* Right arm */}
      <rect x="170" y="168" width="26" height="62" rx="12" fill="#0F766E" />
      <rect x="172" y="165" width="26" height="62" rx="12" fill="#0D9488" />
      {/* Right hand */}
      <rect x="174" y="220" width="22" height="14" rx="7" fill="#0F766E" />

      {/* ── Legs ─────────────────────────────────────────────────────────── */}
      {/* Left leg */}
      <rect x="55" y="243" width="38" height="40" rx="12" fill="#0F766E" />
      <rect x="52" y="240" width="38" height="40" rx="12" fill="#0D9488" />
      {/* Left foot */}
      <rect x="48" y="272" width="46" height="13" rx="7" fill="#0F766E" />

      {/* Right leg */}
      <rect x="113" y="243" width="38" height="40" rx="12" fill="#0F766E" />
      <rect x="110" y="240" width="38" height="40" rx="12" fill="#0D9488" />
      {/* Right foot */}
      <rect x="106" y="272" width="46" height="13" rx="7" fill="#0F766E" />
    </svg>
  );
}

// ── Face sub-components ───────────────────────────────────────────────────────
// Screen area reference: x=36..164, y=63..137  (center: 100, 100)

function FaceExpression({ expression }: { expression: ZuZuExpression }) {
  switch (expression) {
    case 'thinking':
      return <ThinkingFace />;
    case 'happy':
      return <HappyFace />;
    case 'gentle':
      return <GentleFace />;
    default:
      return <IdleFace />;
  }
}

function IdleFace() {
  return (
    <g>
      {/* Left eye */}
      <g style={{ transformBox: 'fill-box', transformOrigin: 'center' }} className="animate-blink-eye">
        <ellipse cx="80" cy="97" rx="14" ry="12" fill="white" />
        <circle cx="83" cy="99" r="7" fill="#0F172A" />
        <circle cx="86" cy="95" r="3" fill="white" />
      </g>
      {/* Right eye */}
      <g style={{ transformBox: 'fill-box', transformOrigin: 'center' }} className="animate-blink-eye">
        <ellipse cx="120" cy="97" rx="14" ry="12" fill="white" />
        <circle cx="123" cy="99" r="7" fill="#0F172A" />
        <circle cx="126" cy="95" r="3" fill="white" />
      </g>
    </g>
  );
}

function ThinkingFace() {
  return (
    <g>
      {/* Three bouncing dots */}
      <circle cx="76" cy="100" r="8" fill="#5EEAD4" className="animate-think-dot-1" />
      <circle cx="100" cy="100" r="8" fill="#5EEAD4" className="animate-think-dot-2" />
      <circle cx="124" cy="100" r="8" fill="#5EEAD4" className="animate-think-dot-3" />
    </g>
  );
}

function HappyFace() {
  return (
    <g>
      {/* Left squinting eye — arc that opens downward = happy squint */}
      <path
        d="M 66 97 Q 80 84 94 97"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right squinting eye */}
      <path
        d="M 106 97 Q 120 84 134 97"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Smile */}
      <path
        d="M 84 113 Q 100 124 116 113"
        stroke="#5EEAD4"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function GentleFace() {
  return (
    <g>
      {/* Left eye — slightly smaller, softer, tilted down at outer edge */}
      <ellipse cx="80" cy="97" rx="12" ry="9" fill="white" opacity="0.9" />
      <circle cx="82" cy="98" r="5" fill="#0F172A" />
      <circle cx="84" cy="95" r="2" fill="white" />

      {/* Right eye */}
      <ellipse cx="120" cy="97" rx="12" ry="9" fill="white" opacity="0.9" />
      <circle cx="122" cy="98" r="5" fill="#0F172A" />
      <circle cx="124" cy="95" r="2" fill="white" />

      {/* Gentle small smile */}
      <path
        d="M 88 112 Q 100 119 112 112"
        stroke="#5EEAD4"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </g>
  );
}
