export type AgeBand = '4-6' | '7-10' | '11-15';
export type Gender = 'kluk' | 'holka';

export type Dimension = 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' | 'd7';

export interface GameAnswer {
  gameId: string;
  itemIndex: number;
  answer: number;
  correct: boolean;
  reactionMs: number;
}

export interface Session {
  ageBand: AgeBand | null;
  gender: Gender | null;
  gameIndex: number;
  answers: GameAnswer[];
  isGuest: boolean;
}

export interface SequenceItem {
  seq: (number | null)[];
  answer: number;
  options: number[];
  rule: string;
}

export interface GameConfig {
  id: string;
  title: string;
  dimension: Dimension;
  label: string;
  items?: SequenceItem[];
}
