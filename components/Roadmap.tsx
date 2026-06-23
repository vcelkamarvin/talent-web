'use client';

import { useState } from 'react';

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const DONE_ITEMS = [
  'Design systém + tokeny (barvy, typo, spacing, komponenty)',
  'App shell — iOS phone frame, mesh gradient, responzivita',
  'Prémiový Orb — float, cursor tilt, rotující lesk, pulzující kruhy',
  'Start screen (Orb, tagline, CTA)',
  'Přihlášení — e-mail + "Pokračovat jako host"',
  'Domovská obrazovka (Home)',
  'Onboarding — věk (4–6 / 7–10 / 11–15 / 15+) + pohlaví, animovaný vstup',
  'Hry 1–4: Paměť, Posloupnost, Zámek, Odhad počtu — adaptivní dle věku, herní efekty',
  'Výsledková obrazovka — stav prototypu (radar přijde po všech hrách)',
  'Showcase rámeček + klientská roadmapa (tento seznam)',
  'Deploy na Vercel — živý link pro klienta',
];

interface GameItem {
  label: string; dim: string; color: string; note?: string;
  built?: boolean;     // hra už je hotová a hratelná
  goal: string;        // co hráč dělá (cíl)
  measures: string;    // co to měří (dovednost / dimenze)
  distinction: string; // jak je odlišena „odlišnost" + jak roste obtížnost s věkem
  variants?: { age: string; detail: string }[]; // co dostane každá věková kategorie
}

