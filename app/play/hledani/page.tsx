'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameLayout from '@/components/GameLayout';
import { AmbientField, Burst } from '@/components/GameFX';
import { GAME_CYCLE, getMemorySet } from '@/lib/core/games';
import { useSession } from '@/lib/session/SessionContext';

const GAME_INDEX = 0; // Paměť — first in play order
const GAME = GAME_CYCLE[GAME_INDEX];

const PAD_COLORS = ['#2563EB', '#F97316', '#10B981', '#EC4899', '#7C3AED', '#F59E0B'];

type Phase = 'watch' | 'input' | 'done';

export default function MemoryPage() {
  const { session, recordAnswer } = useSession();
  const router = useRouter();
  const set = useMemo(() => getMemorySet(session.ageBand), [session.ageBand]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('watch');
  const [activePad, setActivePad] = useState<number | null>(null);
  const [inputIndex, setInputIndex] = useState(0);
  const [wrongPad, setWrongPad] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const actionTimers = useRef<number[]>([]);
  const inputStart = useRef<number>(0);

  const cols = set.pads === 6 ? 3 : 2;

  const startRound = useCallback((idx: number) => {
    const len = set.rounds[idx];
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * set.pads));
    setSequence(seq);
    setInputIndex(0);
    setWrongPad(null);
    setSuccess(false);
    setActivePad(null);
    setPhase('watch');
  }, [set]);

  // Start the first round once the age (set) is known.
  useEffect(() => {
    setRoundIndex(0);
    startRound(0);
    const t = actionTimers.current;
    return () => { t.forEach(clearTimeout); };
  }, [startRound]);

  // Play the "watch" sequence — flash each pad in order, then hand over to input.
  useEffect(() => {
    if (phase !== 'watch' || sequence.length === 0) return;
    const local: number[] = [];
    let i = 0;
    const step = () => {
      if (i >= sequence.length) {
        local.push(window.setTimeout(() => { inputStart.current = Date.now(); setPhase('input'); }, 250));
        return;
      }
      setActivePad(sequence[i]);
      local.push(window.setTimeout(() => {
        setActivePad(null);
        i += 1;
        local.push(window.setTimeout(step, set.gapMs));
      }, set.flashMs));
    };
    local.push(window.setTimeout(step, 700));
    return () => local.forEach(clearTimeout);
  }, [phase, sequence, set.flashMs, set.gapMs]);

  const goNext = useCallback((correct: boolean) => {
    recordAnswer({ gameId: GAME.id, itemIndex: roundIndex, answer: inputIndex, correct, reactionMs: Date.now() - inputStart.current });
    const t = window.setTimeout(() => {
      const next = roundIndex + 1;
      if (next >= set.rounds.length) {
        router.push('/play');
      } else {
        setRoundIndex(next);
        startRound(next);
      }
    }, correct ? 950 : 1150);
    actionTimers.current.push(t);
  }, [recordAnswer, roundIndex, inputIndex, set.rounds.length, router, startRound]);

  const tapPad = useCallback((p: number) => {
    if (phase !== 'input') return;
    setActivePad(p);
    const t = window.setTimeout(() => setActivePad(a => (a === p ? null : a)), 230);
    actionTimers.current.push(t);

    if (p === sequence[inputIndex]) {
      const ni = inputIndex + 1;
      if (ni >= sequence.length) {
        setPhase('done');
        setSuccess(true);
        goNext(true);
      } else {
        setInputIndex(ni);
      }
    } else {
      setPhase('done');
      setWrongPad(p);
      goNext(false);
    }
  }, [phase, sequence, inputIndex, goNext]);

  const padSize = set.pads === 6 ? 92 : 116;

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 24px 36px', minHeight: '100dvh', overflow: 'hidden' }}>
      <AmbientField />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <GameLayout
          gameNumber={GAME_INDEX + 1}
          totalGames={GAME_CYCLE.length}
          categoryLabel={GAME.label}
          categoryColor="#F59E0B"
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
            {/* Phase banner */}
            <div style={{ textAlign: 'center' }}>
              <p
                key={`${phase}-${roundIndex}`}
                className="q-in"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: 'var(--ink)',
                }}
              >
                {phase === 'watch' ? 'Sleduj 👀' : success ? 'Správně! 🎉' : wrongPad !== null ? 'Skoro! 🙈' : 'Zopakuj 🖐️'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
                Kolo {roundIndex + 1} / {set.rounds.length} · zapamatuj si pořadí
              </p>
            </div>

            {/* Pad grid */}
            <div
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, ${padSize}px)`,
                gap: 14,
                padding: 6,
              }}
            >
              {Array.from({ length: set.pads }).map((_, i) => {
                const color = PAD_COLORS[i];
                const isActive = activePad === i;
                const isWrong = wrongPad === i;
                return (
                  <button
                    key={i}
                    onClick={() => tapPad(i)}
                    disabled={phase !== 'input'}
                    aria-label={`pole ${i + 1}`}
                    style={{
                      width: padSize,
                      height: padSize,
                      borderRadius: 20,
                      border: 'none',
                      background: color,
                      cursor: phase === 'input' ? 'pointer' : 'default',
                      opacity: isActive ? 1 : 0.42,
                      transform: isActive ? 'scale(1.07)' : 'scale(1)',
                      boxShadow: isActive
                        ? `0 0 30px 5px ${color}, 0 8px 22px -6px ${color}`
                        : isWrong
                          ? '0 0 0 3px #EF4444'
                          : '0 4px 12px -6px rgba(12,14,22,0.3)',
                      transition: 'transform 0.12s ease, opacity 0.15s ease, box-shadow 0.15s ease',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                    className={isWrong ? 'shake-red' : ''}
                    onPointerDown={e => { if (phase === 'input') (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.94)'; }}
                  />
                );
              })}
              {success && <Burst n={20} />}
            </div>

            {/* Input progress dots */}
            <div style={{ display: 'flex', gap: 6, minHeight: 8 }}>
              {phase !== 'watch' && sequence.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < inputIndex ? '#10B981' : 'var(--line-2)',
                    transition: 'background 0.2s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Round progress */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 8 }}>
            {set.rounds.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#F59E0B',
                  opacity: i <= roundIndex ? 1 : 0.4,
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
