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

/* ─── Third game (Hledání — visual search / odd-one-out) ─── */

export interface HledaniCell {
  color: string;   // hex
  rot: number;     // stupně (využito jen v rotation módu)
}

export interface HledaniItem {
  cols: number;
  rows: number;
  oddIndex: number;      // index pole, které se liší
  base: HledaniCell;     // vzhled běžných polí
  odd: HledaniCell;      // vzhled odlišného pole
}

export interface HledaniSet {
  mode: 'color' | 'rotation'; // čím se odlišný prvek liší
  rule: string;
  items: HledaniItem[];
}

export interface GameConfig {
  id: string;
  title: string;
  dimension: Dimension;
  label: string;
  items?: SequenceItem[];
}
