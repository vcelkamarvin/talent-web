import type { GameConfig, SequenceSet, FitSet, HledaniSet, MemorySet, AgeBand } from './types';

export const GAME_CYCLE: GameConfig[] = [
  { id: 'hledani',     title: 'Paměť',       dimension: 'd5', label: 'Vizuální' },
  { id: 'posloupnost', title: 'Posloupnost',  dimension: 'd1', label: 'Logika',
    items: [
      { seq: [2, 5, 11, null, 47], answer: 23, options: [21, 23, 25, 27], rule: '×2+1' },
      { seq: [3, 6, 12, 24, null], answer: 48, options: [36, 42, 48, 54], rule: '×2' },
      { seq: [1, 1, 2, 3, 5, null], answer: 8,  options: [7, 8, 9, 11],   rule: 'Fibonacci' },
    ],
  },
  { id: 'rotace3d',   title: 'Skládačka',   dimension: 'd2', label: 'Prostorová' },
  { id: 'rovnovaha',  title: 'Rovnováha',   dimension: 'd3', label: 'Kinestetická' },
  { id: 'analogie',   title: 'Analogie',    dimension: 'd6', label: 'Jazyková' },
  { id: 'vyska-tonu', title: 'Výška tónu',  dimension: 'd4', label: 'Hudební' },
  { id: 'odhad',      title: 'Odhad počtu', dimension: 'd1', label: 'Logika' },
  { id: 'kliky',      title: 'Kliky ⭐',    dimension: 'd3', label: 'Kinestetická' },
  { id: 'estetika',   title: 'Estetika',    dimension: 'd5', label: 'Vizuální' },
  { id: 'matice',     title: 'Matice',      dimension: 'd1', label: 'Logika' },
  { id: 'rytmus',     title: 'Rytmus',      dimension: 'd4', label: 'Hudební' },
  { id: 'mapa',       title: 'Logická mapa', dimension: 'd2', label: 'Prostorová' },
  { id: 'pravda-lez', title: 'Pravda / lež', dimension: 'd6', label: 'Jazyková' },
  { id: 'pocity',     title: 'Pocity',      dimension: 'd7', label: 'Sociální' },
  { id: 'spolu',      title: 'Spolu',       dimension: 'd7', label: 'Sociální' },
];

export const DIMENSION_COLORS: Record<string, string> = {
  d1: 'var(--d1)',
  d2: 'var(--d2)',
  d3: 'var(--d3)',
  d4: 'var(--d4)',
  d5: 'var(--d5)',
  d6: 'var(--d6)',
  d7: 'var(--d7)',
};

/* ─── First game (Posloupnost): age-adaptive difficulty ───
   4–6   → barvy (žádná čísla), jednoduché opakující se vzory
   7–10  → lehké číselné řady (+1, +2, +5)
   11–15 → střední řady (×2, ×2+1, Fibonacci)
   15+   → těžké řady (mocniny, prvočísla, faktoriál)            */

/** Color palette for the 4–6 band. Hex + friendly Czech name. */
export const SEQUENCE_COLORS: Record<string, { hex: string; name: string }> = {
  red:    { hex: '#EF4444', name: 'červená' },
  blue:   { hex: '#2563EB', name: 'modrá' },
  green:  { hex: '#10B981', name: 'zelená' },
  yellow: { hex: '#F59E0B', name: 'žlutá' },
  purple: { hex: '#7C3AED', name: 'fialová' },
  orange: { hex: '#F97316', name: 'oranžová' },
};

export const SEQUENCE_BY_AGE: Record<AgeBand, SequenceSet> = {
  '4-6': {
    mode: 'color',
    rule: 'Jaká barva pokračuje?',
    items: [
      { seq: ['red', 'blue', 'red', 'blue', null], answer: 'red',
        options: ['red', 'blue', 'green', 'yellow'] },
      { seq: ['green', 'yellow', 'green', 'yellow', null], answer: 'green',
        options: ['green', 'yellow', 'red', 'purple'] },
      { seq: ['red', 'red', 'blue', 'red', 'red', null], answer: 'blue',
        options: ['blue', 'red', 'green', 'orange'] },
    ],
  },
  '7-10': {
    mode: 'number',
    rule: 'Jaké číslo chybí?',
    items: [
      { seq: [2, 4, 6, null, 10], answer: 8,  options: [7, 8, 9, 10],   rule: '+2' },
      { seq: [5, 10, 15, null, 25], answer: 20, options: [18, 20, 22, 24], rule: '+5' },
      { seq: [1, 2, 3, 4, null],   answer: 5,  options: [5, 6, 7, 8],    rule: '+1' },
    ],
  },
  '11-15': {
    mode: 'number',
    rule: 'Jaké číslo chybí?',
    items: [
      { seq: [2, 5, 11, null, 47], answer: 23, options: [21, 23, 25, 27], rule: '×2+1' },
      { seq: [3, 6, 12, 24, null], answer: 48, options: [36, 42, 48, 54], rule: '×2' },
      { seq: [1, 1, 2, 3, 5, null], answer: 8,  options: [7, 8, 9, 11],   rule: 'Fibonacci' },
    ],
  },
  '15+': {
    mode: 'number',
    rule: 'Jaké číslo chybí?',
    items: [
      { seq: [1, 4, 9, 16, null],   answer: 25,  options: [20, 23, 25, 30],    rule: 'n²' },
      { seq: [2, 3, 5, 7, 11, null], answer: 13,  options: [12, 13, 14, 15],    rule: 'Prvočísla' },
      { seq: [1, 2, 6, 24, null],   answer: 120, options: [96, 100, 120, 144], rule: '×n (faktoriál)' },
    ],
  },
};

