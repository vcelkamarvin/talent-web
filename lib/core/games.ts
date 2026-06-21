import type { GameConfig } from './types';

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
