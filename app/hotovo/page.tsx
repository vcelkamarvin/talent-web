'use client';

import Link from 'next/link';
import SecondaryButton from '@/components/SecondaryButton';

const AGE_ROWS: { band: string; sub: string; game: string; emoji: string }[] = [
  { band: '4–6 let',   sub: 'Předškoláci',          game: 'Barevné vzory (bez čísel)', emoji: '🌱' },
  { band: '7–10 let',  sub: 'Mladší školáci',       game: 'Lehké řady · +1, +2, +5',   emoji: '⚡' },
  { band: '11–15 let', sub: 'Starší školáci',       game: 'Střední řady · ×2, ×2+1, Fibonacci', emoji: '🚀' },
  { band: '15+ let',   sub: 'Teenageři a dospělí',  game: 'Těžké řady · mocniny, prvočísla, faktoriál', emoji: '🔥' },
];

const AGE_ROWS_ROTACE: { band: string; sub: string; game: string; emoji: string }[] = [
  { band: '4–6 let',   sub: 'Předškoláci',          game: '1 prsten · krok 90°', emoji: '🌱' },
  { band: '7–10 let',  sub: 'Mladší školáci',       game: '2 prsteny · krok 90°', emoji: '⚡' },
  { band: '11–15 let', sub: 'Starší školáci',       game: '3 prsteny · krok 60°', emoji: '🚀' },
  { band: '15+ let',   sub: 'Teenageři a dospělí',  game: '3 prsteny · krok 45° (8 pozic)', emoji: '🔥' },
];

const AGE_ROWS_ODHAD: { band: string; sub: string; game: string; emoji: string }[] = [
  { band: '4–6 let',   sub: 'Předškoláci',          game: 'Málo teček (3–6), trvale', emoji: '🌱' },
  { band: '7–10 let',  sub: 'Mladší školáci',       game: '~9–16 · blik 1,6 s', emoji: '⚡' },
  { band: '11–15 let', sub: 'Starší školáci',       game: '~24–41 · blik 0,9 s', emoji: '🚀' },
  { band: '15+ let',   sub: 'Teenageři a dospělí',  game: '~52–78 · blik 0,55 s · možnosti těsně', emoji: '🔥' },
];

const AGE_ROWS_HLEDANI: { band: string; sub: string; game: string; emoji: string }[] = [
  { band: '4–6 let',   sub: 'Předškoláci',          game: '4 pole · krátké pomalé sekvence (2–3)', emoji: '🌱' },
  { band: '7–10 let',  sub: 'Mladší školáci',       game: '4 pole · delší sekvence (3–4)', emoji: '⚡' },
  { band: '11–15 let', sub: 'Starší školáci',       game: '6 polí · rychlejší (4–5)', emoji: '🚀' },
  { band: '15+ let',   sub: 'Teenageři a dospělí',  game: '6 polí · dlouhé a rychlé (5–7)', emoji: '🔥' },
];

const DONE: { title: string; body: string }[] = [
  {
    title: '1 · Věkové kategorie',
    body:
      'Přidali jsme čtvrté pásmo 15+ (teenageři a dospělí) k původním třem (4–6, 7–10, 11–15) a u každého ' +
      'doplnili krátký popis, co dítě v testu čeká. Výběr věku v onboardingu teď rovnou napoví obtížnost.',
  },
  {
    title: '2 · První hra je adaptivní podle věku',
    body:
      'Hra „Posloupnost" už není pro všechny stejná. Podle zvoleného věku se načte jiná sada úloh — od ' +
      'barevných vzorů pro nejmenší až po mocniny a faktoriál pro 15+. Logika hry zůstává stejná, mění se ' +
      'jen náročnost a forma zadání.',
  },
  {
    title: '3 · Nejmenší řeší barvy místo čísel',
    body:
      'Pro pásmo 4–6 jsme čísla nahradili barevnými kolečky. Dítě jen pozná, která barva ve vzoru ' +
      '(např. červená–modrá–červená–modrá–?) pokračuje. Žádné počítání, vše vizuálně a hravě.',
  },
  {
    title: '4 · Druhá hra: Zámek (prostorová)',
    body:
      'Interaktivní zámek ve stylu Hogwarts Legacy: otáčíš soustředné zářící prsteny tak, aby všechny ' +
      'gemy mířily nahoru ke značce, a tím zámek odemkneš. Trénuje prostorovou představivost a plánování.',
  },
  {
    title: '5 · Zámek je adaptivní podle věku',
    body:
      'Náročnost roste s věkem: 4–6 mají 1 prsten s krokem 90° (4 pozice), 15+ tři prsteny s krokem 45° ' +
      '(8 pozic), takže je potřeba mnohem víc otáčení a plánování. Každé kolo je nový zámek.',
  },
  {
    title: '6 · Třetí hra: Paměť (Simon)',
    body:
      'Paměťová hra ve stylu Simona: rozsvítí se sekvence barevných polí a úkolem je zopakovat ji ve ' +
      'správném pořadí. Trénuje pracovní paměť a soustředění — opravdová, návyková herní mechanika.',
  },
  {
    title: '7 · Paměť adaptivní + správné pořadí her',
    body:
      'Náročnost roste s věkem: 4–6 mají 4 pole a krátké pomalé sekvence (2–3), 15+ šest polí a dlouhé ' +
      'rychlé sekvence (5–7). Každé kolo je delší. Hry jdou v pořadí: ' +
      'Paměť → Posloupnost → Zámek → Odhad počtu.',
  },
  {
    title: '8 · Čtvrtá hra: Odhad počtu (logika)',
    body:
      'Krátce blikne pole teček a úkolem je odhadnout, kolik jich bylo — bez počítání po jednom. ' +
      'Trénuje numerický cit (subitizing). Obtížnost roste s věkem: 4–6 počítají málo teček v klidu, ' +
      '15+ odhadují 52–78 teček po pouhé půlsekundě a možnosti jsou těsně u sebe.',
  },
];

