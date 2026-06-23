'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GameLayout from '@/components/GameLayout';
import { AmbientField, Burst } from '@/components/GameFX';
import { GAME_CYCLE, DIMENSION_COLORS, getHledaniSet } from '@/lib/core/games';
import { useSession } from '@/lib/session/SessionContext';

const GAME_INDEX = 0; // Hledání — first in play order
const GAME = GAME_CYCLE[GAME_INDEX];

type CellState = 'default' | 'correct' | 'wrong' | 'reveal';

export default function HledaniPage() {
  const { session, recordAnswer } = useSession();
  const router = useRouter();

  const set = useMemo(() => getHledaniSet(session.ageBand), [session.ageBand]);

  const [itemIndex, setItemIndex] = useState(0);
  const [cellStates, setCellStates] = useState<Record<number, CellState>>({});
  const [locked, setLocked] = useState(false);
  const [answered, setAnswered] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const dimColor = DIMENSION_COLORS[GAME.dimension];
  const item = set.items[itemIndex];
  const cellCount = item.cols * item.rows;
  const gap = item.cols >= 5 ? 6 : 10;
  const fontScale = item.cols >= 6 ? 22 : item.cols >= 5 ? 26 : item.cols >= 4 ? 30 : 38;

  const handleCell = useCallback((i: number) => {
    if (locked) return;
    setLocked(true);
    setAnswered(true);

    const reactionMs = Date.now() - startTimeRef.current;
    const correct = i === item.oddIndex;

    setCellStates({ [i]: correct ? 'correct' : 'wrong' });
    if (!correct) {
      setTimeout(() => setCellStates({ [i]: 'wrong', [item.oddIndex]: 'reveal' }), 300);
    }

    recordAnswer({ gameId: GAME.id, itemIndex, answer: i, correct, reactionMs });

    setTimeout(() => {
      const nextIndex = itemIndex + 1;
      if (nextIndex >= set.items.length) {
        router.push('/play');
      } else {
        setItemIndex(nextIndex);
        setCellStates({});
        setLocked(false);
        setAnswered(false);
        startTimeRef.current = Date.now();
      }
    }, 1000);
  }, [locked, item, itemIndex, set.items.length, recordAnswer, router]);

  function ring(state: CellState): string {
    if (state === 'correct' || state === 'reveal') return '0 0 0 3px #10B981, 0 0 20px 1px rgba(16,185,129,0.5)';
    if (state === 'wrong') return '0 0 0 3px #EF4444';
    return 'none';
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
            <p
              key={`q${itemIndex}`}
              className="q-in"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: 17,
                color: 'var(--ink-2)',
                textAlign: 'center',
              }}
            >
              Co se sem nehodí? 🔍
            </p>

            {/* Emoji grid */}
            <div
              key={itemIndex}
              className="q-in"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${item.cols}, 1fr)`,
                gap,
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(6px)',
                border: '1px solid var(--line)',
                borderRadius: 20,
                padding: 14,
                boxShadow: '0 6px 26px -10px rgba(12,14,22,0.22)',
              }}
            >
              {Array.from({ length: cellCount }).map((_, i) => {
                const isOdd = i === item.oddIndex;
                const emoji = isOdd ? item.odd : item.base;
                const state = cellStates[i] ?? 'default';
                const highlight = state === 'correct' || state === 'reveal';
                const dimmed = answered && !highlight;
                return (
                  <button
                    key={i}
                    disabled={locked}
                    onClick={() => handleCell(i)}
                    className={`pop-in ${state === 'wrong' ? 'shake-red' : ''}`}
                    style={{
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      width: '100%',
                      borderRadius: 12,
                      border: '1px solid var(--line)',
                      background: 'var(--bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: fontScale,
                      lineHeight: 1,
                      cursor: locked ? 'default' : 'pointer',
                      boxShadow: ring(state),
                      transition: 'box-shadow 0.18s, transform 0.15s, opacity 0.25s',
                      WebkitTapHighlightColor: 'transparent',
                      padding: 0,
                      opacity: dimmed ? 0.25 : 1,
                      transform: dimmed ? 'scale(0.9)' : 'scale(1)',
                      animationDelay: `${Math.min(i * 0.02, 0.4)}s`,
                    }}
                    onPointerDown={e => { if (!locked) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.9)'; }}
                    onPointerUp={e => { if (!answered) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                    onPointerLeave={e => { if (!answered) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                  >
                    <span
                      className={highlight ? 'pop-bounce' : 'wiggle'}
                      style={{ pointerEvents: 'none', display: 'inline-block', animationDelay: highlight ? '0s' : `${(i % 5) * 0.22}s` }}
                    >
                      {emoji}
                    </span>
                    {highlight && <Burst n={14} />}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
              <span style={{ fontWeight: 600, color: dimColor }}>{set.rule}</span>
            </p>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 8 }}>
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
