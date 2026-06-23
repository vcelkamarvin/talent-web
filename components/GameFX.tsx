'use client';

import { useMemo, type CSSProperties } from 'react';

/** Allows CSS custom properties (--x) in inline styles without TS complaints. */
type StyleVars = CSSProperties & { [key: `--${string}`]: string | number };

const FIELD: { l: string; t: string; s: number; c: string; op: number; dur: number; d: number }[] = [
  { l: '10%', t: '18%', s: 10, c: '#8E6CFF', op: 0.22, dur: 7.5, d: 0 },
  { l: '82%', t: '12%', s: 8,  c: '#F59E0B', op: 0.20, dur: 9.0, d: 1.2 },
  { l: '20%', t: '70%', s: 12, c: '#10B981', op: 0.18, dur: 8.5, d: 0.6 },
  { l: '70%', t: '64%', s: 9,  c: '#EC4899', op: 0.20, dur: 7.0, d: 2.0 },
  { l: '50%', t: '28%', s: 7,  c: '#2563EB', op: 0.16, dur: 10,  d: 0.3 },
  { l: '88%', t: '46%', s: 11, c: '#5B8CFF', op: 0.18, dur: 8.0, d: 1.6 },
  { l: '8%',  t: '48%', s: 8,  c: '#F97316', op: 0.18, dur: 9.5, d: 2.4 },
  { l: '40%', t: '84%', s: 9,  c: '#7C3AED', op: 0.20, dur: 7.8, d: 0.9 },
];

/** Soft floating colored dots — ambient depth behind the game. */
export function AmbientField() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {FIELD.map((p, i) => (
        <span
          key={i}
          className="drift"
          style={{
            position: 'absolute',
            left: p.l,
            top: p.t,
            width: p.s,
            height: p.s,
            borderRadius: '50%',
            background: p.c,
            filter: 'blur(1px)',
            '--op': p.op,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.d}s`,
          } as StyleVars}
        />
      ))}
    </div>
  );
}

const PALETTE = ['#F59E0B', '#10B981', '#EC4899', '#2563EB', '#7C3AED', '#F97316'];

/** Confetti burst — render when an answer is correct (centered on its parent). */
export function Burst({ n = 16 }: { n?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: n }).map((_, i) => {
        const ang = (i / n) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 34 + Math.random() * 30;
        return {
          tx: Math.cos(ang) * dist,
          ty: Math.sin(ang) * dist,
          rot: Math.round(Math.random() * 360),
          c: PALETTE[i % PALETTE.length],
          delay: Math.random() * 0.05,
        };
      }),
    [n],
  );
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 5 }}>
      {parts.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            background: p.c,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
          } as StyleVars}
        />
      ))}
    </div>
  );
}