export default function HotovoPage() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '56px 24px 36px',
        minHeight: '100dvh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            fontSize: 12,
            color: 'var(--ink-3)',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Changelog
        </span>
        <h1
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            marginTop: 4,
          }}
        >
          Hotové úkoly ✅
        </h1>
        <p style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-3)' }}>
          Co jsme vyřešili a jak to teď funguje.
        </p>
      </div>

      {/* Completed task cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {DONE.map(d => (
          <div
            key={d.title}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              padding: '16px 18px',
              boxShadow: '0 2px 12px -6px rgba(12,14,22,0.12)',
            }}
          >
            <h2
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 15.5,
                color: 'var(--ink)',
                marginBottom: 6,
              }}
            >
              {d.title}
            </h2>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>{d.body}</p>
          </div>
        ))}
      </div>

      {/* Age distribution table */}
      <h2
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--ink)',
          marginBottom: 10,
        }}
      >
        Věkové rozložení · 1. hra (Posloupnost)
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: 12,
          marginBottom: 28,
        }}
      >
        {AGE_ROWS.map(r => (
          <div
            key={r.band}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 6px',
            }}
          >
            <span style={{ fontSize: 22 }}>{r.emoji}</span>
            <div style={{ minWidth: 88 }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--ink)',
                }}
              >
                {r.band}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.sub}</div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500, flex: 1, textAlign: 'right' }}>
              {r.game}
            </div>
          </div>
        ))}
      </div>

      <h2
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--ink)',
          marginBottom: 10,
        }}
      >
        Věkové rozložení · 2. hra (Zámek)
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: 12,
          marginBottom: 28,
        }}
      >
        {AGE_ROWS_ROTACE.map(r => (
          <div
            key={r.band}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 6px',
            }}
          >
            <span style={{ fontSize: 22 }}>{r.emoji}</span>
            <div style={{ minWidth: 88 }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--ink)',
                }}
              >
                {r.band}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.sub}</div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500, flex: 1, textAlign: 'right' }}>
              {r.game}
            </div>
          </div>
        ))}
      </div>

      <h2
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--ink)',
          marginBottom: 10,
        }}
      >
        Věkové rozložení · 3. hra (Paměť)
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: 12,
          marginBottom: 28,
        }}
      >
        {AGE_ROWS_HLEDANI.map(r => (
          <div
            key={r.band}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 6px',
            }}
          >
            <span style={{ fontSize: 22 }}>{r.emoji}</span>
            <div style={{ minWidth: 88 }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--ink)',
                }}
              >
                {r.band}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.sub}</div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500, flex: 1, textAlign: 'right' }}>
              {r.game}
            </div>
          </div>
        ))}
      </div>

      <h2
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--ink)',
          marginBottom: 10,
        }}
      >
        Věkové rozložení · 4. hra (Odhad počtu)
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 18,
          padding: 12,
          marginBottom: 28,
        }}
      >
        {AGE_ROWS_ODHAD.map(r => (
          <div
            key={r.band}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 6px' }}
          >
            <span style={{ fontSize: 22 }}>{r.emoji}</span>
            <div style={{ minWidth: 88 }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--ink)',
                }}
              >
                {r.band}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.sub}</div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500, flex: 1, textAlign: 'right' }}>
              {r.game}
            </div>
          </div>
        ))}
      </div>

      <Link href="/" style={{ textDecoration: 'none', marginTop: 'auto' }}>
        <SecondaryButton>← Zpět na úvod</SecondaryButton>
      </Link>
    </div>
  );
}
