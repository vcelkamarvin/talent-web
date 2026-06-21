import React from 'react';

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Card({ children, style, className }: Props) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        boxShadow: '0 1px 0 rgba(12,14,22,0.02), 0 10px 30px -14px rgba(12,14,22,0.12)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
