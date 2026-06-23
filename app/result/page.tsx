'use client';

import Link from 'next/link';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import Spectrum from '@/components/Spectrum';
import { useSession } from '@/lib/session/SessionContext';
import { GAME_CYCLE } from '@/lib/core/games';

const BUILT_GAMES = 3; // Hledání, Posloupnost, Rotace 3D

export default function ResultPage() {
  const { session, resetSession } = useSession();
  const answersCount = session.answers.length;
  const totalGames = GAME_CYCLE.length;

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
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Spectrum width={40} />
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Prototyp
          </span>
        </div>
        <h1
          className="fade-up"
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
          }}
        >
          Hezky! 🎉
        </h1>
        <p className="fade-up" style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-3)', animationDelay: '0.06s' }}>
          {answersCount > 0
            ? `Zahrál/a sis ${BUILT_GAMES} z ${totalGames} her. Zbylé hry teprve stavíme.`
            : 'Spusť hry a vyzkoušej prototyp.'}
        </p>
      </div>

      {/* Work-in-progress card (radar profil přijde, až budou hotové všechny hry) */}
      <div
        className="fade-up"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 24,
          padding: '32px 22px',
          marginBottom: 20,
          textAlign: 'center',
          boxShadow: '0 2px 20px -8px rgba(12,14,22,0.12)',
          animationDelay: '0.12s',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🛠️</div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--ink)',
            marginBottom: 8,
          }}
        >
          Radarový profil se připravuje
        </h2>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-2)' }}>
          Hotové jsou zatím <strong>{BUILT_GAMES} z {totalGames}</strong> her. Až bude celá sada,
          uvidíš tady svůj profil 7 dimenzí talentu.
        </p>

        {/* Mini progress */}
        <div style={{ height: 6, background: 'var(--line)', borderRadius: 99, overflow: 'hidden', marginTop: 18 }}>
          <div
            style={{
              height: '100%',
              width: `${Math.round((BUILT_GAMES / totalGames) * 100)}%`,
              background: 'linear-gradient(90deg, var(--d1), var(--d2))',
              borderRadius: 99,
            }}
          />
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8 }}>
          {BUILT_GAMES} / {totalGames} her hotovo
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
        <Link href="/play/hledani" style={{ textDecoration: 'none' }}>
          <PrimaryButton>
            Hrát znovu →
          </PrimaryButton>
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }} onClick={() => resetSession()}>
          <SecondaryButton>Zpět na úvod</SecondaryButton>
        </Link>
      </div>
    </div>
  );
}
