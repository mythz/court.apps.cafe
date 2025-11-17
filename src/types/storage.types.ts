import type { GameState, Settings, Verdict } from './game.types';

export interface StorageSchema {
  gameState: GameState;
  caseHistory: CompletedCase[];
  customizationInventory: CustomizationItem[];
  settings: Settings;
  version: string;
}

export interface CompletedCase {
  caseId: string;
  verdict: Verdict;
  correctVerdict: Verdict;
  wasCorrect: boolean;
  coinsEarned: number;
  completedAt: Date;
  timeSpent: number;
}

export interface CustomizationItem {
  id: string;
  category: 'courtroom' | 'gavel' | 'robe' | 'decoration';
  name: string;
  description: string;
  price: number;
  owned: boolean;
  imageUrl: string;
}
