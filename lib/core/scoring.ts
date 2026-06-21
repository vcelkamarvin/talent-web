import type { GameAnswer } from './types';

/** Raw 0–100 score for a sequence game based on correctness and speed */
export function scoreSequenceGame(answers: GameAnswer[]): number {
  if (answers.length === 0) return 0;

  const correctCount = answers.filter(a => a.correct).length;
  const accuracyScore = (correctCount / answers.length) * 70;

  const avgReactionMs = answers.reduce((sum, a) => sum + a.reactionMs, 0) / answers.length;
  // Speed bonus: 0–30 pts; under 2000ms full bonus, over 8000ms zero
  const speedScore = Math.max(0, Math.min(30, ((8000 - avgReactionMs) / 6000) * 30));

  return Math.round(Math.min(100, accuracyScore + speedScore));
}

/** Convert raw 0–100 to a percentile string (cold-start: uses predefined norms) */
export function toPercentileLabel(raw: number): string {
  if (raw >= 90) return 'Top 10 %';
  if (raw >= 75) return 'Top 25 %';
  if (raw >= 50) return 'Nadprůměr';
  if (raw >= 25) return 'Průměr';
  return 'Rozvíjíme';
}
