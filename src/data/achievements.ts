import type { Achievement } from '../types/game.types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_case',
    name: 'First Judgment',
    description: 'Complete your first case',
    unlocked: false,
    reward: 25
  },
  {
    id: 'five_cases',
    name: 'Experienced Judge',
    description: 'Complete 5 cases',
    unlocked: false,
    reward: 50
  },
  {
    id: 'ten_cases',
    name: 'Veteran Judge',
    description: 'Complete 10 cases',
    unlocked: false,
    reward: 100
  },
  {
    id: 'perfect_five',
    name: 'Perfect Streak',
    description: 'Get 5 correct verdicts in a row',
    unlocked: false,
    reward: 150
  },
  {
    id: 'perfect_ten',
    name: 'Justice Incarnate',
    description: 'Get 10 correct verdicts in a row',
    unlocked: false,
    reward: 300
  },
  {
    id: 'eagle_eye',
    name: 'Eagle Eye',
    description: 'Discover all clues in a case',
    unlocked: false,
    reward: 75
  },
  {
    id: 'wealthy_judge',
    name: 'Wealthy Judge',
    description: 'Accumulate 500 coins',
    unlocked: false,
    reward: 100
  },
  {
    id: 'customizer',
    name: 'Customization Expert',
    description: 'Purchase 5 customization items',
    unlocked: false,
    reward: 50
  },
  {
    id: 'high_accuracy',
    name: 'Justice Prevails',
    description: 'Achieve 80% accuracy over 10+ cases',
    unlocked: false,
    reward: 200
  },
  {
    id: 'hard_case_master',
    name: 'Master Judge',
    description: 'Complete a hard case correctly',
    unlocked: false,
    reward: 150
  }
];
