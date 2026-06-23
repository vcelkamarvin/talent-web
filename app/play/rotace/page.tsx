'use client';

import { useState, useRef, useCallback, useMemo, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import GameLayout from '@/components/GameLayout';
import { GAME_CYCLE, DIMENSION_COLORS, getRotationSet } from '@/lib/core/games';
import { useSession } from '@/lib/session/SessionContext';

const GAME_INDEX = 2; // Rotace 3D is index 2 in the cycle (the second game we build)
const GAME = GAME_CYCLE[GAME_INDEX];

type OptionState = 'default' | 'correct' | 'wrong';

/** Asymmetric "flag on a pole" glyph — rotation + mirror are both clearly visible. */
function RotaGlyph({ rot, mirror, color, size = 76 }: { rot: number; mirror: boolean; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g transform={`rotate(${rot} 50 50)`}>
        <g transform={mirror ? 'translate(100,0) scale(-1,1)' : undefined}>
          <rect x="40" y="18" width="9" height="62" rx="2" fill={color} />
          <polygon points="49,22 84,39 49,53" fill={color} />
          <rect x="30" y="78" width="28" height="9" rx="2" fill={color} />
        </g>
      </g>
    </svg>
  );
}

const stateStyle: Record<OptionState, CSSProperties> = {
  default: { background: 'var(--surface)', border: '1.5px solid var(--line-2)' },
  correct: { background: '#ECFDF5', border: '1.5px solid #10B981' },
  wrong:   { background: '#FEF2F2', border: '1.5px solid #EF4444' },
};

export default function RotacePage() {
  const { session, recordAnswer } = useSession();
  const router = useRouter();

  const set = useMemo(() => getRotationSet(session.ageBand), [session.ageBand]);

  const [itemIndex, setItemIndex] = useState(0);
  const [optionStates, setOptionStates] = useState<Record<number, OptionState>>({});
  const [locked, setLocked] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Interactive: drag the reference shape to rotate it and compare.
  const [dragRot, setDragRot] = useState(0);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startAngle: number; startRot: number } | null>(null);

  const angleAt = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return (Math.atan2(clientY - (r.top + r.height / 2), clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startAngle: angleAt(e.clientX, e.clientY), startRot: dragRot };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const a = angleAt(e.clientX, e.clientY);
    setDragRot(dragRef.current.startRot + (a - dragRef.current.startAngle));
  };
  const onPointerUp = () => { dragRef.current = null; setDragging(false); };

  const dimColor = DIMENSION_COLORS[GAME.dimension];
  const item = set.items[itemIndex];

  const handleOption = useCallback((optIndex: number) => {
    if (locked) return;
    setLocked(true);

    const reactionMs = Date.now() - startTimeRef.current;
    const correct = optIndex === item.answer;

    setOptionStates({ [optIndex]: correct ? 'correct' : 'wrong' });
    if (!correct) {
      setTimeout(() => {
        setOptionStates({ [optIndex]: 'wrong', [item.answer]: 'correct' });
      }, 300);
    }

    recordAnswer({ gameId: GAME.id, itemIndex, answer: optIndex, correct, reactionMs });

    setTimeout(() => {
      const nextIndex = itemIndex + 1;
      if (nextIndex >= set.items.length) {
        router.push('/result');
      } else {
        setItemIndex(nextIndex);
        setOptionStates({});
        setLocked(false);
        setDragRot(0);
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18 }}>
          {/* Reference shape — draggable to rotate */}
          <div
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${dragging ? dimColor : 'var(--line)'}`,
              borderRadius: 20,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              boxShadow: dragging ? `0 4px 18px -4px ${dimColor}55` : '0 2px 12px -4px rgba(12,14,22,0.1)',
              cursor: dragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              userSelect: 'none',
              transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Tento tvar · chyť a otoč
            </span>
            <div style={{ transition: dragging ? 'none' : 'transform 0.3s ease', pointerEvents: 'none' }}>
              <RotaGlyph rot={set.targetRot + dragRot} mirror={false} color={dimColor} size={84} />
            </div>
            <span style={{ fontSize: 16, opacity: 0.5, marginTop: 2 }}>↻</span>
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
            Který je stejný, jen otočený? 🔄
          </p>

          <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', marginTop: -6 }}>
            <span style={{ fontWeight: 600, color: dimColor }}>{set.rule}</span>
          </p>
        </div>

        {/* Options 2×2 with shapes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingBottom: 8 }}>
          {item.options.map((opt, i) => {
            const st = optionStates[i] ?? 'default';
            return (
              <button
                key={i}
                disabled={locked}
                onClick={() => handleOption(i)}
                className={`${st === 'correct' ? 'pulse-green' : ''} ${st === 'wrong' ? 'shake-red' : ''}`}
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
                  ...stateStyle[st],
                }}
                onPointerDown={e => { if (!locked) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)'; }}
                onPointerUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                onPointerLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                <RotaGlyph rot={opt.rot} mirror={opt.mirror} color={dimColor} size={72} />
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
