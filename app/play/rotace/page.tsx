'use client';

import { useState, useRef, useCallback, useMemo, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import GameLayout from '@/components/GameLayout';
import { GAME_CYCLE, DIMENSION_COLORS, getFitSet } from '@/lib/core/games';
import { useSession } from '@/lib/session/SessionContext';
import type { ShapeKey } from '@/lib/core/types';

const GAME_INDEX = 2; // Prostorová — second game we built
const GAME = GAME_CYCLE[GAME_INDEX];

type OptionState = 'default' | 'correct' | 'wrong';

/** One SVG silhouette per shape key. `hole` = dashed cut-out, jinak plný barevný dílek. */
function Shape({ shape, rot = 0, color, size = 72, hole = false }: { shape: ShapeKey; rot?: number; color: string; size?: number; hole?: boolean }) {
  const fill = hole ? 'var(--bg)' : color;
  const stroke = hole ? 'var(--ink-3)' : 'none';
  const sw = hole ? 2.5 : 0;
  const p = { fill, stroke, strokeWidth: sw, strokeDasharray: hole ? '6 5' : undefined, strokeLinejoin: 'round' as const };

  let el: React.ReactNode = null;
  switch (shape) {
    case 'circle':   el = <circle cx="50" cy="50" r="36" {...p} />; break;
    case 'square':   el = <rect x="16" y="16" width="68" height="68" rx="10" {...p} />; break;
    case 'triangle': el = <polygon points="50,16 84,82 16,82" {...p} />; break;
    case 'diamond':  el = <polygon points="50,14 86,50 50,86 14,50" {...p} />; break;
    case 'pentagon': el = <polygon points="50,14 84.24,38.88 71.16,79.13 28.84,79.13 15.76,38.88" {...p} />; break;
    case 'hexagon':  el = <polygon points="50,14 81.18,32 81.18,68 50,86 18.82,68 18.82,32" {...p} />; break;
    case 'heptagon': el = <polygon points="50,14 78.14,27.55 85.1,58.01 65.62,82.44 34.38,82.44 14.9,58.01 21.86,27.55" {...p} />; break;
    case 'octagon':  el = <polygon points="50,14 75.46,24.54 86,50 75.46,75.46 50,86 24.54,75.46 14,50 24.54,24.54" {...p} />; break;
    case 'star':     el = <polygon points="50,12 59.4,37.06 86.14,38.26 65.22,54.94 72.33,80.74 50,66 27.67,80.74 34.78,54.94 13.86,38.26 40.6,37.06" {...p} />; break;
    case 'heart':    el = <path d="M50 80 C 16 56, 22 26, 44 28 C 49 28.5, 50 34, 50 38 C 50 34, 51 28.5, 56 28 C 78 26, 84 56, 50 80 Z" {...p} />; break;
    case 'arrow':    el = <polygon points="16,40 56,40 56,24 86,50 56,76 56,60 16,60" {...p} />; break;
    case 'cross':    el = <polygon points="40,16 60,16 60,40 84,40 84,60 60,60 60,84 40,84 40,60 16,60 16,40 40,40" {...p} />; break;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g transform={`rotate(${rot} 50 50)`}>{el}</g>
    </svg>
  );
}

const stateStyle: Record<OptionState, CSSProperties> = {
  default: { background: 'var(--surface)', border: '1.5px solid var(--line-2)' },
  correct: { background: '#ECFDF5', border: '1.5px solid #10B981' },
  wrong:   { background: '#FEF2F2', border: '1.5px solid #EF4444' },
};

export default function SkladackaPage() {
  const { session, recordAnswer } = useSession();
  const router = useRouter();

  const set = useMemo(() => getFitSet(session.ageBand), [session.ageBand]);

  const [itemIndex, setItemIndex] = useState(0);
  const [optionStates, setOptionStates] = useState<Record<number, OptionState>>({});
  const [locked, setLocked] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const dimColor = DIMENSION_COLORS[GAME.dimension];
  const item = set.items[itemIndex];

  const handleOption = useCallback((i: number) => {
    if (locked) return;
    setLocked(true);

    const reactionMs = Date.now() - startTimeRef.current;
    const correct = i === item.answer;

    setOptionStates({ [i]: correct ? 'correct' : 'wrong' });
    if (!correct) {
      setTimeout(() => setOptionStates({ [i]: 'wrong', [item.answer]: 'correct' }), 300);
    }

    recordAnswer({ gameId: GAME.id, itemIndex, answer: i, correct, reactionMs });

    setTimeout(() => {
      const nextIndex = itemIndex + 1;
      if (nextIndex >= set.items.length) {
        router.push('/result');
      } else {
        setItemIndex(nextIndex);
        setOptionStates({});
        setLocked(false);
        startTimeRef.current = Date.now();
      }
    }, 900);
  }, [locked, item, itemIndex, set.items.length, recordAnswer, router]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 24px 36px', minHeight: '100dvh' }}>
      <GameLayout
        gameNumber={GAME_INDEX + 1}
        totalGames={GAME_CYCLE.length}
        categoryLabel={GAME.label}
        categoryColor={dimColor}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          {/* Board with the hole */}
          <div
            style={{
              position: 'relative',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 24,
              padding: '22px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 16px -6px rgba(12,14,22,0.12)',
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Tato díra
            </span>
            <Shape shape={item.hole.shape} rot={item.hole.rot} color={dimColor} size={96} hole />
          </div>

          <p
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: 'var(--ink-2)',
              textAlign: 'center',
            }}
          >
            Který dílek sem pasuje? 🧩
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', marginTop: -6 }}>
            <span style={{ fontWeight: 600, color: dimColor }}>{set.rule}</span>
          </p>
        </div>

        {/* Options 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingBottom: 8 }}>
          {item.options.map((opt, i) => {
            const st = optionStates[i] ?? 'default';
            return (
              <button
                key={i}
                disabled={locked}
                onClick={() => handleOption(i)}
                className={`pop-in ${st === 'correct' ? 'pulse-green' : ''} ${st === 'wrong' ? 'shake-red' : ''}`}
                style={{
                  height: 104,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: locked ? 'default' : 'pointer',
                  transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
                  boxShadow: '0 1px 0 rgba(12,14,22,0.04)',
                  WebkitTapHighlightColor: 'transparent',
                  animationDelay: `${i * 0.06}s`,
                  ...stateStyle[st],
                }}
                onPointerDown={e => { if (!locked) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)'; }}
                onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                onPointerLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                <Shape shape={opt.shape} rot={opt.rot} color={dimColor} size={72} />
              </button>
            );
          })}
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
  );
}
