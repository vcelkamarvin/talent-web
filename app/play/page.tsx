'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GameLayout from '@/components/GameLayout';
import OptionButton from '@/components/OptionButton';
import { GAME_CYCLE, DIMENSION_COLORS, getSequenceSet, SEQUENCE_COLORS } from '@/lib/core/games';
import { useSession } from '@/lib/session/SessionContext';

const GAME_INDEX = 1; // Posloupnost is second in cycle (index 1), but it's the first we build
const GAME = GAME_CYCLE[GAME_INDEX];

type OptionState = 'default' | 'correct' | 'wrong';

export default function PlayPage() {
  const { session, recordAnswer } = useSession();
  const router = useRouter();

  // Age-adaptive: pick colors (4–6) or number sequences (7+) based on the chosen band.
  const set = useMemo(() => getSequenceSet(session.ageBand), [session.ageBand]);

  const [itemIndex, setItemIndex] = useState(0);
  // Option states are keyed by the option value (number or color key).
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [locked, setLocked] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const dimColor = DIMENSION_COLORS[GAME.dimension];
  const totalItems = set.items.length;

  const advance = useCallback((correct: boolean, answerIndex: number) => {
    const reactionMs = Date.now() - startTimeRef.current;
    recordAnswer({
      gameId: GAME.id,
      itemIndex,
      answer: answerIndex,
      correct,
      reactionMs,
    });

    setTimeout(() => {
      const nextIndex = itemIndex + 1;
      if (nextIndex >= totalItems) {
        router.push('/play/rotace');
      } else {
        setItemIndex(nextIndex);
        setOptionStates({});
        setLocked(false);
        startTimeRef.current = Date.now();
      }
    }, 900);
  }, [itemIndex, totalItems, recordAnswer, router]);

  // ─── Color mode (4–6) ───
  if (set.mode === 'color') {
    const item = set.items[itemIndex];

    function handleColor(optKey: string, optIndex: number) {
      if (locked) return;
      setLocked(true);
      const correct = optKey === item.answer;
      setOptionStates({ [optKey]: correct ? 'correct' : 'wrong' });
      if (!correct) {
        setTimeout(() => {
          setOptionStates({ [optKey]: 'wrong', [item.answer]: 'correct' });
        }, 300);
      }
      advance(correct, optIndex);
    }

    const swatch = (key: string | null, size: number, missing = false) => (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: missing || key === null ? 'transparent' : SEQUENCE_COLORS[key].hex,
          border: missing || key === null ? `3px dashed ${dimColor}` : '3px solid rgba(255,255,255,0.7)',
          boxShadow: missing || key === null ? 'none' : '0 4px 12px -3px rgba(12,14,22,0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.5,
          fontWeight: 800,
          color: dimColor,
        }}
      >
        {missing || key === null ? '?' : ''}
      </span>
    );

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 24px 36px', minHeight: '100dvh' }}>
        <GameLayout
          gameNumber={GAME_INDEX + 1}
          totalGames={GAME_CYCLE.length}
          categoryLabel={GAME.label}
          categoryColor={dimColor}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
            {/* Color sequence */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 20,
                padding: '28px 18px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                flexWrap: 'wrap',
                boxShadow: '0 2px 12px -4px rgba(12,14,22,0.1)',
              }}
            >
              {item.seq.map((key, i) => (
                <span key={i}>{swatch(key, 44, key === null)}</span>
              ))}
            </div>

            <p
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: 18,
                color: 'var(--ink-2)',
                textAlign: 'center',
              }}
            >
              Která barva pokračuje? 🎨
            </p>
          </div>

          {/* Color options 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingBottom: 8 }}>
            {item.options.map((key, i) => (
              <OptionButton
                key={key}
                state={optionStates[key] ?? 'default'}
                disabled={locked}
                onClick={() => handleColor(key, i)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: SEQUENCE_COLORS[key].hex,
                      border: '2px solid rgba(255,255,255,0.7)',
                      boxShadow: '0 2px 6px -1px rgba(12,14,22,0.2)',
                    }}
                  />
                  {SEQUENCE_COLORS[key].name}
                </span>
              </OptionButton>
            ))}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 8 }}>
            {set.items.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: dimColor,
                  opacity: i <= itemIndex ? 1 : 0.3,
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        </GameLayout>
      </div>
    );
  }

  // ─── Number mode (7+) ───
  const item = set.items[itemIndex];

  function handleNumber(option: number) {
    if (locked) return;
    setLocked(true);
    const correct = option === item.answer;
    setOptionStates({ [option]: correct ? 'correct' : 'wrong' });
    if (!correct) {
      setTimeout(() => {
        setOptionStates({ [option]: 'wrong', [item.answer]: 'correct' });
      }, 300);
    }
    advance(correct, option);
  }

  function formatSeq(seq: (number | null)[]) {
    return seq.map((n, i) => (
      <span key={i} style={{ display: 'inline-flex' }}>
        {i > 0 && (
          <span style={{ color: 'var(--ink-3)', margin: '0 2px', fontSize: '0.65em', alignSelf: 'center' }}>·</span>
        )}
        <span
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: n === null ? 34 : 28,
            color: n === null ? dimColor : 'var(--ink)',
            letterSpacing: '-0.01em',
          }}
        >
          {n === null ? '?' : n}
        </span>
      </span>
    ));
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 24px 36px', minHeight: '100dvh' }}>
      <GameLayout
        gameNumber={GAME_INDEX + 1}
        totalGames={GAME_CYCLE.length}
        categoryLabel={GAME.label}
        categoryColor={dimColor}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 20,
              padding: '24px 20px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              flexWrap: 'wrap',
              boxShadow: '0 2px 12px -4px rgba(12,14,22,0.1)',
            }}
          >
            {formatSeq(item.seq)}
          </div>

          <p
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 17,
              color: 'var(--ink-2)',
              textAlign: 'center',
            }}
          >
            Jaké číslo chybí?
          </p>

          <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
            Vzorec: <span style={{ fontWeight: 600, color: dimColor }}>{item.rule}</span>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingBottom: 8 }}>
          {item.options.map(opt => (
            <OptionButton
              key={opt}
              state={optionStates[opt] ?? 'default'}
              disabled={locked}
              onClick={() => handleNumber(opt)}
            >
              {opt}
            </OptionButton>
          ))}
        </div>

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
