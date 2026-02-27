import { EffortSize } from '@/types';

const EFFORT_VALUES: Record<EffortSize, number> = {
  S: 1,
  M: 3,
  L: 5,
  XL: 8,
};

export function calculatePriority(
  impact: number,
  urgency: number,
  effort: EffortSize
): number {
  if (impact < 1 || impact > 5) {
    throw new Error('Impact must be between 1 and 5');
  }
  if (urgency < 1 || urgency > 5) {
    throw new Error('Urgency must be between 1 and 5');
  }

  const effortValue = EFFORT_VALUES[effort];
  if (!effortValue) {
    throw new Error(`Invalid effort size: ${effort}`);
  }

  // Formula: (Impact * Urgency) / Esfuerzo
  const priority = (impact * urgency) / effortValue;

  // Return rounded to 2 decimal places for cleaner display
  return Math.round(priority * 100) / 100;
}
