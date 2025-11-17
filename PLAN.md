# Court Justice Game - Comprehensive Implementation Plan

## 1. Project Overview

### 1.1 Game Concept
A courtroom judgment simulation game where players act as a judge, evaluating evidence, testimonies, and visual clues to determine guilt or innocence. Success earns coins for customization, while mistakes cost coins.

### 1.2 Core Mechanics
- **Judgment System**: Binary guilty/not guilty decisions
- **Evidence Analysis**: Review prosecutor arguments, defense arguments, and jury input
- **Visual Detective Work**: Hidden body language/appearance clues on characters
- **Economy**: +50 coins for correct verdicts, -10 coins for incorrect verdicts
- **Customization**: Spend coins on courtroom aesthetics and gavel designs

### 1.3 Technical Stack
- **Framework**: React 19+ with TypeScript
- **Build Tool**: Vite
- **Storage**: IndexedDB (primary) + localStorage (settings backup)
- **Styling**: Tailwind CSS or styled-components
- **State Management**: React Context API + useReducer
- **Animations**: Framer Motion or React Spring

---

## 2. Project Structure

```
court-justice-game/
├── public/
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       │   ├── courtroom-backgrounds/
│       │   ├── characters/
│       │   ├── gavels/
│       │   └── ui-elements/
│       └── sounds/
│           ├── gavel-bang.mp3
│           ├── correct-verdict.mp3
│           └── incorrect-verdict.mp3
├── src/
│   ├── components/
│   │   ├── courtroom/
│   │   │   ├── Courtroom.tsx
│   │   │   ├── Judge.tsx
│   │   │   ├── Prosecutor.tsx
│   │   │   ├── Defendant.tsx
│   │   │   ├── DefenseLawyer.tsx
│   │   │   └── JuryPanel.tsx
│   │   ├── game/
│   │   │   ├── CaseView.tsx
│   │   │   ├── EvidencePanel.tsx
│   │   │   ├── TestimonyView.tsx
│   │   │   ├── VerdictPanel.tsx
│   │   │   └── ClueHighlight.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── CoinDisplay.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Notification.tsx
│   │   ├── shop/
│   │   │   ├── Shop.tsx
│   │   │   ├── CourtroomCustomizer.tsx
│   │   │   └── GavelGallery.tsx
│   │   ├── menu/
│   │   │   ├── MainMenu.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Statistics.tsx
│   │   └── layout/
│   │       ├── GameLayout.tsx
│   │       └── Header.tsx
│   ├── contexts/
│   │   ├── GameContext.tsx
│   │   ├── StorageContext.tsx
│   │   └── AudioContext.tsx
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   ├── useStorage.ts
│   │   ├── useCaseGenerator.ts
│   │   └── useAudio.ts
│   ├── services/
│   │   ├── storageService.ts
│   │   ├── caseGeneratorService.ts
│   │   └── audioService.ts
│   ├── types/
│   │   ├── game.types.ts
│   │   ├── case.types.ts
│   │   └── storage.types.ts
│   ├── utils/
│   │   ├── caseTemplates.ts
│   │   ├── clueGenerator.ts
│   │   └── validators.ts
│   ├── data/
│   │   ├── cases.json
│   │   ├── customizationItems.json
│   │   └── achievements.json
│   ├── styles/
│   │   ├── global.css
│   │   └── animations.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 3. Data Models & Type Definitions

### 3.1 Core Types (`types/game.types.ts`)

```typescript
export type Verdict = 'guilty' | 'not-guilty';
export type GameScreen = 'menu' | 'case' | 'shop' | 'statistics';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  currentScreen: GameScreen;
  coins: number;
  currentCase: Case | null;
  completedCases: number;
  correctVerdicts: number;
  incorrectVerdicts: number;
  customization: Customization;
  settings: Settings;
  achievements: Achievement[];
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
```

### 3.2 Case Types (`types/case.types.ts`)

```typescript
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
  timeLimit?: number; // optional time pressure in seconds
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
  weight: number; // 1-10 importance
  imageUrl?: string;
}

export interface Testimony {
  speaker: string;
  role: 'prosecutor' | 'defense';
  statement: string;
  credibility: number; // 1-10
  contradictions?: string[];
}

export interface JuryOpinion {
  jurorId: number;
  opinion: Verdict;
  confidence: number; // 1-10
}