/** Returns the sequence set for an age band (defaults to 11–15 if unset). */
export function getSequenceSet(ageBand: AgeBand | null): SequenceSet {
  return SEQUENCE_BY_AGE[ageBand ?? '11-15'];
}

/* ─── Second game (Skládačka): „který dílek pasuje do díry" (prostorová) ───
   Cíl: vybrat dílek, který přesně sedne do díry (stejný tvar i natočení).
   4–6   → základní, hodně odlišné tvary (kruh / čtverec / hvězda…)
   7–10  → víc tvarů, méně nápadné rozdíly
   11–15 → podobné mnohoúhelníky (počítej hrany)
   15+   → otočené tvary — záleží na natočení (šipka)                  */

export const FIT_BY_AGE: Record<AgeBand, FitSet> = {
  '4-6': {
    rule: 'Který dílek sedne do díry?',
    items: [
      { hole: { shape: 'circle', rot: 0 },   options: [{ shape: 'square', rot: 0 }, { shape: 'circle', rot: 0 }, { shape: 'triangle', rot: 0 }, { shape: 'star', rot: 0 }], answer: 1 },
      { hole: { shape: 'star', rot: 0 },      options: [{ shape: 'star', rot: 0 }, { shape: 'heart', rot: 0 }, { shape: 'circle', rot: 0 }, { shape: 'square', rot: 0 }], answer: 0 },
      { hole: { shape: 'triangle', rot: 0 },  options: [{ shape: 'diamond', rot: 0 }, { shape: 'square', rot: 0 }, { shape: 'triangle', rot: 0 }, { shape: 'heart', rot: 0 }], answer: 2 },
    ],
  },
  '7-10': {
    rule: 'Který tvar pasuje?',
    items: [
      { hole: { shape: 'hexagon', rot: 0 },   options: [{ shape: 'pentagon', rot: 0 }, { shape: 'hexagon', rot: 0 }, { shape: 'octagon', rot: 0 }, { shape: 'square', rot: 0 }], answer: 1 },
      { hole: { shape: 'diamond', rot: 0 },   options: [{ shape: 'diamond', rot: 0 }, { shape: 'square', rot: 0 }, { shape: 'triangle', rot: 0 }, { shape: 'star', rot: 0 }], answer: 0 },
      { hole: { shape: 'star', rot: 0 },      options: [{ shape: 'pentagon', rot: 0 }, { shape: 'star', rot: 0 }, { shape: 'hexagon', rot: 0 }, { shape: 'cross', rot: 0 }], answer: 1 },
    ],
  },
  '11-15': {
    rule: 'Spočítej hrany — co pasuje?',
    items: [
      { hole: { shape: 'pentagon', rot: 0 },  options: [{ shape: 'hexagon', rot: 0 }, { shape: 'heptagon', rot: 0 }, { shape: 'pentagon', rot: 0 }, { shape: 'octagon', rot: 0 }], answer: 2 },
      { hole: { shape: 'heptagon', rot: 0 },  options: [{ shape: 'heptagon', rot: 0 }, { shape: 'hexagon', rot: 0 }, { shape: 'octagon', rot: 0 }, { shape: 'pentagon', rot: 0 }], answer: 0 },
      { hole: { shape: 'octagon', rot: 0 },   options: [{ shape: 'heptagon', rot: 0 }, { shape: 'octagon', rot: 0 }, { shape: 'hexagon', rot: 0 }, { shape: 'pentagon', rot: 0 }], answer: 1 },
    ],
  },
  '15+': {
    rule: 'Pozor na natočení dílku',
    items: [
      { hole: { shape: 'arrow', rot: 0 },     options: [{ shape: 'arrow', rot: 90 }, { shape: 'arrow', rot: 0 }, { shape: 'arrow', rot: 180 }, { shape: 'arrow', rot: 270 }], answer: 1 },
      { hole: { shape: 'arrow', rot: 90 },    options: [{ shape: 'arrow', rot: 0 }, { shape: 'arrow', rot: 90 }, { shape: 'arrow', rot: 270 }, { shape: 'arrow', rot: 180 }], answer: 1 },
      { hole: { shape: 'heptagon', rot: 0 },  options: [{ shape: 'octagon', rot: 0 }, { shape: 'heptagon', rot: 0 }, { shape: 'hexagon', rot: 0 }, { shape: 'star', rot: 0 }], answer: 1 },
    ],
  },
};

