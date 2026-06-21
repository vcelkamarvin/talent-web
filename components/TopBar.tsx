import React from 'react';

interface Props {
  right?: React.ReactNode;
}

export default function TopBar({ right }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Wordmark */}
      <div
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--ink)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: 99,
            background: 'var(--d1)',
            marginRight: 24,
            boxShadow: '11px 0 0 -1px var(--d3), 22px 0 0 -1px var(--d6)',
          }}
        />
        TALENT!
      </div>
      {right}
    </div>
  );
}

export function Avatar({ initials = 'AJ' }: { initials?: string }) {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 99,
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--d1)',
      }}
    >
      {initials}
    </div>
  );
}
