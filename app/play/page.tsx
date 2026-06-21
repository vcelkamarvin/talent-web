'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import GameLayout from '@/components/GameLayout';
import OptionButton from '@/components/OptionButton';
import { GAME_CYCLE, DIMENSION_COLORS } from '@/lib/core/games';
import { useSession } from '@/lib/session/SessionContext';
import type { SequenceItem } from '@/lib/core/types';

const GAME_INDEX = 1; // Posloupnost is second in cycle (index 1), but it's the first we build
const GAME = GAME_CYCLE[GAME_INDEX];
const ITEMS = GAME.items as SequenceItem[];

type OptionState = 'default' | 'correct' | 'wrong';

export default function PlayPage() {
  const [itemIndex, setItemIndex] = useState(0);
  const [optionStates, setOptionStates] = useState<Record<number, OptionState>>({});
  const [locked, setLocked] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const { recordAnswer } = useSession();
  const router = useRouter();

  const currentItem = ITEMS[itemIndex];

  const handleOption = useCallback((option: number) => {
    if (locked) return;
    setLocked(true);

    const reactionMs = Date.now() - startTimeRef.current;
    const correct = option === currentItem.answer;

    setOptionStates({ [option]: correct ? 'correct' : 'wrong' });

    if (!correct) {
      // Brief pause then show correct
      setTimeout(() => {
        setOptionStates({ [option]: 'wrong', [currentItem.answer]: 'correct' });
      }, 300);
    }

    recordAnswer({
      gameId: GAME.id,
      itemIndex,
      answer: option,
      correct,
      reactionMs,
    });

    setTimeout(() => {
      const nextIndex = itemIndex + 1;
      if (nextIndex >= ITEMS.length) {
        router.push('/result');
      } else {
        setItemIndex(nextIndex);
        setOptionStates({});
        setLocked(false);
        startTimeRef.current = Date.now();
      }
    }, 900);
  }, [locked, currentItem, itemIndex, recordAnswer, router]);

  const dimColor = DIMENSION_COLORS[GAME.dimension];

  // Format sequence for display: replace null with "?"
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
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '52px 24px 36px',
        minHeight: '100dvh',
      }}
    >
      <GameLayout
        gameNumber={GAME_INDEX + 1}
        totalGames={GAME_CYCLE.length}
        categoryLabel={GAME.label}
        categoryColor={dimColor}
      >
        {/* Sequence display */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {/* Sequence numbers */}
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
            {formatSeq(currentItem.seq)}
          </div>

          {/* Question */}
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

          {/* Rule hint */}
          <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
            Vzorec: <span style={{ fontWeight: 600, color: dimColor }}>{currentItem.rule}</span>
          </p>
        </div>

        {/* Options grid 2×2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            paddingBottom: 8,
          }}
        >
          {currentItem.options.map(opt => (
            <OptionButton
              key={opt}
              state={optionStates[opt] ?? 'default'}
              disabled={locked}
              onClick={() => handleOption(opt)}
            >
              {opt}
            </OptionButton>
          ))}
        </div>

        {/* Item progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 8 }}>
          {ITEMS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i < itemIndex ? dimColor : i === itemIndex ? dimColor : 'var(--line)',
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
