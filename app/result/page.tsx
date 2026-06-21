'use client';

import Link from 'next/link';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import Spectrum from '@/components/Spectrum';
import { useSession } from '@/lib/session/SessionContext';

const DIMENSIONS = [
  { key: 'd1', label: 'Logika',        color: 'var(--d1)', value: 72 },
  { key: 'd2', label: 'Prostorová',    color: 'var(--d2)', value: 58 },
  { key: 'd3', label: 'Kinestetická',  color: 'var(--d3)', value: 85 },
  { key: 'd4', label: 'Hudební',       color: 'var(--d4)', value: 44 },
  { key: 'd5', label: 'Vizuální',      color: 'var(--d5)', value: 63 },
  { key: 'd6', label: 'Jazyková',      color: 'var(--d6)', value: 79 },
  { key: 'd7', label: 'Sociální',      color: 'var(--d7)', value: 67 },
];

export default function ResultPage() {
  const { session, resetSession } = useSession();
  const answersCount = session.answers.length;

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
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Spectrum width={40} />
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Tvůj profil
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
          }}
        >
          {answersCount > 0 ? 'Výborně! 🎉' : 'Brzy zde'}
        </h1>
        <p style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-3)' }}>
          {answersCount > 0
            ? `Zodpověděl/a jsi ${answersCount} otázek. Radar přijde po všech 15 hrách.`
            : 'Dokonči všechny hry a uvidíš svůj radarový profil 7 dimenzí.'}
        </p>
      </div>

      {/* Radar placeholder */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 24,
          padding: '28px 20px',
          marginBottom: 20,
          boxShadow: '0 2px 20px -8px rgba(12,14,22,0.12)',
        }}
      >
        <p
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--ink-3)',
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          Ukázková data — spusť všechny hry
        </p>

        {/* Dimension bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DIMENSIONS.map(dim => (
            <div key={dim.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: 'var(--ink-2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: dim.color,
                      display: 'inline-block',
                    }}
                  />
                  {dim.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: dim.color,
                  }}
                >
                  {dim.value}
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${dim.value}%`,
                    background: dim.color,
                    borderRadius: 99,
                    transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 16,
            fontSize: 11,
            color: 'var(--ink-3)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Výsledky jsou orientační, ne diagnóza.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/onboarding" style={{ textDecoration: 'none' }}>
          <PrimaryButton>
            Spustit celý test →
          </PrimaryButton>
        </Link>
        <SecondaryButton onClick={() => resetSession()}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            Začít znovu
          </Link>
        </SecondaryButton>
      </div>
    </div>
  );
}
