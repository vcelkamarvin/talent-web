'use client';

import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function SecondaryButton({ children, style, ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        height: 52,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(8px)',
        color: 'var(--ink)',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontWeight: 600,
        fontSize: 15.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        border: '1px solid var(--line-2)',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.4 : 1,
        transition: 'opacity 0.15s, transform 0.1s',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onMouseDown={e => { if (!props.disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}
