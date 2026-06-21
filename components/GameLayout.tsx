import React from 'react';

interface Props {
  children: React.ReactNode;
  gameNumber: number;
  totalGames: number;
  categoryLabel: string;
  categoryColor: string;
}

export default function GameLayout({ children, gameNumber, totalGames, categoryLabel, categoryColor }: Props) {
  const progress = (gameNumber / totalGames) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '0 0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: categoryColor + '18',
              color: categoryColor,
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 12.5,
              padding: '5px 11px',
              borderRadius: 99,
              border: `1px solid ${categoryColor}30`,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: categoryColor, display: 'inline-block' }} />
            {categoryLabel}
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--ink-3)',
            }}
          >
            {gameNumber} / {totalGames}
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: categoryColor,
              borderRadius: 99,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Game area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
