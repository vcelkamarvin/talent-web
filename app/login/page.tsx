'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useSession } from '@/lib/session/SessionContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { setGuest } = useSession();

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire Supabase auth here
    setGuest(false);
    router.push('/home');
  }

  function handleGuest() {
    setGuest(true);
    router.push('/home');
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 24px 40px',
        minHeight: '100dvh',
      }}
    >
      {/* Title */}
      <div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
          }}
        >
          Vítej 👋
        </h1>
        <p style={{ marginTop: 8, fontSize: 15, color: 'var(--ink-3)' }}>
          Přihlas se nebo pokračuj jako host.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleContinue} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Tvůj e-mail"
          autoComplete="email"
          style={{
            height: 52,
            borderRadius: 14,
            border: '1.5px solid var(--line-2)',
            background: 'var(--surface)',
            padding: '0 16px',
            fontSize: 15.5,
            color: 'var(--ink)',
            fontFamily: "'Inter', system-ui, sans-serif",
            outline: 'none',
            transition: 'border-color 0.15s',
            width: '100%',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--d1)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--line-2)')}
        />
        <PrimaryButton type="submit" disabled={email.length < 4}>
          Pokračovat
        </PrimaryButton>
      </form>

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '20px 0',
          color: 'var(--ink-3)',
          fontSize: 13,
        }}
      >
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        nebo
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SecondaryButton onClick={handleGuest}>
          Pokračovat jako host
        </SecondaryButton>

        {/* Social placeholders */}
        <SecondaryButton disabled style={{ opacity: 0.35 }}>
          <AppleIcon />
          Přihlásit přes Apple
        </SecondaryButton>
        <SecondaryButton disabled style={{ opacity: 0.35 }}>
          <GoogleIcon />
          Přihlásit přes Google
        </SecondaryButton>
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: 'auto',
          paddingTop: 32,
          textAlign: 'center',
          fontSize: 11.5,
          color: 'var(--ink-3)',
          lineHeight: 1.5,
        }}
      >
        Pokračováním souhlasíš s podmínkami použití.<br />
        Data dětí chráníme v souladu s GDPR.
      </p>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.182 0c.227 1.29-.337 2.58-1.156 3.43-.82.85-2.068 1.47-3.116 1.41-.227-1.29.337-2.58 1.156-3.43C8.886.56 10.134-.06 11.182 0zM14 11.56c-.48.95-1.02 1.9-1.8 2.63-.6.57-1.26.75-1.96.75-.68 0-1.18-.18-1.7-.38-.52-.2-1.04-.4-1.76-.4-.74 0-1.28.2-1.8.4-.52.2-1.02.38-1.7.38-.72 0-1.4-.2-2-.75-.82-.76-1.5-1.86-2-3.06C.04 9.76 0 8.46 0 7.2c0-2.77 1.44-4.22 2.87-4.22.72 0 1.36.24 1.86.45.5.2.96.41 1.47.41.48 0 .96-.2 1.5-.42.54-.2 1.14-.44 1.86-.44 1.06 0 2.1.54 2.87 1.47A3.89 3.89 0 0 0 11 7.6c0 2.14 1.34 3.1 2 3.1.16 0 .7 0 1-.13L14 11.56z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.68 3.68 0 0 1-1.6 2.42v2h2.58c1.52-1.4 2.4-3.45 2.4-5.88z" fill="#4285F4"/>
      <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.14-2.52H.96v2.06A8 8 0 0 0 8 16z" fill="#34A853"/>
      <path d="M3.56 9.54A4.8 4.8 0 0 1 3.3 8c0-.53.1-1.05.26-1.54V4.4H.96A8 8 0 0 0 0 8c0 1.29.31 2.51.96 3.6l2.6-2.06z" fill="#FBBC05"/>
      <path d="M8 3.18c1.22 0 2.3.42 3.16 1.24l2.38-2.38C12 .8 10.18 0 8 0A8 8 0 0 0 .96 4.4L3.56 6.46A4.77 4.77 0 0 1 8 3.18z" fill="#EA4335"/>
    </svg>
  );
}
