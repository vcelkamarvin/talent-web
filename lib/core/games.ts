import type { GameConfig, SequenceSet, RotationSet, HledaniSet, AgeBand } from './types';

export const GAME_CYCLE: GameConfig[] = [
  { id: 'hledani',     title: 'Hledání',     dimension: 'd5', label: 'Vizuální' },
  { id: 'posloupnost', title: 'Posloupnost',  dimension: 'd1', label: 'Logika',
    items: [
      { seq: [2, 5, 11, null, 47], answer: 23, options: [21, 23, 25, 27], rule: '×2+1' },
      { seq: [3, 6, 12, 24, null], answer: 48, options: [36, 42, 48, 54], rule: '×2' },
      { seq: [1, 1, 2, 3, 5, null], answer: 8,  options: [7, 8, 9, 11],   rule: 'Fibonacci' },
    ],
  },
  { id: 'rotace3d',   title: 'Rotace 3D',   dimension: 'd2', label: 'Prostorová' },
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

/* ─── Second game (Rotace 3D): age-adaptive mental rotation ───
   Cíl: najít tu možnost, která je STEJNÝ tvar, jen otočený (ne zrcadlený).
   Přesně jedna možnost má mirror:false = správná odpověď.
   4–6   → pravé úhly (0/90/180/270), jasně odlišné
   7–10  → pravé úhly, zrcadla i ve stejném úhlu (těžší rozlišení)
   11–15 → šikmé úhly po 45°
   15+   → nestandardní úhly (30/120/210/300…)                      */

export const ROTATION_BY_AGE: Record<AgeBand, RotationSet> = {
  '4-6': {
    rule: 'Najdi stejný tvar, jen otočený',
    targetRot: 0,
    items: [
      { options: [{ rot: 90, mirror: true }, { rot: 180, mirror: false }, { rot: 0, mirror: true }, { rot: 270, mirror: true }], answer: 1 },
      { options: [{ rot: 90, mirror: false }, { rot: 180, mirror: true }, { rot: 270, mirror: true }, { rot: 0, mirror: true }], answer: 0 },
      { options: [{ rot: 0, mirror: true }, { rot: 270, mirror: true }, { rot: 270, mirror: false }, { rot: 90, mirror: true }], answer: 2 },
    ],
  },
  '7-10': {
    rule: 'Stejný tvar, jen otočený (ne převrácený)',
    targetRot: 0,
    items: [
      { options: [{ rot: 0, mirror: true }, { rot: 90, mirror: true }, { rot: 270, mirror: false }, { rot: 180, mirror: true }], answer: 2 },
      { options: [{ rot: 180, mirror: false }, { rot: 180, mirror: true }, { rot: 90, mirror: true }, { rot: 0, mirror: true }], answer: 0 },
      { options: [{ rot: 90, mirror: true }, { rot: 270, mirror: false }, { rot: 0, mirror: true }, { rot: 180, mirror: true }], answer: 1 },
    ],
  },
  '11-15': {
    rule: 'Pozor na zrcadlení',
    targetRot: 0,
    items: [
      { options: [{ rot: 45, mirror: true }, { rot: 135, mirror: false }, { rot: 225, mirror: true }, { rot: 315, mirror: true }], answer: 1 },
      { options: [{ rot: 45, mirror: false }, { rot: 135, mirror: true }, { rot: 225, mirror: true }, { rot: 315, mirror: true }], answer: 0 },
      { options: [{ rot: 315, mirror: true }, { rot: 225, mirror: true }, { rot: 135, mirror: true }, { rot: 45, mirror: false }], answer: 3 },
    ],
  },
  '15+': {
    rule: 'Šikmá natočení — pozor na zrcadlení',
    targetRot: 0,
    items: [
      { options: [{ rot: 30, mirror: true }, { rot: 120, mirror: false }, { rot: 210, mirror: true }, { rot: 300, mirror: true }], answer: 1 },
      { options: [{ rot: 150, mirror: false }, { rot: 60, mirror: true }, { rot: 240, mirror: true }, { rot: 330, mirror: true }], answer: 0 },
      { options: [{ rot: 300, mirror: true }, { rot: 210, mirror: true }, { rot: 120, mirror: false }, { rot: 30, mirror: true }], answer: 2 },
    ],
  },
};

/** Returns the rotation set for an age band (defaults to 11–15 if unset). */
export function getRotationSet(ageBand: AgeBand | null): RotationSet {
  return ROTATION_BY_AGE[ageBand ?? '11-15'];
}

/* ─── Third game (Hledání): age-adaptive visual search (odd-one-out) ───
   Cíl: ťukni na pole, které se liší od ostatních.
   Dvě páčky obtížnosti: velikost mřížky + nápadnost rozdílu.
   4–6   → barva (vše červené, jedno modré), malá mřížka
   7–10  → otočení šipky, střední mřížka
   11–15 → jemný odstín, větší mřížka
   15+   → velmi jemný odstín, hustá mřížka                          */

export const HLEDANI_BY_AGE: Record<AgeBand, HledaniSet> = {
  '4-6': {
    mode: 'color',
    rule: 'Najdi jinou barvu',
    items: [
      { cols: 2, rows: 2, oddIndex: 2, base: { color: '#EF4444', rot: 0 }, odd: { color: '#2563EB', rot: 0 } },
      { cols: 3, rows: 2, oddIndex: 4, base: { color: '#10B981', rot: 0 }, odd: { color: '#F59E0B', rot: 0 } },
      { cols: 3, rows: 3, oddIndex: 6, base: { color: '#7C3AED', rot: 0 }, odd: { color: '#F97316', rot: 0 } },
    ],
  },
  '7-10': {
    mode: 'rotation',
    rule: 'Najdi otočenou šipku',
    items: [
      { cols: 3, rows: 3, oddIndex: 5,  base: { color: '#2563EB', rot: 0 }, odd: { color: '#2563EB', rot: 90 } },
      { cols: 4, rows: 3, oddIndex: 7,  base: { color: '#F97316', rot: 0 }, odd: { color: '#F97316', rot: 180 } },
      { cols: 4, rows: 4, oddIndex: 10, base: { color: '#10B981', rot: 0 }, odd: { color: '#10B981', rot: 90 } },
    ],
  },
  '11-15': {
    mode: 'color',
    rule: 'Najdi jiný odstín',
    items: [
      { cols: 4, rows: 4, oddIndex: 9,  base: { color: '#2563EB', rot: 0 }, odd: { color: '#5A86E8', rot: 0 } },
      { cols: 5, rows: 4, oddIndex: 13, base: { color: '#7C3AED', rot: 0 }, odd: { color: '#9460EF', rot: 0 } },
      { cols: 5, rows: 5, oddIndex: 18, base: { color: '#F97316', rot: 0 }, odd: { color: '#FB9445', rot: 0 } },
    ],
  },
  '15+': {
    mode: 'color',
    rule: 'Najdi nepatrně jiný odstín',
    items: [
      { cols: 5, rows: 5, oddIndex: 12, base: { color: '#10B981', rot: 0 }, odd: { color: '#1FC295', rot: 0 } },
      { cols: 6, rows: 5, oddIndex: 21, base: { color: '#2563EB', rot: 0 }, odd: { color: '#3370EE', rot: 0 } },
      { cols: 6, rows: 6, oddIndex: 29, base: { color: '#EF4444', rot: 0 }, odd: { color: '#F25555', rot: 0 } },
    ],
  },
};

/** Returns the visual-search set for an age band (defaults to 11–15 if unset). */
export function getHledaniSet(ageBand: AgeBand | null): HledaniSet {
  return HLEDANI_BY_AGE[ageBand ?? '11-15'];
}
