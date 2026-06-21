/* ─── Data ─────────────────────────────────────────────────────────────────── */

const DONE_ITEMS = [
  'Design systém + tokeny (barvy, typo, spacing, komponenty)',
  'App shell — iOS phone frame, mesh gradient, responzivita',
  'Interaktivní Orb — float, cursor tilt, satellite pulse, entrance animace',
  'Start screen (Orb, tagline, CTA)',
  'Přihlášení — e-mail + "Pokračovat jako host"',
  'Domovská obrazovka (Home)',
  'Onboarding — věk (4–6 / 7–10 / 11–15) + pohlaví',
  'Hra 1: Posloupnost — Logika, 3 položky, reaction time, animace',
  'Výsledková obrazovka (stub s dimenzními bary)',
  'Showcase rámeček + klientská roadmapa (tento seznam)',
  'Deploy na Vercel — živý link pro klienta',
];

interface GameItem { label: string; dim: string; color: string; note?: string }

const GAMES_REMAINING: GameItem[] = [
  { label: 'Hledání',      dim: 'Vizuální',     color: '#F59E0B' },
  { label: 'Rotace 3D',    dim: 'Prostorová',   color: '#7C3AED' },
  { label: 'Rovnováha',    dim: 'Kinestetická', color: '#F97316', note: '⭐ gyroskop' },
  { label: 'Analogie',     dim: 'Jazyková',     color: '#10B981' },
  { label: 'Výška tónu',   dim: 'Hudební',      color: '#EC4899', note: '⭐ audio' },
  { label: 'Odhad počtu',  dim: 'Logika',       color: '#2563EB' },
  { label: 'Kliky',        dim: 'Kinestetická', color: '#F97316', note: '⭐ kamera' },
  { label: 'Estetika',     dim: 'Vizuální',     color: '#F59E0B' },
  { label: 'Matice',       dim: 'Logika',       color: '#2563EB' },
  { label: 'Rytmus',       dim: 'Hudební',      color: '#EC4899', note: '⭐ timing' },
  { label: 'Logická mapa', dim: 'Prostorová',   color: '#7C3AED' },
  { label: 'Pravda / lež', dim: 'Jazyková',     color: '#10B981' },
  { label: 'Pocity',       dim: 'Sociální',     color: '#EF4444' },
  { label: 'Spolu',        dim: 'Sociální',     color: '#EF4444' },
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
      <Section title="🎮 Hry" subtitle="1 / 15 hotovo" count={GAMES_REMAINING.length} accent="#7C3AED" bgAccent="#F5F3FF">
        {GAMES_REMAINING.map((g, i) => (
          <Row key={i} dimColor={g.color} dimLabel={g.dim}>
            <span>{g.label}</span>
            {g.note && <Badge color={g.color}>{g.note}</Badge>}
          </Row>
        ))}
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