const GAMES_REMAINING: GameItem[] = [
  {
    label: 'Paměť', dim: 'Vizuální', color: '#F59E0B', built: true,
    goal: 'Rozsvítí se sekvence barevných polí — zapamatuj si pořadí a zopakuj ho ťukáním (jako hra Simon).',
    measures: 'Pracovní (krátkodobou) paměť a soustředění.',
    distinction: 'Obtížnost = délka sekvence + počet polí + rychlost blikání. Každé kolo je delší.',
    variants: [
      { age: '4–6', detail: '4 pole · krátké pomalé sekvence (2–3)' },
      { age: '7–10', detail: '4 pole · delší sekvence (3–4)' },
      { age: '11–15', detail: '6 polí · rychlejší (4–5)' },
      { age: '15+', detail: '6 polí · dlouhé a rychlé (5–7)' },
    ],
  },
  {
    label: 'Posloupnost', dim: 'Logika', color: '#2563EB', built: true,
    goal: 'Doplnit, co ve vzoru / řadě chybí.',
    measures: 'Logické a numerické uvažování, rozpoznání vzoru.',
    distinction: 'Nejmenší řeší barevné vzory bez čísel, starší číselné řady. Obtížnost roste s typem pravidla.',
    variants: [
      { age: '4–6', detail: 'Barevné vzory bez čísel — 🔴🔵🔴🔵 ?' },
      { age: '7–10', detail: 'Lehké řady — +1, +2, +5' },
      { age: '11–15', detail: 'Střední řady — ×2, ×2+1, Fibonacci' },
      { age: '15+', detail: 'Těžké řady — mocniny, prvočísla, faktoriál' },
    ],
  },
  {
    label: 'Zámek', dim: 'Prostorová', color: '#7C3AED', built: true,
    goal: 'Otáčet soustředné prsteny tak, aby všechny gemy mířily nahoru ke značce — a odemknout zámek (styl Hogwarts Legacy).',
    measures: 'Prostorovou představivost, plánování otáčení a trpělivost.',
    distinction: 'Obtížnost = počet prstenů + jemnost kroku (víc pozic = víc otáčení). Každé kolo nový zámek.',
    variants: [
      { age: '4–6', detail: '1 prsten · krok 90° (4 pozice)' },
      { age: '7–10', detail: '2 prsteny · krok 90°' },
      { age: '11–15', detail: '3 prsteny · krok 60° (6 pozic)' },
      { age: '15+', detail: '3 prsteny · krok 45° (8 pozic)' },
    ],
  },
  {
    label: 'Rovnováha', dim: 'Kinestetická', color: '#F97316', note: '⭐ gyroskop',
    goal: 'Naklánět zařízení a udržet objekt v rovnováze podle pokynů.',
    measures: 'Rovnováhu a jemnou motoriku přes gyroskop telefonu.',
    distinction: 'Skóre podle stability — odchylky od cíle. Obtížnost = citlivost a délka úkolu.',
  },
  {
    label: 'Analogie', dim: 'Jazyková', color: '#10B981',
    goal: 'Doplnit dvojici „A je k B jako C je k ?".',
    measures: 'Jazykové a logické usuzování, slovní zásobu.',
    distinction: 'Jediná možnost má stejný vztah jako vzorová dvojice, ostatní jsou blízké, ale chybné.',
  },
  {
    label: 'Výška tónu', dim: 'Hudební', color: '#EC4899', note: '⭐ audio',
    goal: 'Rozpoznat, který ze dvou tónů je vyšší (nebo nižší).',
    measures: 'Sluchové vnímání výšky tónu.',
    distinction: 'Porovnání dvou tónů. Obtížnost = menší rozdíl frekvencí pro starší.',
  },
  {
    label: 'Odhad počtu', dim: 'Logika', color: '#2563EB', built: true,
    goal: 'Krátce blikne pole teček — odhadni, kolik jich bylo (bez počítání po jednom).',
    measures: 'Numerický cit (subitizing) a rychlý odhad.',
    distinction: 'Obtížnost = počet teček + kratší blik + bližší možnosti.',
    variants: [
      { age: '4–6', detail: 'Málo teček (3–6), trvale — klidné počítání' },
      { age: '7–10', detail: '~9–16 teček · blik 1,6 s' },
      { age: '11–15', detail: '~24–41 teček · blik 0,9 s · možnosti blíž' },
      { age: '15+', detail: '~52–78 teček · blik 0,55 s · možnosti těsně' },
    ],
  },
  {
    label: 'Kliky', dim: 'Kinestetická', color: '#F97316', note: '⭐ kamera',
    goal: 'Udělat co nejvíc správně provedených kliků za čas.',
    measures: 'Fyzickou zdatnost — kamera počítá opakování (MediaPipe).',
    distinction: 'Skóre podle počtu a kvality pohybů. Senzorová hra má ve scoringu váhu ×3.',
  },
  {
    label: 'Estetika', dim: 'Vizuální', color: '#F59E0B',
    goal: 'Vybrat harmoničtější / lépe vyváženou kompozici.',
    measures: 'Vizuální cit a smysl pro kompozici.',
    distinction: 'Dvě varianty, jedna je vyváženější podle pravidel kompozice (poměr, symetrie).',
  },
  {
    label: 'Matice', dim: 'Logika', color: '#2563EB',
    goal: 'Doplnit chybějící prvek v matici vzorů (typ Ravenovy matice).',
    measures: 'Abstraktní logiku a rozpoznání pravidla.',
    distinction: 'Jen jedna možnost pokračuje pravidlo řádku i sloupce zároveň.',
  },
  {
    label: 'Rytmus', dim: 'Hudební', color: '#EC4899', note: '⭐ timing',
    goal: 'Zopakovat přehraný rytmus ťukáním do obrazovky.',
    measures: 'Časovou přesnost a smysl pro rytmus.',
    distinction: 'Skóre podle odchylky v milisekundách od vzoru. Obtížnost = složitější rytmus.',
  },
  {
    label: 'Logická mapa', dim: 'Prostorová', color: '#7C3AED',
    goal: 'Najít správnou cestu nebo se zorientovat v plánku.',
    measures: 'Prostorovou orientaci a plánování.',
    distinction: 'Jen jedna cesta splňuje všechny podmínky. Obtížnost = větší mapa a víc překážek.',
  },
  {
    label: 'Pravda / lež', dim: 'Jazyková', color: '#10B981',
    goal: 'Rozhodnout, zda tvrzení platí, nebo ne.',
    measures: 'Porozumění textu a kritické myšlení.',
    distinction: 'Pravdivá vs zavádějící tvrzení. Obtížnost = jemnější nuance ve formulaci.',
  },
  {
    label: 'Pocity', dim: 'Sociální', color: '#EF4444',
    goal: 'Přiřadit emoci k situaci nebo k obličejovému výrazu.',
    measures: 'Sociální a emoční vnímání.',
    distinction: 'Jediná možnost odpovídá kontextu situace, ostatní jsou emočně mimo.',
  },
  {
    label: 'Spolu', dim: 'Sociální', color: '#EF4444',
    goal: 'Vybrat vhodnou reakci ve společné / týmové situaci.',
    measures: 'Spolupráci, empatii a sociální úsudek.',
    distinction: 'Nejvíc prosociální (vstřícná) volba je správná, ostatní jsou sobecké nebo konfliktní.',
  },
];

