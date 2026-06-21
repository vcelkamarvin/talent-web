'use client';

import Link from 'next/link';
import Orb from '@/components/Orb';
import TopBar from '@/components/TopBar';
import Spectrum from '@/components/Spectrum';
import PrimaryButton from '@/components/PrimaryButton';
import { useSession } from '@/lib/session/SessionContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StartPage() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.ageBand && session.gender) {
      router.replace('/home');
    }
  }, [session, router]);

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
      <TopBar />

      {/* Hero text */}
      <div style={{ marginTop: 40 }}>
        <h1
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 42,
            lineHeight: 1.02,
            letterSpacing: '-0.025em',
            color: 'var(--ink)',
          }}
        >
          Zjisti svůj<br />talent.
        </h1>
        <p
          style={{
            marginTop: 12,
            fontSize: 15,
            color: 'var(--ink-3)',
            fontWeight: 450,
          }}
        >
          Objevíš svých 7 talentů za 8–12 minut.
        </p>
      </div>

      {/* Orb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Orb size={220} />
      </div>

      {/* Bottom CTA */}
      <div>
        <Link href="/login" style={{ display: 'block', textDecoration: 'none' }}>
          <PrimaryButton>
            Začít <span style={{ fontSize: 17 }}>→</span>
          </PrimaryButton>
        </Link>
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
      </div>
    </div>
  );
}