/** Returns the shape-fit set for an age band (defaults to 11–15 if unset). */
export function getFitSet(ageBand: AgeBand | null): FitSet {
  return FIT_BY_AGE[ageBand ?? '11-15'];
}

/* ─── Third game (Hledání): emoji „najdi, co se sem nehodí" ───
   Cíl: ťukni na emoji, které se liší od ostatních.
   Obtížnost = velikost mřížky + podobnost emoji.
   4–6   → zvířátka, hodně odlišné (🐶 vs 🐱), malá mřížka
   7–10  → podobnější (🐱 vs 🐯), střední mřížka
   11–15 → podobné smajlíky (🙂 vs 😊), větší mřížka
   15+   → skoro stejné (😄 vs 😁), hustá mřížka                      */

export const HLEDANI_BY_AGE: Record<AgeBand, HledaniSet> = {
  '4-6': {
    rule: 'Najdi, co se sem nehodí',
    items: [
      { cols: 2, rows: 2, oddIndex: 2, base: '🐶', odd: '🐱' },
      { cols: 3, rows: 2, oddIndex: 4, base: '🍎', odd: '🍌' },
      { cols: 3, rows: 3, oddIndex: 6, base: '⭐', odd: '❤️' },
    ],
  },
  '7-10': {
    rule: 'Najdi, co se sem nehodí',
    items: [
      { cols: 3, rows: 3, oddIndex: 5,  base: '🐱', odd: '🐯' },
      { cols: 4, rows: 3, oddIndex: 7,  base: '🚗', odd: '🚙' },
      { cols: 4, rows: 4, oddIndex: 10, base: '🌳', odd: '🌲' },
    ],
  },
  '11-15': {
    rule: 'Najdi, co se sem nehodí',
    items: [
      { cols: 4, rows: 4, oddIndex: 9,  base: '🙂', odd: '😊' },
      { cols: 5, rows: 4, oddIndex: 13, base: '🐢', odd: '🦎' },
      { cols: 5, rows: 5, oddIndex: 18, base: '🌝', odd: '🌚' },
    ],
  },
  '15+': {
    rule: 'Najdi, co se sem nehodí',
    items: [
      { cols: 5, rows: 5, oddIndex: 12, base: '😄', odd: '😁' },
      { cols: 6, rows: 5, oddIndex: 21, base: '🌝', odd: '🌚' },
      { cols: 6, rows: 6, oddIndex: 29, base: '😺', odd: '😸' },
    ],
  },
};

/** Returns the visual-search set for an age band (defaults to 11–15 if unset). */
export function getHledaniSet(ageBand: AgeBand | null): HledaniSet {
  return HLEDANI_BY_AGE[ageBand ?? '11-15'];
}

/* ─── First game (Paměť): sekvenční paměť (Simon) ───
   Rozsvítí se sekvence polí, hráč ji zopakuje. Testuje pracovní paměť.
   Obtížnost = délka sekvence + počet polí + rychlost blikání.
   4–6   → 4 pole, krátké pomalé sekvence
   7–10  → 4 pole, delší
   11–15 → 6 polí, rychlejší
   15+   → 6 polí, dlouhé a rychlé                                   */

export const MEMORY_BY_AGE: Record<AgeBand, MemorySet> = {
  '4-6':   { pads: 4, rounds: [2, 3, 3], flashMs: 720, gapMs: 320 },
  '7-10':  { pads: 4, rounds: [3, 4, 4], flashMs: 620, gapMs: 270 },
  '11-15': { pads: 6, rounds: [4, 5, 5], flashMs: 520, gapMs: 220 },
  '15+':   { pads: 6, rounds: [5, 6, 7], flashMs: 440, gapMs: 180 },
};

/** Returns the memory set for an age band (defaults to 11–15 if unset). */
export function getMemorySet(ageBand: AgeBand | null): MemorySet {
  return MEMORY_BY_AGE[ageBand ?? '11-15'];
}