const CORE_FEATURES = [
  'Animovaný radarový profil 7 dimenzí (spider chart, reveal animace)',
  'Percentily + Top 3 talenty s popisem',
  'Mezi-hra přechod — kategorie, mikrofeedback, loading',
  'Adaptivní obtížnost dle věku (3 pásma — 4–6 / 7–10 / 11–15)',
  'Herní čas a progress tracking (přerušení, návrat)',
  'Session management — pokračování po zavření prohlížeče',
  'Sdílení výsledků — odkaz + obrázek pro rodiče',
  'Loading states + skeleton screens',
  'Error states + retry flow (offline / síťové chyby)',
  'Onboarding pro nečtenáře (4–6 let) — větší ikony, audio pokyny',
  'Disclaimer "orientační, ne diagnóza" na všech výsledcích',
];

const DESIGN_POLISH = [
  'Přechody mezi obrazovkami (page transitions, smooth routing)',
  'Haptic feedback na správné / špatné odpovědi (mobilní)',
  'Dark mode (system preference)',
  'Lokalizace — anglická verze (EN ready, string extraction)',
  'Accessibility audit — WCAG 2.1 AA (kontrast, focus states)',
  'Dyslexie-friendly volba písma (alternativní font)',
  'Reduced motion — respektování prefers-reduced-motion',
  'Safe area padding (notch, home bar, různá zařízení)',
  'Splash screen + app ikona',
];

const IPAD = [
  'iPad landscape layout — split-view (orb vlevo, text vpravo)',
  'Přizpůsobené herní layouty pro velký displej (10.9" / 12.9")',
  'Větší tap targety a font scaling pro tablet',
  'Kiosk mód — full-screen bez statusbaru (pro výstavu)',
  'Apple Pencil podpora (Estetika, Kreslení)',
  'iPad multitasking — Split Screen, Slide Over',
  'Klávesnicová navigace (Bluetooth keyboard)',
  'Optimalizace pro iPad Pro 12.9" (velký radar, víc obsahu)',
];

const ANDROID = [
  'Android Expo build — APK / AAB testování',
  'Android back-button handling (back stack)',
  'Android permission flow — kamera, mikrofon, pohyb',
  'Android gyroscope API — kompatibilita různých výrobců',
  'Material Design adaptace drobností (ripple, ink)',
  'Firebase Cloud Messaging (push notifikace)',
  'Android kiosk mód (pinned app mode pro výstavu)',
  'Testování na zařízeních — Samsung, Pixel, Xiaomi',
  'Google Play Store příprava — screenshots, PEGI rating',
  'Google Play Store vydání — review, optimalizace',
];

const BACKEND_DATA = [
  'Supabase auth — e-mail, Apple Sign In, Google Sign In',
  'Databáze výsledků (RLS, Row Level Security, GDPR)',
  'Rodičovský profil — web dashboard s výsledky',
  'E-mail výsledků — přehledná zpráva rodiči (Resend)',
  'Učitelský dashboard — třídní report, rozložení talentů',
  'Správa dat — export, smazání účtu, GDPR souhlas',
  'Percentil engine — normalizace po věku a pohlaví',
  'Cold-start normy — předdefinované hodnoty do 30 k dětí',
  'Porovnání s vrstevníky (živé percentily po 30 k+ dětech)',
];

const SENSORS = [
  'Kliky — kamera (MediaPipe Pose Detection, počítání kliků)',
  'Rovnováha — gyroskop (DeviceMotionEvent, stabilita)',
  'Výška tónu — mikrofon (Web Audio API, pitch detection)',
  'Rytmus — timing precision (AudioContext, ms odchylka)',
  'Kalibrace senzorů — normalizace napříč zařízeními',
  'Fallback — senzorová hra degraduje na tap variantu',
];

const LAUNCH = [
  'TestFlight beta — 50–100 dětí, sběr feedbacku',
  'Performance monitoring — Sentry (crash reporting)',
  'Analytics — Mixpanel / Amplitude (funnel, drop-off)',
  'Apple App Store submission — metadata, screenshots, review',
  'Google Play Store vydání',
  'Marketing web (talent.app nebo subdoména)',
  'Press kit + media assets (screenshots, logo, demo video)',
  'Fyzická výstava — samoobslužná stanoviště, fronty 1000+ dětí',
];

/* ─── Počítání ───────────────────────────────────────────────────────────────── */

