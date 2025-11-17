import type { Case, Character, BodyLanguage, Evidence, Testimony, JuryOpinion, VisualClue } from '../types/case.types';
import type { Difficulty, Verdict } from '../types/game.types';

interface CaseTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  correctVerdict: Verdict;
  prosecutorClues: any[];
  evidence: any[];
  testimonies: any[];
}

class CaseGeneratorService {
  private caseTemplates: CaseTemplate[] = [];
  private usedCaseIds: Set<string> = new Set();

  async loadCases(): Promise<void> {
    try {
      const response = await fetch('/data/cases.json');
      this.caseTemplates = await response.json();
    } catch (error) {
      console.error('Failed to load cases:', error);
    }
  }

  generateCase(difficulty: Difficulty, excludeUsedCases: boolean = true): Case {
    const availableCases = this.caseTemplates.filter(template => {
      const matchesDifficulty = template.difficulty === difficulty;
      const notUsed = !excludeUsedCases || !this.usedCaseIds.has(template.id);
      return matchesDifficulty && notUsed;
    });

    if (availableCases.length === 0) {
      this.usedCaseIds.clear();
      return this.generateCase(difficulty, false);
    }

    const template = availableCases[Math.floor(Math.random() * availableCases.length)];
    this.usedCaseIds.add(template.id);

    return this.buildCaseFromTemplate(template);
  }

  private buildCaseFromTemplate(template: CaseTemplate): Case {
    const prosecutor: Character = {
      name: this.generateName('prosecutor'),
      role: 'prosecutor',
      appearance: {
        sprite: '/assets/images/characters/prosecutor.png',
        position: { x: 100, y: 200 }
      },
      bodyLanguage: this.generateBodyLanguage(template.correctVerdict === 'guilty')
    };

    const defendant: Character = {
      name: this.generateName('defendant'),
      role: 'defendant',
      appearance: {
        sprite: '/assets/images/characters/defendant.png',
        position: { x: 500, y: 200 }
      },
      bodyLanguage: this.generateBodyLanguage(template.correctVerdict === 'not-guilty')
    };

    const defenseLawyer: Character = {
      name: this.generateName('defense'),
      role: 'defense',
      appearance: {
        sprite: '/assets/images/characters/defense-lawyer.png',
        position: { x: 400, y: 200 }
      },
      bodyLanguage: this.generateBodyLanguage(template.correctVerdict === 'not-guilty')
    };

    const evidence = this.generateEvidence(template);
    const testimonies = this.generateTestimonies(template);
    const juryOpinions = this.generateJuryOpinions(template.correctVerdict);
    const visualClues = this.generateVisualClues(template, prosecutor);

    return {
      id: template.id,
      title: template.title,
      description: template.description,
      difficulty: template.difficulty,
      correctVerdict: template.correctVerdict,
      prosecutor,
      defenseLawyer,
      defendant,
      evidence,
      testimonies,
      juryOpinions,
      visualClues
    };
  }

  private generateBodyLanguage(shouldBeConfident: boolean): BodyLanguage {
    return {
      nervous: !shouldBeConfident && Math.random() > 0.3,
      confident: shouldBeConfident && Math.random() > 0.3,
      fidgeting: !shouldBeConfident && Math.random() > 0.5,
      eyeContact: shouldBeConfident || Math.random() > 0.6,
      sweating: !shouldBeConfident && Math.random() > 0.4
    };
  }

  private generateVisualClues(template: CaseTemplate, character: Character): VisualClue[] {
    const clues: VisualClue[] = [];

    if (template.prosecutorClues && template.prosecutorClues.length > 0) {
      template.prosecutorClues.forEach((clue: any, index: number) => {
        clues.push({
          id: `clue_${index}`,
          characterRole: 'prosecutor',
          clueType: 'body-language',
          description: clue.hint,
          hint: clue.hint,
          pointsToGuilt: clue.pointsToGuilt,
          difficulty: template.difficulty,
          position: this.getCluePosition(clue.type)
        });
      });
    }

    return clues;
  }

  private getCluePosition(clueType: string): { x: number; y: number; width: number; height: number } {
    const positions: Record<string, any> = {
      'sweating': { x: 120, y: 180, width: 40, height: 40 },
      'fidgeting': { x: 100, y: 250, width: 60, height: 60 },
      'nervous-eyes': { x: 115, y: 195, width: 30, height: 20 },
      'confident': { x: 110, y: 190, width: 50, height: 50 }
    };

    return positions[clueType] || { x: 100, y: 200, width: 50, height: 50 };
  }

  private generateEvidence(template: CaseTemplate): Evidence[] {
    return template.evidence.map((ev: any) => ({
      ...ev
    }));
  }

  private generateTestimonies(template: CaseTemplate): Testimony[] {
    return template.testimonies.map((testimony: any) => ({
      ...testimony
    }));
  }

  private generateJuryOpinions(correctVerdict: Verdict): JuryOpinion[] {
    const opinions: JuryOpinion[] = [];

    for (let i = 0; i < 12; i++) {
      const agreesWithCorrect = Math.random() > 0.3;
      opinions.push({
        jurorId: i + 1,
        opinion: agreesWithCorrect ? correctVerdict : (correctVerdict === 'guilty' ? 'not-guilty' : 'guilty'),
        confidence: Math.floor(Math.random() * 5) + 5
      });
    }

    return opinions;
  }

  private generateName(role: string): string {
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  markCaseAsUsed(caseId: string): void {
    this.usedCaseIds.add(caseId);
  }

  resetUsedCases(): void {
    this.usedCaseIds.clear();
  }
}

export const caseGeneratorService = new CaseGeneratorService();
