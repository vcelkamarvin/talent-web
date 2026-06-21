'use client';

import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  state?: 'default' | 'correct' | 'wrong';
}

const stateStyles: Record<string, React.CSSProperties> = {
  default: {
    background: 'var(--surface)',
    border: '1.5px solid var(--line-2)',
    color: 'var(--ink)',
  },
  correct: {
    background: '#ECFDF5',
    border: '1.5px solid #10B981',
    color: '#047857',
  },
  wrong: {
    background: '#FEF2F2',
    border: '1.5px solid #EF4444',
    color: '#B91C1C',
  },
};

export default function OptionButton({ children, state = 'default', style, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={`${state === 'correct' ? 'pulse-green' : ''} ${state === 'wrong' ? 'shake-red' : ''} ${className ?? ''}`}
      style={{
        height: 60,
        borderRadius: 16,
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        fontWeight: 600,
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: props.disabled ? 'default' : 'pointer',
        transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
        boxShadow: '0 1px 0 rgba(12,14,22,0.04)',
        WebkitTapHighlightColor: 'transparent',
        ...stateStyles[state],
        ...style,
      }}
      onMouseDown={e => { if (!props.disabled && state === 'default') (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'; }}
      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      onTouchStart={e => { if (!props.disabled && state === 'default') (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'; }}
      onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}
