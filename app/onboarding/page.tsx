'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/PrimaryButton';
import { useSession } from '@/lib/session/SessionContext';
import type { AgeBand, Gender } from '@/lib/core/types';

const AGE_BANDS: { value: AgeBand; label: string; sub: string; emoji: string }[] = [
  { value: '4-6',   label: '4–6 let',   sub: 'Předškolní',    emoji: '🌱' },
  { value: '7-10',  label: '7–10 let',  sub: 'Mladší školní', emoji: '⚡' },
  { value: '11-15', label: '11–15 let', sub: 'Starší školní', emoji: '🚀' },
];

const GENDERS: { value: Gender; label: string; emoji: string }[] = [
  { value: 'kluk',   label: 'Kluk',  emoji: '🙋‍♂️' },
  { value: 'holka',  label: 'Holka', emoji: '🙋‍♀️' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const { setAgeBand: saveAgeBand, setGender: saveGender } = useSession();
  const router = useRouter();

  function handleNext() {
    if (step === 1 && ageBand) {
      setStep(2);
    }
  }

  function handleStart() {
    if (ageBand && gender) {
      saveAgeBand(ageBand);
      saveGender(gender);
      router.push('/play');
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 24px 36px',
        minHeight: '100dvh',
      }}
    >
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 36 }}>
        {[1, 2].map(n => (
          <div
            key={n}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 99,
              background: step >= n ? 'var(--ink)' : 'var(--line)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <h2
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              marginBottom: 8,
            }}
          >
            Kolik ti je let?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 24 }}>
            Přizpůsobíme hry tvému věku.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {AGE_BANDS.map(band => (
              <button
                key={band.value}
                onClick={() => setAgeBand(band.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '18px 20px',
                  borderRadius: 18,
                  border: `2px solid ${ageBand === band.value ? 'var(--ink)' : 'var(--line-2)'}`,
                  background: ageBand === band.value ? 'var(--ink)' : 'var(--surface)',
                  color: ageBand === band.value ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 28 }}>{band.emoji}</span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {band.label}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      opacity: ageBand === band.value ? 0.7 : 1,
                      color: ageBand === band.value ? '#fff' : 'var(--ink-3)',
                      marginTop: 2,
                    }}
                  >
                    {band.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <PrimaryButton disabled={!ageBand} onClick={handleNext}>
              Dál →
            </PrimaryButton>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              marginBottom: 8,
            }}
          >
            Jsi…
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 24 }}>
            Slouží jen ke srovnání s vrstevníky.
          </p>

          <div style={{ display: 'flex', gap: 12, flex: 1 }}>
            {GENDERS.map(g => (
              <button
                key={g.value}
                onClick={() => setGender(g.value)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  padding: '24px 16px',
                  borderRadius: 20,
                  border: `2px solid ${gender === g.value ? 'var(--ink)' : 'var(--line-2)'}`,
                  background: gender === g.value ? 'var(--ink)' : 'var(--surface)',
                  color: gender === g.value ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  maxHeight: 200,
                }}
              >
                <span style={{ fontSize: 40 }}>{g.emoji}</span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {g.label}
                </span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PrimaryButton disabled={!gender} onClick={handleStart}>
              Začít hru 🎯
            </PrimaryButton>
            <button
              onClick={() => setStep(1)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ink-3)',
                fontSize: 14,
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              ← Zpět
            </button>
          </div>
        </>
      )}
    </div>
  );
}
