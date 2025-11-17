import type { Verdict, Difficulty } from './game.types';

export interface Case {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  correctVerdict: Verdict;
  prosecutor: Character;
  defenseLawyer: Character;
  defendant: Character;
  evidence: Evidence[];
  testimonies: Testimony[];
  juryOpinions: JuryOpinion[];
  visualClues: VisualClue[];
  timeLimit?: number;
}

export interface Character {
  name: string;
  role: 'prosecutor' | 'defense' | 'defendant';
  appearance: {
    sprite: string;
    position: { x: number; y: number };
  };
  bodyLanguage: BodyLanguage;
}

export interface BodyLanguage {
  nervous: boolean;
  confident: boolean;
  fidgeting: boolean;
  eyeContact: boolean;
  sweating: boolean;
}

export interface Evidence {
  id: string;
  type: 'physical' | 'documentary' | 'testimony';
  title: string;
  description: string;
  pointsToGuilt: boolean;
  weight: number;
  imageUrl?: string;
}

export interface Testimony {
  speaker: string;
  role: 'prosecutor' | 'defense';
  statement: string;
  credibility: number;
  contradictions?: string[];
}

export interface JuryOpinion {
  jurorId: number;
  opinion: Verdict;
  confidence: number;
}

export interface VisualClue {
  id: string;
  characterRole: 'prosecutor' | 'defense' | 'defendant';
  clueType: 'body-language' | 'appearance' | 'behavior';
  description: string;
  hint: string;
  pointsToGuilt: boolean;
  difficulty: Difficulty;
  position: { x: number; y: number; width: number; height: number };
}
