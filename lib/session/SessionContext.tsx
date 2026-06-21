'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Session, AgeBand, Gender, GameAnswer } from '@/lib/core/types';

const DEFAULT_SESSION: Session = {
  ageBand: null,
  gender: null,
  gameIndex: 0,
  answers: [],
  isGuest: false,
};

interface SessionContextValue {
  session: Session;
  setAgeBand: (band: AgeBand) => void;
  setGender: (gender: Gender) => void;
  setGuest: (isGuest: boolean) => void;
  recordAnswer: (answer: GameAnswer) => void;
  nextGame: () => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(DEFAULT_SESSION);

  const setAgeBand = useCallback((band: AgeBand) => {
    setSession(s => ({ ...s, ageBand: band }));
  }, []);

  const setGender = useCallback((gender: Gender) => {
    setSession(s => ({ ...s, gender }));
  }, []);

  const setGuest = useCallback((isGuest: boolean) => {
    setSession(s => ({ ...s, isGuest }));
  }, []);

  const recordAnswer = useCallback((answer: GameAnswer) => {
    setSession(s => ({ ...s, answers: [...s.answers, answer] }));
  }, []);

  const nextGame = useCallback(() => {
    setSession(s => ({ ...s, gameIndex: s.gameIndex + 1 }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(DEFAULT_SESSION);
  }, []);

  return (
    <SessionContext.Provider value={{ session, setAgeBand, setGender, setGuest, recordAnswer, nextGame, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
