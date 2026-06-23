export type AgeBand = '4-6' | '7-10' | '11-15' | '15+';
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

/** Color-pattern item for the youngest band (4–6): no numbers, just colors. */
export interface ColorSequenceItem {
  seq: (string | null)[];   // color keys, null = the missing slot
  answer: string;           // correct color key
  options: string[];        // color keys offered as choices
}

/** Age-adaptive config for the first game (Posloupnost). */
export type SequenceSet =
  | { mode: 'color'; items: ColorSequenceItem[]; rule: string }
  | { mode: 'number'; items: SequenceItem[]; rule: string };

/* ─── Second game (Rotace 3D — spatial / mental rotation) ─── */

/** One rendered shape: rotation in degrees + optional mirror (flip). */
export interface RotaOption {
  rot: number;       // degrees
  mirror: boolean;   // true = zrcadlově převrácený (špatná odpověď)
}

export interface RotationItem {
  options: RotaOption[]; // exactly one has mirror:false (the correct rotation)
  answer: number;        // index of the non-mirrored option
}

export interface RotationSet {
  rule: string;          // krátká nápověda pod zadáním
  targetRot: number;     // natočení referenčního tvaru nahoře
  items: RotationItem[];
}

/* ─── Hledání — emoji „najdi, co se sem nehodí" ─── */

export interface HledaniItem {
  cols: number;
  rows: number;
  oddIndex: number; // index pole, které se liší
  base: string;     // emoji opakující se v mřížce
  odd: string;      // emoji odlišného pole
}

export interface HledaniSet {
  rule: string;
  items: HledaniItem[];
}

/* ─── Skládačka — „který dílek pasuje do díry" (prostorová) ─── */

export type ShapeKey =
  | 'circle' | 'square' | 'triangle' | 'diamond'
  | 'pentagon' | 'hexagon' | 'heptagon' | 'octagon'
  | 'star' | 'heart' | 'arrow' | 'cross';

export interface FitOption {
  shape: ShapeKey;
  rot: number;
}

export interface FitItem {
  hole: FitOption;        // tvar díry (silueta nahoře)
  options: FitOption[];   // nabízené dílky
  answer: number;         // index dílku, který pasuje (stejný tvar i natočení)
}

export interface FitSet {
  rule: string;
  items: FitItem[];
}

export interface GameConfig {
  id: string;
  title: string;
  dimension: Dimension;
  label: string;
  items?: SequenceItem[];
}
