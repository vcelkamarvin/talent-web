'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameLayout from '@/components/GameLayout';
import { AmbientField, Burst } from '@/components/GameFX';
import { GAME_CYCLE, DIMENSION_COLORS, getLockSet } from '@/lib/core/games';
import { useSession } from '@/lib/session/SessionContext';

const GAME_INDEX = 2; // Prostorová
const GAME = GAME_CYCLE[GAME_INDEX];
const ROUNDS = 3;
const RING_COLORS = ['#7C3AED', '#2563EB', '#EC4899'];
const RADII = [30, 58, 86];

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ZamekPage() {
  const { session, recordAnswer } = useSession();
  const router = useRouter();
  const set = useMemo(() => getLockSet(session.ageBand), [session.ageBand]);

  const rings = set.rings;
  const step = set.stepDeg;
  const positions = Math.round(360 / step);

  const genOffsets = useMemo(() => {
    return (seed: number): number[] =>
      Array.from({ length: rings }, (_, r) => {
        const rnd = mulberry32(seed * 131 + r * 17 + 1);
        const m = 1 + Math.floor(rnd() * (positions - 1)); // non-zero multiple
        return (m * step) % 360;
      });
  }, [rings, positions, step]);

  const [itemIndex, setItemIndex] = useState(0);
  const [offsets, setOffsets] = useState<number[]>(() => genOffsets(0));
  const [solved, setSolved] = useState(false);
  const timers = useRef<number[]>([]);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    setOffsets(genOffsets(itemIndex));
    setSolved(false);
    startRef.current = Date.now();
  }, [itemIndex, genOffsets]);

  useEffect(() => {
    const t = timers.current;
    return () => { t.forEach(clearTimeout); };
  }, []);

  const dimColor = DIMENSION_COLORS[GAME.dimension];

  function rotateRing(r: number) {
    if (solved) return;
    const next = offsets.map((o, idx) => (idx === r ? (o + step) % 360 : o));
    setOffsets(next);
    if (next.every(o => o === 0)) {
      setSolved(true);
      recordAnswer({ gameId: GAME.id, itemIndex, answer: itemIndex, correct: true, reactionMs: Date.now() - startRef.current });
      const t = window.setTimeout(() => {
        const nx = itemIndex + 1;
        if (nx >= ROUNDS) router.push('/play/odhad');
        else setItemIndex(nx);
      }, 1150);
      timers.current.push(t);
    }
  }

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 24px 36px', minHeight: '100dvh', overflow: 'hidden' }}>
      <AmbientField />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <GameLayout
          gameNumber={GAME_INDEX + 1}
          totalGames={GAME_CYCLE.length}
          categoryLabel={GAME.label}
          categoryColor={dimColor}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18 }}>
            <p
              key={`q${itemIndex}-${solved}`}
              className="q-in"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: 'var(--ink)',
                textAlign: 'center',
              }}
            >
              {solved ? 'Odemčeno! 🔓' : 'Zarovnej prsteny 🔐'}
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--ink-3)', textAlign: 'center', marginTop: -8 }}>
              Ťukej na prsten — otoč ho, ať gem míří nahoru ke značce
            </p>

            {/* Lock */}
            <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Hogwarts-ish radial glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: 24,
                  borderRadius: '50%',
                  background: solved
                    ? 'radial-gradient(circle, rgba(16,185,129,0.35), transparent 70%)'
                    : `radial-gradient(circle, ${dimColor}22, transparent 70%)`,
                  transition: 'background 0.4s',
                }}
              />
              <svg width={260} height={260} viewBox="0 0 200 200" style={{ position: 'relative' }}>
                {/* target marker (top) */}
                <polygon points="100,2 94,13 106,13" fill="var(--ink)" opacity={0.55} />
                {Array.from({ length: rings }).map((_, r) => {
                  const radius = RADII[r];
                  const aligned = offsets[r] === 0;
                  const color = aligned ? '#10B981' : RING_COLORS[r];
                  return (
                    <g key={r}>
                      {/* track */}
                      <circle cx="100" cy="100" r={radius} fill="none" stroke={`${color}22`} strokeWidth={12} />
                      {/* rotating gem + spoke */}
                      <g transform={`rotate(${offsets[r]} 100 100)`} style={{ transition: 'transform 0.4s cubic-bezier(0.34,1.4,0.64,1)' }}>
                        <line x1="100" y1="100" x2="100" y2={100 - radius} stroke={`${color}55`} strokeWidth={3} strokeLinecap="round" />
                        <circle cx="100" cy={100 - radius} r={aligned ? 9 : 7.5} fill={color} style={{ filter: `drop-shadow(0 0 ${aligned ? 8 : 5}px ${color})`, transition: 'r 0.2s' }} />
                      </g>
                      {/* invisible hit-band */}
                      <circle
                        cx="100" cy="100" r={radius} fill="none" stroke="transparent" strokeWidth={24}
                        pointerEvents="stroke"
                        style={{ cursor: solved ? 'default' : 'pointer' }}
                        onClick={() => rotateRing(r)}
                      />
                    </g>
                  );
                })}
                {/* center hub */}
                <circle cx="100" cy="100" r={14} fill={solved ? '#10B981' : 'var(--ink)'} opacity={0.9} style={{ transition: 'fill 0.3s' }} />
                <text x="100" y="105" textAnchor="middle" fontSize="14" fill="#fff">{solved ? '🔓' : '🔒'}</text>
              </svg>
              {solved && <Burst n={22} />}
            </div>

            {/* ring alignment chips */}
            <div style={{ display: 'flex', gap: 8 }}>
              {Array.from({ length: rings }).map((_, r) => {
                const aligned = offsets[r] === 0;
                const color = aligned ? '#10B981' : RING_COLORS[r];
                return (
                  <span
                    key={r}
                    style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: color,
                      boxShadow: aligned ? `0 0 10px 1px ${color}` : 'none',
                      transition: 'all 0.25s',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Round progress */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 8 }}>
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: dimColor,
                  opacity: i <= itemIndex ? 1 : 0.4,
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        </GameLayout>
      </div>
    </div>
  );
}
