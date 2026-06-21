'use client';

import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({ children, style, ...props }: Props) {
  return (
    <button
      {...props}
      style={{
        height: 56,
        borderRadius: 18,
        background: 'var(--ink)',
        color: '#fff',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontWeight: 600,
        fontSize: 16.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        width: '100%',
        border: 'none',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        boxShadow: '0 16px 30px -12px rgba(12,14,22,0.5)',
        opacity: props.disabled ? 0.4 : 1,
        transition: 'opacity 0.15s, transform 0.1s',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onMouseDown={e => { if (!props.disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onTouchStart={e => { if (!props.disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
      onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}
