import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/lib/session/SessionContext';
import Roadmap from '@/components/Roadmap';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TALENT! — Zjisti svůj talent',
  description: '15 krátkých her · 8–12 minut · 7 dimenzí talentu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <SessionProvider>
          {/* ── Mobile: plain full-screen app ── */}
          {/* ── Desktop: iPhone frame + roadmap, controlled by CSS ── */}
          <div className="page-outer">
            {/* Preview caption — desktop only */}
            <div className="showcase-caption">
              <span className="showcase-dot" />
              <span>TALENT!</span>
              <span className="showcase-sep">·</span>
              iOS Preview
              <span className="showcase-sep">·</span>
              React Native coming soon
            </div>

            {/* iPhone frame wrapper */}
            <div className="iphone-outer">
              {/* Notch overlay */}
              <div className="iphone-chrome iphone-chrome-top">
                <div className="iphone-notch" />
                <div className="iphone-status">
                  <span>9:41</span>
                  <span style={{ letterSpacing: 2, fontSize: 11 }}>●●●</span>
                </div>
              </div>

              {/* The real app */}
              <div className="mesh-bg phone-shell">
                {children}
              </div>

              {/* Home indicator */}
              <div className="iphone-chrome iphone-chrome-bottom">
                <div className="iphone-home-bar" />
              </div>
            </div>

            {/* Roadmap — desktop only */}
            <div className="roadmap-wrapper">
              <Roadmap />
            </div>
          </div>
        </SessionProvider>

        <style>{`
          body {
            font-family: var(--font-body, 'Inter', system-ui, sans-serif);
          }
          * { -webkit-tap-highlight-color: transparent; }

          /* ── Mobile: full-screen app, no chrome ── */
          .page-outer {
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
          }
          .showcase-caption { display: none; }
          .roadmap-wrapper  { display: none; }

          /* ── Desktop (640px+): showcase layout ── */
          @media (min-width: 640px) {
            .page-outer {
              min-height: 100vh;
              background: #EDEEF2;
              align-items: center;
              padding: 48px 32px 80px;
              gap: 32px;
            }

            .showcase-caption {
              display: flex;
              align-items: center;
              gap: 8px;
              font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
              font-weight: 600;
              font-size: 13px;
              color: #6A7080;
              letter-spacing: 0.01em;
            }
            .showcase-dot {
              display: inline-block;
              width: 7px; height: 7px;
              border-radius: 99px;
              background: #2563EB;
              margin-right: 20px;
              box-shadow: 11px 0 0 -1px #F97316, 22px 0 0 -1px #10B981;
            }
            .showcase-sep { color: #C0C4D0; }

            .roadmap-wrapper {
              display: flex;
              justify-content: center;
              width: 100%;
              max-width: 540px;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
