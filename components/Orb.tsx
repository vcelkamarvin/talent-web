'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface OrbProps {
  size?: number;
}

export default function Orb({ size = 200 }: OrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [entered, setEntered] = useState(false);

  // Entrance animation trigger after mount
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -14, y: dx * 14 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const isResting = tilt.x === 0 && tilt.y === 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        width: size,
        height: size,
        position: 'relative',
        cursor: 'pointer',
        willChange: 'transform',
        /* float + tilt combined */
        animation: entered ? 'orb-float 4s ease-in-out infinite' : undefined,
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isResting
          ? 'transform 0.8s cubic-bezier(0.34, 1.2, 0.64, 1)'
          : 'transform 0.1s ease-out',
        opacity: entered ? 1 : 0,
      }}
      className={!entered ? 'orb-enter' : undefined}
    >
      {/* Outer glow ring — expands on hover */}
      <div
        style={{
          position: 'absolute',
          inset: hovered ? -18 : -8,
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(141,108,255,0.18), transparent)',
          transition: 'inset 0.5s cubic-bezier(0.34,1.4,0.64,1)',
          pointerEvents: 'none',
        }}
      />

      {/* Expanding pulse rings */}
      {entered && [0, 1.7].map((d, i) => (
        <div
          key={i}
          className="orb-ring"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(141,108,255,0.45)',
            animationDelay: `${d}s`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Main sphere */}
      <div
        className="orb-sphere"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `
            radial-gradient(58% 50% at 36% 30%, #ffffff 0%, rgba(255,255,255,0) 42%),
            radial-gradient(120% 120% at 70% 75%, #5B8CFF 0%, #8E6CFF 48%, #C86BFF 100%)
          `,
          position: 'relative',
          transition: 'filter 0.3s ease',
          filter: hovered ? 'brightness(1.08)' : 'brightness(1)',
        }}
      >
        {/* Specular highlight */}
        <div
          style={{
            position: 'absolute',
            width: '29%',
            height: '16%',
            left: '18%',
            top: '16%',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))',
            filter: 'blur(2px)',
          }}
        />
        {/* Secondary soft highlight */}
        <div
          style={{
            position: 'absolute',
            width: '45%',
            height: '40%',
            left: '8%',
            top: '6%',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(255,255,255,0.15), rgba(255,255,255,0))',
          }}
        />
        {/* Rotating sheen glint */}
        <div
          className="orb-sheen"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.22) 55deg, transparent 130deg, transparent 360deg)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Satellites — orbit slowly around the sphere */}
      <div className="orb-orbit" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Sat color="var(--d1)" posStyle={{ top: '4%', left: '50%', transform: 'translateX(-50%)' }} delay={0} />
        <Sat color="var(--d3)" posStyle={{ top: '22%', right: '3%' }}  delay={0.55} />
        <Sat color="var(--d4)" posStyle={{ bottom: '20%', right: '2%' }} delay={1.1} />
        <Sat color="var(--d5)" posStyle={{ bottom: '2%', left: '54%' }} delay={1.65} />
        <Sat color="var(--d6)" posStyle={{ bottom: '20%', left: '2%' }} delay={2.2} />
        <Sat color="var(--d2)" posStyle={{ top: '22%', left: '3%' }}    delay={2.75} />
      </div>
    </div>
  );
}

function Sat({
  color,
  posStyle,
  delay,
}: {
  color: string;
  posStyle: React.CSSProperties;
  delay: number;
}) {
  return (
    <span
      style={{
        position: 'absolute',
        width: 13,
        height: 13,
        borderRadius: '99px',
        background: color,
        border: '2.5px solid #fff',
        boxShadow: `0 4px 10px -2px rgba(20,22,40,0.35), 0 0 0 3px ${color}30`,
        animation: `sat-pulse 3.5s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        ...posStyle,
      }}
    />
  );
}
