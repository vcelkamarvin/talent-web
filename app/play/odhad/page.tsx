'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameLayout from '@/components/GameLayout';
import OptionButton from '@/components/OptionButton';
import { AmbientField, Burst } from '@/components/GameFX';
import { GAME_CYCLE, DIMENSION_COLORS, getOdhadSet } from '@/lib/core/games';
import { useSession } from '@/lib/session/SessionContext';

const GAME_INDEX = 6; // Odhad počtu — Logika
const GAME = GAME_CYCLE[GAME_INDEX];

type OptionState = 'default' | 'correct' | 'wrong';

/** Deterministic PRNG so dot positions match between server & client (no hydration mismatch). */
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function genDots(count: number, seed: number) {
  const r = mulberry32(seed * 9973 + 1);
  return Array.from({ length: count }, () => ({ x: 6 + r() * 88, y: 6 + r() * 88 }));
}

export default function OdhadPage() {
  const { session, recordAnswer } = useSession();
  const router = useRouter();
  const set = useMemo(() => getOdhadSet(session.ageBand), [session.ageBand]);

  const [itemIndex, setItemIndex] = useState(0);
  const [phase, setPhase] = useState<'show' | 'answer'>(set.persistent ? 'answer' : 'show');
  const [optionStates, setOptionStates] = useState<Record<number, OptionState>>({});
  const [locked, setLocked] = useState(false);
  const startRef = useRef<number>(Date.now());

  const item = set.items[itemIndex];
  const dimColor = DIMENSION_COLORS[GAME.dimension];
  const dots = useMemo(() => genDots(item.count, itemIndex + 1), [item.count, itemIndex]);
  const dotSize = item.count > 50 ? 9 : item.count > 25 ? 12 : item.count > 12 ? 15 : 22;

  // Show → answer timing for the flash bands.
  useEffect(() => {
    if (set.persistent) { setPhase('answer'); startRef.current = Date.now(); return; }
    setPhase('show');
    const t = window.setTimeout(() => { setPhase('answer'); startRef.current = Date.now(); }, set.flashMs);
    return () => clearTimeout(t);
  }, [itemIndex, set.persistent, set.flashMs]);

  const handleOption = useCallback((opt: number) => {
    if (locked || phase !== 'answer') return;
    setLocked(true);
    const reactionMs = Date.now() - startRef.current;
    const correct = opt === item.answer;
    setOptionStates({ [opt]: correct ? 'correct' : 'wrong' });
    if (!correct) setTimeout(() => setOptionStates({ [opt]: 'wrong', [item.answer]: 'correct' }), 300);

    recordAnswer({ gameId: GAME.id, itemIndex, answer: opt, correct, reactionMs });

    setTimeout(() => {
      const next = itemIndex + 1;
      if (next >= set.items.length) {
        router.push('/result');
      } else {
        setItemIndex(next);
        setOptionStates({});
        setLocked(false);
      }
    }, 1000);
  }, [locked, phase, item, itemIndex, set.items.length, recordAnswer, router]);

  const dotsVisible = set.persistent || phase === 'show';
  const solved = optionStates[item.answer] === 'correct';

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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
            <p
              key={`q${itemIndex}-${phase}`}
              className="q-in"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: 'var(--ink)',
                textAlign: 'center',
              }}
            >
              {set.persistent ? 'Kolik je teček? 🔢' : phase === 'show' ? 'Zapamatuj si počet 👀' : 'Kolik teček bylo? 🔢'}
            </p>

            {/* Dot field */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 280,
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(6px)',
                border: '1px solid var(--line)',
                borderRadius: 20,
                boxShadow: '0 6px 26px -10px rgba(12,14,22,0.22)',
                overflow: 'hidden',
              }}
            >
              {dotsVisible
                ? dots.map((d, i) => (
                    <span
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${d.x}%`,
                        top: `${d.y}%`,
                        width: dotSize,
                        height: dotSize,
                        marginLeft: -dotSize / 2,
                        marginTop: -dotSize / 2,
                        borderRadius: '50%',
                        background: dimColor,
                        boxShadow: `0 1px 4px -1px ${dimColor}`,
                      }}
                    />
                  ))
                : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: 'var(--ink-3)' }}>
                    ❓
                  </div>
                )}
              {solved && <Burst n={18} />}
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, opacity: phase === 'answer' || set.persistent ? 1 : 0.35, transition: 'opacity 0.3s' }}>
              {item.options.map(opt => (
                <OptionButton
                  key={opt}
                  state={optionStates[opt] ?? 'default'}
                  disabled={locked || (!set.persistent && phase !== 'answer')}
                  onClick={() => handleOption(opt)}
                >
                  {opt}
                </OptionButton>
              ))}
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 12 }}>
            {set.items.map((_, i) => (
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
