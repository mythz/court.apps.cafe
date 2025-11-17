export type Verdict = 'guilty' | 'not-guilty';
export type GameScreen = 'menu' | 'case' | 'shop' | 'statistics' | 'achievements' | 'settings';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  currentScreen: GameScreen;
  coins: number;
  currentCase: Case | null;
  completedCases: number;
  correctVerdicts: number;
  incorrectVerdicts: number;
  currentStreak: number;
  bestStreak: number;
  customization: Customization;
  settings: Settings;
  achievements: Achievement[];
  purchasedItems: string[];
  tutorialCompleted: boolean;
}

export interface Customization {
  courtroomTheme: string;
  gavelDesign: string;
  judgeRobe: string;
  benchDecoration: string;
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: Difficulty;
  hintHighlightEnabled: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  reward: number;
}

// Import Case type from case.types.ts
import type { Case } from './case.types';