export interface VisualClue {
  id: string;
  characterRole: 'prosecutor' | 'defense' | 'defendant';
  clueType: 'body-language' | 'appearance' | 'behavior';
  description: string;
  hint: string;
  pointsToGuilt: boolean;
  difficulty: Difficulty; // determines visibility
  position: { x: number; y: number; width: number; height: number }; // clickable area
}
```

### 3.3 Storage Types (`types/storage.types.ts`)

```typescript
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
```

---

## 4. Storage Service Implementation

### 4.1 IndexedDB Service (`services/storageService.ts`)

```typescript
class StorageService {
  private dbName = 'court-justice-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('gameState')) {
          db.createObjectStore('gameState', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('caseHistory')) {
          const caseStore = db.createObjectStore('caseHistory', { 
            keyPath: 'caseId', 
            autoIncrement: true 
          });
          caseStore.createIndex('completedAt', 'completedAt', { unique: false });
        }
        if (!db.objectStoreNames.contains('customization')) {
          db.createObjectStore('customization', { keyPath: 'id' });
        }
      };
    });
  }

  async saveGameState(state: GameState): Promise<void> {
    // Save to IndexedDB
    await this.put('gameState', { id: 'current', ...state });
    
    // Backup critical data to localStorage
    localStorage.setItem('gameState_backup', JSON.stringify({
      coins: state.coins,
      completedCases: state.completedCases,
      customization: state.customization
    }));
  }

  async loadGameState(): Promise<GameState | null> {
    try {
      const state = await this.get('gameState', 'current');
      return state || this.loadBackupState();
    } catch {
      return this.loadBackupState();
    }
  }

  private loadBackupState(): GameState | null {
    const backup = localStorage.getItem('gameState_backup');
    return backup ? JSON.parse(backup) : null;
  }

  async saveCaseHistory(caseResult: CompletedCase): Promise<void> {
    await this.put('caseHistory', caseResult);
  }

  async getCaseHistory(): Promise<CompletedCase[]> {
    return await this.getAll('caseHistory');
  }

  async saveCustomizationInventory(items: CustomizationItem[]): Promise<void> {
    for (const item of items) {
      await this.put('customization', item);
    }
  }

  async getCustomizationInventory(): Promise<CustomizationItem[]> {
    return await this.getAll('customization');
  }

  // Generic IndexedDB operations
  private async get(storeName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async put(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getAll(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    const storeNames = ['gameState', 'caseHistory', 'customization'];
    for (const storeName of storeNames) {
      await this.clearStore(storeName);
    }
    localStorage.removeItem('gameState_backup');
  }

  private async clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const storageService = new StorageService();
```

---

## 5. Case Generation System

### 5.1 Case Templates (`data/cases.json`)

Create 20-30 predefined case templates with varying difficulty:

```json
[
  {
    "id": "case_001",
    "title": "The Stolen Necklace",
    "description": "A valuable diamond necklace was stolen from a jewelry store. The defendant was found near the scene.",
    "difficulty": "easy",
    "correctVerdict": "guilty",
    "prosecutorClues": [
      {
        "type": "sweating",
        "hint": "The prosecutor keeps wiping their forehead",
        "pointsToGuilt": true
      }
    ]
  }
]
```

### 5.2 Case Generator Service (`services/caseGeneratorService.ts`)

```typescript
class CaseGeneratorService {
  private caseTemplates: any[] = []; // Load from cases.json
  private usedCaseIds: Set<string> = new Set();

  async loadCases(): Promise<void> {
    // In a real implementation, import cases.json
    // For static hosting, embed cases directly or fetch from public folder
    const response = await fetch('/data/cases.json');
    this.caseTemplates = await response.json();
  }

  generateCase(difficulty: Difficulty, excludeUsedCases: boolean = true): Case {
    const availableCases = this.caseTemplates.filter(template => {
      const matchesDifficulty = template.difficulty === difficulty;
      const notUsed = !excludeUsedCases || !this.usedCaseIds.has(template.id);
      return matchesDifficulty && notUsed;
    });

    if (availableCases.length === 0) {
      // Reset used cases if all are exhausted
      this.usedCaseIds.clear();
      return this.generateCase(difficulty, false);
    }

    const template = availableCases[Math.floor(Math.random() * availableCases.length)];
    this.usedCaseIds.add(template.id);

    return this.buildCaseFromTemplate(template);
  }

  private buildCaseFromTemplate(template: any): Case {
    // Build prosecutor character with visual clues
    const prosecutor: Character = {
      name: this.generateName('prosecutor'),
      role: 'prosecutor',
      appearance: {
        sprite: '/assets/images/characters/prosecutor.png',
        position: { x: 100, y: 200 }
      },
      bodyLanguage: this.generateBodyLanguage(template.correctVerdict === 'guilty')
    };

    // Build defendant
    const defendant: Character = {
      name: this.generateName('defendant'),
      role: 'defendant',
      appearance: {
        sprite: '/assets/images/characters/defendant.png',
        position: { x: 500, y: 200 }
      },
      bodyLanguage: this.generateBodyLanguage(template.correctVerdict === 'not-guilty')
    };

    // Build defense lawyer
    const defenseLawyer: Character = {
      name: this.generateName('defense'),
      role: 'defense',
      appearance: {
        sprite: '/assets/images/characters/defense-lawyer.png',
        position: { x: 400, y: 200 }
      },
      bodyLanguage: this.generateBodyLanguage(template.correctVerdict === 'not-guilty')
    };

    // Generate evidence
    const evidence = this.generateEvidence(template);

    // Generate testimonies
    const testimonies = this.generateTestimonies(template);

    // Generate jury opinions (should be mixed and not always correct)
    const juryOpinions = this.generateJuryOpinions(template.correctVerdict);

    // Generate visual clues on prosecutor
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

  private generateBodyLanguage(shouldBeNervous: boolean): BodyLanguage {
    return {
      nervous: shouldBeNervous && Math.random() > 0.3,
      confident: !shouldBeNervous && Math.random() > 0.3,
      fidgeting: shouldBeNervous && Math.random() > 0.5,
      eyeContact: !shouldBeNervous || Math.random() > 0.6,
      sweating: shouldBeNervous && Math.random() > 0.4
    };
  }

  private generateVisualClues(template: any, character: Character): VisualClue[] {
    const clues: VisualClue[] = [];

    if (template.prosecutorClues) {
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
      'sweating': { x: 120, y: 180, width: 40, height: 40 }, // forehead area
      'fidgeting': { x: 100, y: 250, width: 60, height: 60 }, // hands area
      'nervous-eyes': { x: 115, y: 195, width: 30, height: 20 }, // eyes area
    };

    return positions[clueType] || { x: 100, y: 200, width: 50, height: 50 };
  }

  private generateEvidence(template: any): Evidence[] {
    // Generate 3-5 pieces of evidence based on template
    return template.evidence || [];
  }

  private generateTestimonies(template: any): Testimony[] {
    // Generate prosecutor and defense testimonies
    return template.testimonies || [];
  }

  private generateJuryOpinions(correctVerdict: Verdict): JuryOpinion[] {
    const opinions: JuryOpinion[] = [];
    
    // Generate 12 juror opinions with variety
    for (let i = 0; i < 12; i++) {
      const agreesWithCorrect = Math.random() > 0.3; // 70% agreement
      opinions.push({
        jurorId: i + 1,
        opinion: agreesWithCorrect ? correctVerdict : (correctVerdict === 'guilty' ? 'not-guilty' : 'guilty'),
        confidence: Math.floor(Math.random() * 5) + 5 // 5-10
      });
    }

    return opinions;
  }

  private generateName(role: string): string {
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
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
```

---

## 6. Game State Management

### 6.1 Game Context (`contexts/GameContext.tsx`)

```typescript
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startNewCase: () => void;
  submitVerdict: (verdict: Verdict) => void;
  purchaseItem: (itemId: string) => boolean;
  equipItem: (itemId: string, category: string) => void;
}

type GameAction =
  | { type: 'SET_SCREEN'; payload: GameScreen }
  | { type: 'START_CASE'; payload: Case }
  | { type: 'SUBMIT_VERDICT'; payload: { verdict: Verdict; case: Case } }
  | { type: 'ADD_COINS'; payload: number }
  | { type: 'SUBTRACT_COINS'; payload: number }
  | { type: 'PURCHASE_ITEM'; payload: string }
  | { type: 'EQUIP_ITEM'; payload: { itemId: string; category: string } }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> };

const initialState: GameState = {
  currentScreen: 'menu',
  coins: 100, // Starting coins
  currentCase: null,
  completedCases: 0,
  correctVerdicts: 0,
  incorrectVerdicts: 0,
  customization: {
    courtroomTheme: 'classic',
    gavelDesign: 'default',
    judgeRobe: 'default',
    benchDecoration: 'none'
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'medium',
    hintHighlightEnabled: true
  },
  achievements: []
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };

    case 'START_CASE':
      return { ...state, currentCase: action.payload, currentScreen: 'case' };

    case 'SUBMIT_VERDICT': {
      const { verdict, case: currentCase } = action.payload;
      const isCorrect = verdict === currentCase.correctVerdict;
      const coinChange = isCorrect ? 50 : -10;

      return {
        ...state,
        coins: Math.max(0, state.coins + coinChange),
        completedCases: state.completedCases + 1,
        correctVerdicts: state.correctVerdicts + (isCorrect ? 1 : 0),
        incorrectVerdicts: state.incorrectVerdicts + (isCorrect ? 0 : 1),
        currentCase: null
      };
    }

    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.payload };

    case 'SUBTRACT_COINS':
      return { ...state, coins: Math.max(0, state.coins - action.payload) };

    case 'EQUIP_ITEM': {
      const { itemId, category } = action.payload;
      return {
        ...state,
        customization: {
          ...state.customization,
          [category]: itemId
        }
      };
    }

    case 'LOAD_STATE':
      return { ...action.payload };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    default:
      return state;
  }
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const storageInitialized = useRef(false);

  // Initialize storage and load saved state
  useEffect(() => {
    const initializeStorage = async () => {
      if (storageInitialized.current) return;
      
      await storageService.init();
      const savedState = await storageService.loadGameState();
      
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', payload: savedState });
      }
      
      storageInitialized.current = true;
    };

    initializeStorage();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (storageInitialized.current) {
      storageService.saveGameState(state);
    }
  }, [state]);

  const startNewCase = () => {
    const newCase = caseGeneratorService.generateCase(state.settings.difficulty);
    dispatch({ type: 'START_CASE', payload: newCase });
  };

  const submitVerdict = async (verdict: Verdict) => {
    if (!state.currentCase) return;

    const isCorrect = verdict === state.currentCase.correctVerdict;
    
    // Save case result to history
    await storageService.saveCaseHistory({
      caseId: state.currentCase.id,
      verdict,
      correctVerdict: state.currentCase.correctVerdict,
      wasCorrect: isCorrect,
      coinsEarned: isCorrect ? 50 : -10,
      completedAt: new Date(),
      timeSpent: 0 // Can track this if needed
    });

    dispatch({ type: 'SUBMIT_VERDICT', payload: { verdict, case: state.currentCase } });
  };

  const purchaseItem = (itemId: string): boolean => {
    // Load item data and check if player can afford it
    // Return true if purchase successful
    return false; // Placeholder
  };

  const equipItem = (itemId: string, category: string) => {
    dispatch({ type: 'EQUIP_ITEM', payload: { itemId, category } });
  };

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startNewCase,
      submitVerdict,
      purchaseItem,
      equipItem
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
```

---

## 7. Component Implementations

### 7.1 Main App Component (`App.tsx`)

```typescript
function App() {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'menu':
        return <MainMenu />;
      case 'case':
        return <CaseView />;
      case 'shop':
        return <Shop />;
      case 'statistics':
        return <Statistics />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="app min-h-screen bg-gray-900 text-white">
      <Header />
      {renderScreen()}
    </div>
  );
}
```

### 7.2 Main Menu (`components/menu/MainMenu.tsx`)

```typescript
export const MainMenu: React.FC = () => {
  const { startNewCase, dispatch, state } = useGame();

  return (
    <div className="main-menu flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-6xl font-bold mb-8 text-yellow-400">Court Justice</h1>
      
      <div className="flex flex-col gap-4 w-64">
        <Button onClick={startNewCase} variant="primary" size="lg">
          New Case
        </Button>
        
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'shop' })} variant="secondary" size="lg">
          Shop
        </Button>
        
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'statistics' })} variant="secondary" size="lg">
          Statistics
        </Button>
      </div>

      <CoinDisplay coins={state.coins} className="absolute top-4 right-4" />
    </div>
  );
};
```

### 7.3 Case View (`components/game/CaseView.tsx`)

```typescript
export const CaseView: React.FC = () => {
  const { state, submitVerdict } = useGame();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'evidence' | 'testimonies' | 'jury'>('overview');
  const [discoveredClues, setDiscoveredClues] = useState<Set<string>>(new Set());
  const [showVerdictPanel, setShowVerdictPanel] = useState(false);

  if (!state.currentCase) return null;

  const handleClueClick = (clue: VisualClue) => {
    setDiscoveredClues(prev => new Set([...prev, clue.id]));
    // Show notification about discovered clue
  };

  const handleSubmitVerdict = (verdict: Verdict) => {
    submitVerdict(verdict);
    setShowVerdictPanel(false);
  };

  return (
    <div className="case-view flex flex-col h-screen">
      {/* Courtroom scene */}
      <Courtroom 
        case={state.currentCase}
        onClueClick={handleClueClick}
        discoveredClues={discoveredClues}
        hintMode={state.settings.hintHighlightEnabled}
      />

      {/* Information panel */}
      <div className="info-panel bg-gray-800 p-6 border-t-2 border-yellow-600">
        {/* Tab navigation */}
        <div className="tabs flex gap-4 mb-4">
          <button 
            className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Case Overview
          </button>
          <button 
            className={`tab ${selectedTab === 'evidence' ? 'active' : ''}`}
            onClick={() => setSelectedTab('evidence')}
          >
            Evidence ({state.currentCase.evidence.length})
          </button>
          <button 
            className={`tab ${selectedTab === 'testimonies' ? 'active' : ''}`}
            onClick={() => setSelectedTab('testimonies')}
          >
            Testimonies ({state.currentCase.testimonies.length})
          </button>
          <button 
            className={`tab ${selectedTab === 'jury' ? 'active' : ''}`}
            onClick={() => setSelectedTab('jury')}
          >
            Jury Opinion
          </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {selectedTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">{state.currentCase.title}</h2>
              <p className="text-gray-300">{state.currentCase.description}</p>
              <div className="discovered-clues mt-4">
                <h3 className="font-semibold">Discovered Clues: {discoveredClues.size}</h3>
              </div>
            </div>
          )}

          {selectedTab === 'evidence' && (
            <EvidencePanel evidence={state.currentCase.evidence} />
          )}

          {selectedTab === 'testimonies' && (
            <TestimonyView testimonies={state.currentCase.testimonies} />
          )}

          {selectedTab === 'jury' && (
            <JuryPanel opinions={state.currentCase.juryOpinions} />
          )}
        </div>

        {/* Verdict button */}
        <Button 
          onClick={() => setShowVerdictPanel(true)}
          variant="primary"
          size="lg"
          className="mt-6 w-full"
        >
          Render Verdict
        </Button>
      </div>

      {/* Verdict modal */}
      {showVerdictPanel && (
        <VerdictPanel 
          onSubmit={handleSubmitVerdict}
          onCancel={() => setShowVerdictPanel(false)}
        />
      )}
    </div>
  );
};
```

### 7.4 Courtroom Component (`components/courtroom/Courtroom.tsx`)

```typescript
interface CourtroomProps {
  case: Case;
  onClueClick: (clue: VisualClue) => void;
  discoveredClues: Set<string>;
  hintMode: boolean;
}