const ALL_SECTIONS = [
  GAMES_REMAINING.length,
  CORE_FEATURES.length,
  DESIGN_POLISH.length,
  IPAD.length,
  ANDROID.length,
  BACKEND_DATA.length,
  SENSORS.length,
  LAUNCH.length,
];
const TOTAL_REMAINING = ALL_SECTIONS.reduce((a, b) => a + b, 0);
const DONE_COUNT = DONE_ITEMS.length;
const TOTAL = DONE_COUNT + TOTAL_REMAINING;
const PROGRESS = Math.round((DONE_COUNT / TOTAL) * 100);

/* ─── Component ──────────────────────────────────────────────────────────────── */

export default function Roadmap() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 540,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: '#0C0E16',
            marginBottom: 6,
          }}
        >
          Roadmapa projektu
        </h2>
        <p style={{ fontSize: 13, color: '#8A8F9E' }}>
          {DONE_COUNT} z {TOTAL} úkolů dokončeno
        </p>

        {/* Progress bar */}
        <div
          style={{
            height: 6,
            background: '#EBECF1',
            borderRadius: 99,
            marginTop: 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${PROGRESS}%`,
              background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
              borderRadius: 99,
            }}
          />
        </div>
        <p style={{ fontSize: 11.5, color: '#8A8F9E', marginTop: 6 }}>
          {PROGRESS} % celkového projektu
        </p>
      </div>

      {/* ✅ Done */}
      <Section title="✅ Hotovo" count={DONE_COUNT} accent="#10B981" bgAccent="#ECFDF5">
        {DONE_ITEMS.map((item, i) => <Row key={i} done>{item}</Row>)}
      </Section>

      {/* 🎮 Hry */}
      <Section title="🎮 Hry" subtitle="4 / 15 hotovo" count={GAMES_REMAINING.length} accent="#7C3AED" bgAccent="#F5F3FF">
        <p style={{ padding: '8px 18px 4px', fontSize: 11.5, color: '#8A8F9E' }}>
          Klikni na hru → cíl, co měří a jak se liší obtížnost.
        </p>
        {GAMES_REMAINING.map((g, i) => <GameRow key={i} g={g} />)}
      </Section>

      {/* ⚙️ Core funkce */}
      <Section title="⚙️ Core funkce" count={CORE_FEATURES.length} accent="#2563EB" bgAccent="#EFF6FF">
        {CORE_FEATURES.map((item, i) => <Row key={i}>{item}</Row>)}
      </Section>

      {/* 🎨 Design & UX polish */}
      <Section title="🎨 Design & UX polish" count={DESIGN_POLISH.length} accent="#EC4899" bgAccent="#FDF2F8">
        {DESIGN_POLISH.map((item, i) => <Row key={i}>{item}</Row>)}
      </Section>

      {/* 📱 iPad */}
      <Section title="📱 iPad optimalizace" count={IPAD.length} accent="#0EA5E9" bgAccent="#F0F9FF">
        {IPAD.map((item, i) => <Row key={i}>{item}</Row>)}
      </Section>

      {/* 🤖 Android */}
      <Section title="🤖 Android" count={ANDROID.length} accent="#22C55E" bgAccent="#F0FDF4">
        {ANDROID.map((item, i) => <Row key={i}>{item}</Row>)}
      </Section>

      {/* 🔐 Backend & Data */}
      <Section title="🔐 Backend & Data" count={BACKEND_DATA.length} accent="#F59E0B" bgAccent="#FFFBEB">
        {BACKEND_DATA.map((item, i) => <Row key={i}>{item}</Row>)}
      </Section>

      {/* 🛰️ Senzory */}
      <Section title="🛰️ Senzorové hry" count={SENSORS.length} accent="#F97316" bgAccent="#FFF7ED">
        <p style={{ padding: '8px 18px 4px', fontSize: 11.5, color: '#8A8F9E' }}>
          ⭐ senzorová hra = váha ×3 ve scoringu oproti tap hrám
        </p>
        {SENSORS.map((item, i) => <Row key={i}>{item}</Row>)}
      </Section>

      {/* 🚀 Launch */}
      <Section title="🚀 Launch" count={LAUNCH.length} accent="#EF4444" bgAccent="#FEF2F2">
        {LAUNCH.map((item, i) => <Row key={i}>{item}</Row>)}
      </Section>

      {/* Footer */}
      <p
        style={{
          textAlign: 'center',
          fontSize: 11.5,
          color: '#8A8F9E',
          marginTop: 8,
          lineHeight: 1.6,
          paddingBottom: 8,
        }}
      >
        iOS (Expo) sdílí lib/core/ — game logic + scoring se nepřepisuje
      </p>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function Section({
  title, subtitle, count, accent, bgAccent, children,
}: {
  title: string; subtitle?: string; count: number;
  accent: string; bgAccent: string; children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #EBECF1',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 14,
        boxShadow: '0 1px 0 rgba(12,14,22,0.02), 0 4px 16px -6px rgba(12,14,22,0.08)',
      }}
    >
      <div
        style={{
          background: bgAccent,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #EBECF1',
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: '#0C0E16',
          }}
        >
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {subtitle && (
            <span style={{ fontSize: 12, color: '#8A8F9E', fontWeight: 500 }}>{subtitle}</span>
          )}
          <span
            style={{
              background: accent,
              color: '#fff',
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 12,
              padding: '2px 9px',
              borderRadius: 99,
            }}
          >
            {count}
          </span>
        </div>
      </div>
      <div style={{ padding: '4px 0' }}>{children}</div>
    </div>
  );
}

function Row({
  done = false, dimColor, dimLabel, children,
}: {
  done?: boolean; dimColor?: string; dimLabel?: string; children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 18px',
        borderBottom: '1px solid #F4F5F8',
        fontSize: 13,
        color: done ? '#3A3E4D' : '#0C0E16',
      }}
    >
      <span style={{ flexShrink: 0, fontSize: 14, lineHeight: 1 }}>
        {done ? (
          <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
        ) : (
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              borderRadius: '50%',
              border: '1.5px solid #D1D5DB',
            }}
          />
        )}
      </span>
      <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {children}
      </span>
      {dimColor && dimLabel && (
        <span
          style={{
            flexShrink: 0,
            fontSize: 10.5,
            fontWeight: 600,
            color: dimColor,
            background: dimColor + '18',
            padding: '2px 8px',
            borderRadius: 99,
            border: `1px solid ${dimColor}28`,
          }}
        >
          {dimLabel}
        </span>
      )}
    </div>
  );
}

function GameRow({ g }: { g: GameItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid #F4F5F8',
        borderLeft: g.built ? '3px solid #10B981' : '3px solid transparent',
        background: g.built ? '#F6FEFB' : 'transparent',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '9px 18px',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 13,
          color: '#0C0E16',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        {/* status: built = check, jinak chevron */}
        <span style={{ flexShrink: 0, width: 14, fontSize: 13, lineHeight: 1, color: g.built ? '#10B981' : '#8A8F9E' }}>
          {g.built ? '✓' : (
            <span style={{ display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
          )}
        </span>
        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {g.label}
          {g.note && <Badge color={g.color}>{g.note}</Badge>}
          {g.built && <Badge color="#10B981">hotovo</Badge>}
        </span>
        <span
          style={{
            flexShrink: 0,
            fontSize: 10.5,
            fontWeight: 600,
            color: g.color,
            background: g.color + '18',
            padding: '2px 8px',
            borderRadius: 99,
            border: `1px solid ${g.color}28`,
          }}
        >
          {g.dim}
        </span>
      </button>

      {open && (
        <div style={{ padding: '2px 18px 14px 42px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <DescLine label="Cíl" color={g.color}>{g.goal}</DescLine>
          <DescLine label="Měří" color={g.color}>{g.measures}</DescLine>
          <DescLine label="Odlišnost" color={g.color}>{g.distinction}</DescLine>

          {g.variants && (
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontWeight: 700, color: g.color, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Podle věku — co dostane každá kategorie
              </span>
              {g.variants.map(v => (
                <div key={v.age} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span
                    style={{
                      flexShrink: 0,
                      minWidth: 46,
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: g.color,
                      background: g.color + '14',
                      padding: '1px 7px',
                      borderRadius: 99,
                      textAlign: 'center',
                    }}
                  >
                    {v.age}
                  </span>
                  <span style={{ fontSize: 12, lineHeight: 1.45, color: '#3A3E4D' }}>{v.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DescLine({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, lineHeight: 1.5, color: '#3A3E4D' }}>
      <span
        style={{
          fontWeight: 700,
          color,
          fontSize: 10.5,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginRight: 6,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        color,
        background: color + '18',
        padding: '2px 7px',
        borderRadius: 99,
      }}
    >
      {children}
    </span>
  );
}
