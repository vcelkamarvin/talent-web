'use client';

import Link from 'next/link';
import Orb from '@/components/Orb';
import TopBar, { Avatar } from '@/components/TopBar';
import Spectrum from '@/components/Spectrum';
import PrimaryButton from '@/components/PrimaryButton';
import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '52px 24px 32px',
        minHeight: '100dvh',
      }}
    >
      <TopBar right={<Avatar initials="AJ" />} />

      {/* Greeting + headline */}
      <div style={{ marginTop: 30 }}>
        <p style={{ fontSize: 15, color: 'var(--ink-2)', fontWeight: 500 }}>Ahoj!</p>
        <h1
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 33,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            marginTop: 4,
          }}
        >
          Zjisti svůj<br />talent.
        </h1>
        <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--ink-3)', fontWeight: 450 }}>
          15 krátkých her · 8–12 minut
        </p>
      </div>

      {/* Orb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
        <Orb size={200} />
      </div>

      {/* Empty state card */}
      <Card style={{ marginBottom: 16 }}>
        <p
          style={{
            fontSize: 13.5,
            color: 'var(--ink-3)',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Zatím žádný profil — spusť první test
        </p>
      </Card>

      {/* CTA */}
      <Link href="/onboarding" style={{ display: 'block', textDecoration: 'none' }}>
        <PrimaryButton>
          Spustit test <span style={{ fontSize: 17 }}>→</span>
        </PrimaryButton>
      </Link>

      {/* Spectrum */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 14,
          fontSize: 12,
          color: 'var(--ink-3)',
          fontWeight: 500,
        }}
      >
        <Spectrum width={64} />
        7 dimenzí talentu
      </div>

      {/* Changelog link */}
      <Link
        href="/hotovo"
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: 12,
          fontSize: 12,
          color: 'var(--ink-3)',
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        ✅ Hotové úkoly
      </Link>
    </div>
  );
}