export const Courtroom: React.FC<CourtroomProps> = ({ 
  case: currentCase, 
  onClueClick, 
  discoveredClues,
  hintMode 
}) => {
  const [hoveredClue, setHoveredClue] = useState<string | null>(null);

  return (
    <div className="courtroom relative w-full h-96 bg-cover bg-center" 
         style={{ backgroundImage: 'url(/assets/images/courtroom-bg.png)' }}>
      
      {/* Prosecutor */}
      <div 
        className="character prosecutor absolute"
        style={{
          left: `${currentCase.prosecutor.appearance.position.x}px`,
          top: `${currentCase.prosecutor.appearance.position.y}px`
        }}
      >
        <img 
          src={currentCase.prosecutor.appearance.sprite} 
          alt="Prosecutor"
          className="w-32 h-48"
        />
        
        {/* Visual clue overlays */}
        {currentCase.visualClues.map(clue => {
          const isDiscovered = discoveredClues.has(clue.id);
          const showHint = hintMode && hoveredClue === clue.id;

          return (
            <div
              key={clue.id}
              className={`clue-hotspot absolute cursor-pointer ${
                isDiscovered ? 'opacity-50' : 'hover:bg-yellow-400 hover:bg-opacity-30'
              }`}
              style={{
                left: `${clue.position.x - currentCase.prosecutor.appearance.position.x}px`,
                top: `${clue.position.y - currentCase.prosecutor.appearance.position.y}px`,
                width: `${clue.position.width}px`,
                height: `${clue.position.height}px`,
                border: showHint ? '2px solid yellow' : 'none'
              }}
              onClick={() => !isDiscovered && onClueClick(clue)}
              onMouseEnter={() => setHoveredClue(clue.id)}
              onMouseLeave={() => setHoveredClue(null)}
            >
              {showHint && (
                <div className="hint-tooltip absolute bg-black text-white p-2 rounded text-xs -top-10 left-0 w-48">
                  {clue.hint}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Defendant */}
      <div 
        className="character defendant absolute"
        style={{
          left: `${currentCase.defendant.appearance.position.x}px`,
          top: `${currentCase.defendant.appearance.position.y}px`
        }}
      >
        <img 
          src={currentCase.defendant.appearance.sprite} 
          alt="Defendant"
          className="w-32 h-48"
        />
      </div>

      {/* Defense Lawyer */}
      <div 
        className="character defense-lawyer absolute"
        style={{
          left: `${currentCase.defenseLawyer.appearance.position.x}px`,
          top: `${currentCase.defenseLawyer.appearance.position.y}px`
        }}
      >
        <img 
          src={currentCase.defenseLawyer.appearance.sprite} 
          alt="Defense Lawyer"
          className="w-32 h-48"
        />
      </div>

      {/* Judge's gavel (bottom center) */}
      <div className="gavel absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <img 
          src="/assets/images/gavels/default.png" 
          alt="Gavel"
          className="w-16 h-16"
        />
      </div>
    </div>
  );
};
```

### 7.5 Verdict Panel (`components/game/VerdictPanel.tsx`)

```typescript
interface VerdictPanelProps {
  onSubmit: (verdict: Verdict) => void;
  onCancel: () => void;
}

export const VerdictPanel: React.FC<VerdictPanelProps> = ({ onSubmit, onCancel }) => {
  const [selectedVerdict, setSelectedVerdict] = useState<Verdict | null>(null);

  return (
    <Modal onClose={onCancel}>
      <div className="verdict-panel bg-gray-800 p-8 rounded-lg max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Render Your Verdict
        </h2>

        <div className="verdict-options flex flex-col gap-4 mb-6">
          <button
            className={`verdict-btn p-6 rounded-lg text-xl font-semibold transition-all ${
              selectedVerdict === 'guilty' 
                ? 'bg-red-600 ring-4 ring-red-400' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setSelectedVerdict('guilty')}
          >
            GUILTY
          </button>

          <button
            className={`verdict-btn p-6 rounded-lg text-xl font-semibold transition-all ${
              selectedVerdict === 'not-guilty' 
                ? 'bg-green-600 ring-4 ring-green-400' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setSelectedVerdict('not-guilty')}
          >
            NOT GUILTY
          </button>
        </div>

        <div className="actions flex gap-4">
          <Button 
            onClick={onCancel} 
            variant="secondary" 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => selectedVerdict && onSubmit(selectedVerdict)}
            variant="primary"
            className="flex-1"
            disabled={!selectedVerdict}
          >
            Submit Verdict
          </Button>
        </div>
      </div>
    </Modal>
  );
};
```

### 7.6 Shop Component (`components/shop/Shop.tsx`)

```typescript
export const Shop: React.FC = () => {
  const { state, purchaseItem, equipItem, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'courtroom' | 'gavel' | 'robe' | 'decoration'>('gavel');
  const [inventory, setInventory] = useState<CustomizationItem[]>([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const items = await storageService.getCustomizationInventory();
    setInventory(items);
  };

  const handlePurchase = (item: CustomizationItem) => {
    if (state.coins >= item.price && !item.owned) {
      const success = purchaseItem(item.id);
      if (success) {
        // Update local inventory
        setInventory(prev => 
          prev.map(i => i.id === item.id ? { ...i, owned: true } : i)
        );
      }
    }
  };

  const filteredItems = inventory.filter(item => item.category === selectedCategory);

  return (
    <div className="shop p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Customization Shop</h1>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}>
          Back to Menu
        </Button>
      </div>

      <CoinDisplay coins={state.coins} className="mb-6" />

      {/* Category tabs */}
      <div className="categories flex gap-4 mb-6">
        {['gavel', 'courtroom', 'robe', 'decoration'].map(cat => (
          <button
            key={cat}
            className={`category-tab px-6 py-3 rounded-lg ${
              selectedCategory === cat ? 'bg-yellow-600' : 'bg-gray-700'
            }`}
            onClick={() => setSelectedCategory(cat as any)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="items-grid grid grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className="item-card bg-gray-800 p-4 rounded-lg"
          >
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-3">{item.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 font-semibold">{item.price} coins</span>
              
              {item.owned ? (
                <Button 
                  onClick={() => equipItem(item.id, item.category)}
                  variant="secondary"
                  size="sm"
                >
                  Equip
                </Button>
              ) : (
                <Button 
                  onClick={() => handlePurchase(item)}
                  variant="primary"
                  size="sm"
                  disabled={state.coins < item.price}
                >
                  Buy
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 8. UI Components

### 8.1 Button Component (`components/ui/Button.tsx`)

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all';
  
  const variantStyles = {
    primary: 'bg-yellow-600 hover:bg-yellow-500 text-black',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### 8.2 Modal Component (`components/ui/Modal.tsx`)

```typescript
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div 
      className="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
```

### 8.3 Coin Display (`components/ui/CoinDisplay.tsx`)

```typescript
interface CoinDisplayProps {
  coins: number;
  className?: string;
}

export const CoinDisplay: React.FC<CoinDisplayProps> = ({ coins, className = '' }) => {
  return (
    <div className={`coin-display flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg ${className}`}>
      <span className="coin-icon text-2xl">🪙</span>
      <span className="coin-amount text-xl font-bold text-yellow-400">{coins}</span>
    </div>
  );
};
```

---

## 9. Audio System

### 9.1 Audio Service (`services/audioService.ts`)

```typescript
class AudioService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private musicTrack: HTMLAudioElement | null = null;
  private soundEnabled = true;
  private musicEnabled = true;

  preloadSounds() {
    const soundFiles = {
      gavelBang: '/assets/sounds/gavel-bang.mp3',
      correctVerdict: '/assets/sounds/correct-verdict.mp3',
      incorrectVerdict: '/assets/sounds/incorrect-verdict.mp3',
      coinEarn: '/assets/sounds/coin-earn.mp3',
      buttonClick: '/assets/sounds/button-click.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  playSound(soundName: string) {
    if (!this.soundEnabled) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  playMusic(trackPath: string) {
    if (!this.musicEnabled) return;

    if (this.musicTrack) {
      this.musicTrack.pause();
    }

    this.musicTrack = new Audio(trackPath);
    this.musicTrack.loop = true;
    this.musicTrack.volume = 0.3;
    this.musicTrack.play().catch(() => {});
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.musicTrack) {
      this.musicTrack.pause();
    }
  }
}

export const audioService = new AudioService();
```

---

## 10. Customization Data

### 10.1 Customization Items (`data/customizationItems.json`)

```json
[
  {
    "id": "gavel_golden",
    "category": "gavel",
    "name": "Golden Gavel",
    "description": "A prestigious golden gavel for the distinguished judge",
    "price": 200,
    "imageUrl": "/assets/images/gavels/golden.png"
  },
  {
    "id": "gavel_crystal",
    "category": "gavel",
    "name": "Crystal Gavel",
    "description": "An elegant crystal gavel that shimmers",
    "price": 350,
    "imageUrl": "/assets/images/gavels/crystal.png"
  },
  {
    "id": "courtroom_modern",
    "category": "courtroom",
    "name": "Modern Courtroom",
    "description": "A sleek, contemporary courtroom design",
    "price": 500,
    "imageUrl": "/assets/images/courtroom-backgrounds/modern.png"
  },
  {
    "id": "courtroom_gothic",
    "category": "courtroom",
    "name": "Gothic Courtroom",
    "description": "A dramatic, gothic-style courtroom",
    "price": 600,
    "imageUrl": "/assets/images/courtroom-backgrounds/gothic.png"
  },
  {
    "id": "robe_red",
    "category": "robe",
    "name": "Crimson Robe",
    "description": "A striking red judicial robe",
    "price": 300,
    "imageUrl": "/assets/images/robes/red.png"
  },
  {
    "id": "decoration_flag",
    "category": "decoration",
    "name": "National Flag",
    "description": "Add a flag behind the judge's bench",
    "price": 150,
    "imageUrl": "/assets/images/decorations/flag.png"
  }
]
```

---

## 11. Styling Guidelines

### 11.1 Color Palette

```css
:root {
  /* Primary colors */
  --color-primary: #EAB308; /* Yellow-600 for accents */
  --color-primary-dark: #CA8A04; /* Yellow-700 */
  
  /* Background colors */
  --color-bg-dark: #111827; /* Gray-900 */
  --color-bg-medium: #1F2937; /* Gray-800 */
  --color-bg-light: #374151; /* Gray-700 */
  
  /* Text colors */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #D1D5DB; /* Gray-300 */
  --color-text-muted: #9CA3AF; /* Gray-400 */
  
  /* Status colors */
  --color-success: #10B981; /* Green-500 */
  --color-danger: #EF4444; /* Red-500 */
  --color-warning: #F59E0B; /* Amber-500 */
}
```

### 11.2 Animations (`styles/animations.css`)

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.clue-discovered {
  animation: pulse 0.5s ease-out;
}
```

---

## 12. Verdict Feedback System

### 12.1 Result Modal (`components/game/ResultModal.tsx`)

```typescript
interface ResultModalProps {
  isCorrect: boolean;
  correctVerdict: Verdict;
  playerVerdict: Verdict;
  coinsEarned: number;
  onContinue: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isCorrect,
  correctVerdict,
  playerVerdict,
  coinsEarned,
  onContinue
}) => {
  useEffect(() => {
    audioService.playSound(isCorrect ? 'correctVerdict' : 'incorrectVerdict');
    if (isCorrect) {
      audioService.playSound('coinEarn');
    }
  }, [isCorrect]);

  return (
    <Modal onClose={onContinue}>
      <div className={`result-modal p-8 rounded-lg ${isCorrect ? 'bg-green-900' : 'bg-red-900'}`}>
        <h2 className="text-4xl font-bold mb-4 text-center">
          {isCorrect ? '⚖️ Correct Verdict!' : '❌ Incorrect Verdict'}
        </h2>

        <div className="verdict-comparison mb-6">
          <p className="text-xl mb-2">Your verdict: <strong>{playerVerdict.toUpperCase()}</strong></p>
          <p className="text-xl">Correct verdict: <strong>{correctVerdict.toUpperCase()}</strong></p>
        </div>

        <div className="coins-earned text-center mb-6">
          <p className="text-3xl font-bold text-yellow-400">
            {coinsEarned > 0 ? '+' : ''}{coinsEarned} coins
          </p>
        </div>

        {!isCorrect && (
          <div className="explanation bg-gray-800 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">Why this verdict was correct:</h3>
            <p className="text-gray-300">
              {/* Provide brief explanation based on case details */}
            </p>
          </div>
        )}

        <Button onClick={onContinue} variant="primary" size="lg" className="w-full">
          Continue
        </Button>
      </div>
    </Modal>
  );
};
```

---

## 13. Statistics & Progress Tracking

### 13.1 Statistics Component (`components/menu/Statistics.tsx`)

```typescript
export const Statistics: React.FC = () => {
  const { state, dispatch } = useGame();
  const [caseHistory, setCaseHistory] = useState<CompletedCase[]>([]);

  useEffect(() => {
    loadCaseHistory();
  }, []);

  const loadCaseHistory = async () => {
    const history = await storageService.getCaseHistory();
    setCaseHistory(history.reverse()); // Most recent first
  };

  const winRate = state.completedCases > 0 
    ? ((state.correctVerdicts / state.completedCases) * 100).toFixed(1)
    : '0';

  return (
    <div className="statistics p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Your Statistics</h1>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}>
          Back to Menu
        </Button>
      </div>

      {/* Overall stats */}
      <div className="stats-grid grid grid-cols-4 gap-4 mb-8">
        <div className="stat-card bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Total Cases</h3>
          <p className="text-4xl font-bold">{state.completedCases}</p>
        </div>

        <div className="stat-card bg-green-900 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Correct Verdicts</h3>
          <p className="text-4xl font-bold">{state.correctVerdicts}</p>
        </div>

        <div className="stat-card bg-red-900 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Incorrect Verdicts</h3>
          <p className="text-4xl font-bold">{state.incorrectVerdicts}</p>
        </div>

        <div className="stat-card bg-yellow-900 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Win Rate</h3>
          <p className="text-4xl font-bold">{winRate}%</p>
        </div>
      </div>

      {/* Case history */}
      <div className="case-history">
        <h2 className="text-2xl font-bold mb-4">Recent Cases</h2>
        <div className="history-list space-y-2">
          {caseHistory.slice(0, 10).map((case_record, index) => (
            <div 
              key={index}
              className={`history-item p-4 rounded-lg ${
                case_record.wasCorrect ? 'bg-green-900' : 'bg-red-900'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{case_record.caseId}</span>
                <span>{case_record.wasCorrect ? '✓' : '✗'} {case_record.verdict}</span>
                <span className="text-yellow-400">{case_record.coinsEarned > 0 ? '+' : ''}{case_record.coinsEarned} coins</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 14. Performance Optimizations

### 14.1 Image Loading Strategy
- Use lazy loading for character sprites and backgrounds
- Preload critical game assets during initial load
- Implement image sprites for UI elements
- Compress images to WebP format

### 14.2 Storage Optimization
- Batch IndexedDB writes to minimize transactions
- Implement debouncing for frequent state updates
- Use localStorage only for critical backup data
- Compress case history data if it grows large

### 14.3 React Optimizations
- Use React.memo for expensive components
- Implement useMemo for computed values
- Use useCallback for event handlers passed to child components
- Virtualize long lists (e.g., case history)

---

## 15. Build Configuration

### 15.1 Vite Config (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // For static hosting
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'game-logic': ['./src/services/caseGeneratorService.ts', './src/services/storageService.ts']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
```

### 15.2 TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 16. Deployment Checklist

1. **Build the project**: `npm run build`
2. **Test locally**: `npm run preview`
3. **Verify storage functionality**: Test in incognito mode
4. **Check asset loading**: Ensure all images/sounds load correctly
5. **Test on mobile**: Verify responsive design works
6. **Deploy to static host**: Upload `dist` folder to Netlify/Vercel/GitHub Pages
7. **Verify HTTPS**: Required for IndexedDB in some browsers
8. **Test persistence**: Close and reopen app to verify save/load

---

## 17. Additional Features (Optional Enhancements)

### 17.1 Progressive Difficulty
- Track player performance
- Automatically adjust difficulty based on win rate
- Unlock harder cases after achieving milestones

### 17.2 Daily Challenges
- Generate special cases with bonus rewards
- Store challenge completion in IndexedDB
- Reset daily at midnight (using local time)

### 17.3 Achievements System
- Unlock achievements for milestones (10 cases, 50 cases, etc.)
- Perfect streak achievements
- Speed run achievements
- Award bonus coins for achievements

### 17.4 Tutorial Mode
- Interactive tutorial for first-time players
- Highlight clickable areas
- Explain evidence evaluation
- Guided first case

### 17.5 Hint System
- Allow players to spend coins for hints
- Reveal one clue location
- Show evidence reliability ratings
- Limited hints per case

---

## 18. Testing Strategy

### 18.1 Unit Tests
- Test case generator service
- Test storage service CRUD operations
- Test game state reducer logic
- Test coin calculation logic

### 18.2 Integration Tests
- Test complete case flow (start → verdict → result)
- Test customization purchase and equip flow
- Test storage persistence across sessions
- Test statistics calculation accuracy

### 18.3 Manual Testing Checklist
- [ ] Can start a new case
- [ ] Can discover visual clues
- [ ] Can review all evidence
- [ ] Can submit verdict and receive correct feedback
- [ ] Coins are correctly awarded/deducted
- [ ] Can purchase and equip customization items
- [ ] Game state persists after page reload
- [ ] Statistics display correctly
- [ ] All audio plays correctly
- [ ] Responsive on mobile devices

---

## 19. Implementation Priority Order

1. **Phase 1 - Core Foundation** (Day 1-2)
   - Set up Vite + React + TypeScript project
   - Implement type definitions
   - Create storage service with IndexedDB
   - Build basic game context and state management

2. **Phase 2 - Basic Gameplay** (Day 3-4)
   - Implement case generator service
   - Create main menu component
   - Build courtroom view with character display
   - Implement basic verdict submission flow

3. **Phase 3 - Evidence System** (Day 5)
   - Create evidence panel component
   - Build testimony view
   - Implement jury opinion display
   - Add visual clue detection system

4. **Phase 4 - Economy & Customization** (Day 6)
   - Implement coin system
   - Build shop interface
   - Create customization inventory
   - Add equip/apply customization logic

5. **Phase 5 - Polish & Feedback** (Day 7)
   - Add result modal with animations
   - Implement statistics page
   - Add audio system
   - Create UI animations and transitions

6. **Phase 6 - Testing & Deployment** (Day 8)
   - Comprehensive testing
   - Fix bugs
   - Optimize performance
   - Deploy to static host

---

## 20. Final Notes

This comprehensive plan provides everything needed to build the Court Justice game. The implementation should be straightforward for an LLM to follow, with clear separation of concerns, well-defined interfaces, and modular components.

Key success factors:
- **Static hosting compatible**: All data stored client-side
- **Type-safe**: Full TypeScript coverage
- **Maintainable**: Clear component hierarchy and service separation
- **Extensible**: Easy to add new cases, customization items, and features
- **Performance**: Optimized loading and storage strategies
- **User-friendly**: Clear UI/UX with helpful feedback

The game loop is simple but engaging: evaluate evidence → make judgment → earn/lose coins → customize → repeat. The visual clue detection adds an interactive detective element, while the customization system provides long-term progression goals.