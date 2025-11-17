import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { GameState, GameScreen, Settings, Verdict, Achievement } from '../types/game.types';
import type { Case } from '../types/case.types';
import { storageService } from '../services/storageService';
import { caseGeneratorService } from '../services/caseGeneratorService';
import { ACHIEVEMENTS } from '../data/achievements';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startNewCase: () => void;
  submitVerdict: (verdict: Verdict) => Promise<{ isCorrect: boolean; newAchievements: Achievement[] }>;
  purchaseItem: (itemId: string, price: number) => boolean;
  equipItem: (itemId: string, category: string) => void;
  checkAchievements: () => Achievement[];
  completeTutorial: () => void;
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
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'COMPLETE_TUTORIAL' };

const initialState: GameState = {
  currentScreen: 'menu',
  coins: 100,
  currentCase: null,
  completedCases: 0,
  correctVerdicts: 0,
  incorrectVerdicts: 0,
  currentStreak: 0,
  bestStreak: 0,
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
  achievements: ACHIEVEMENTS,
  purchasedItems: [],
  tutorialCompleted: false
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
      const newStreak = isCorrect ? state.currentStreak + 1 : 0;

      return {
        ...state,
        coins: Math.max(0, state.coins + coinChange),
        completedCases: state.completedCases + 1,
        correctVerdicts: state.correctVerdicts + (isCorrect ? 1 : 0),
        incorrectVerdicts: state.incorrectVerdicts + (isCorrect ? 0 : 1),
        currentStreak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
        currentCase: null
      };
    }

    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.payload };

    case 'SUBTRACT_COINS':
      return { ...state, coins: Math.max(0, state.coins - action.payload) };

    case 'PURCHASE_ITEM':
      return {
        ...state,
        purchasedItems: [...state.purchasedItems, action.payload]
      };

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

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload
            ? { ...achievement, unlocked: true }
            : achievement
        )
      };

    case 'COMPLETE_TUTORIAL':
      return {
        ...state,
        tutorialCompleted: true
      };

    default:
      return state;
  }
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const storageInitialized = useRef(false);

  useEffect(() => {
    const initializeStorage = async () => {
      if (storageInitialized.current) return;

      await storageService.init();
      await caseGeneratorService.loadCases();

      const savedState = await storageService.loadGameState();

      if (savedState) {
        // Merge with new achievements in case they were added
        const mergedAchievements = ACHIEVEMENTS.map(newAch => {
          const savedAch = savedState.achievements?.find(a => a.id === newAch.id);
          return savedAch || newAch;
        });

        dispatch({
          type: 'LOAD_STATE',
          payload: {
            ...savedState,
            achievements: mergedAchievements,
            currentStreak: savedState.currentStreak || 0,
            bestStreak: savedState.bestStreak || 0,
            purchasedItems: savedState.purchasedItems || [],
            tutorialCompleted: savedState.tutorialCompleted || false
          }
        });
      }

      storageInitialized.current = true;
    };

    initializeStorage();
  }, []);

  useEffect(() => {
    if (storageInitialized.current) {
      storageService.saveGameState(state);
    }
  }, [state]);

  const startNewCase = () => {
    const newCase = caseGeneratorService.generateCase(state.settings.difficulty);
    dispatch({ type: 'START_CASE', payload: newCase });
  };

  const checkAchievements = (): Achievement[] => {
    const newlyUnlocked: Achievement[] = [];

    // Check each achievement
    state.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_case':
          shouldUnlock = state.completedCases >= 1;
          break;
        case 'five_cases':
          shouldUnlock = state.completedCases >= 5;
          break;
        case 'ten_cases':
          shouldUnlock = state.completedCases >= 10;
          break;
        case 'perfect_five':
          shouldUnlock = state.currentStreak >= 5;
          break;
        case 'perfect_ten':
          shouldUnlock = state.currentStreak >= 10;
          break;
        case 'wealthy_judge':
          shouldUnlock = state.coins >= 500;
          break;
        case 'customizer':
          shouldUnlock = state.purchasedItems.length >= 5;
          break;
        case 'high_accuracy':
          shouldUnlock = state.completedCases >= 10 &&
                        (state.correctVerdicts / state.completedCases) >= 0.8;
          break;
      }

      if (shouldUnlock) {
        newlyUnlocked.push(achievement);
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement.id });
        dispatch({ type: 'ADD_COINS', payload: achievement.reward });
      }
    });

    return newlyUnlocked;
  };

  const submitVerdict = async (verdict: Verdict) => {
    if (!state.currentCase) return { isCorrect: false, newAchievements: [] };

    const isCorrect = verdict === state.currentCase.correctVerdict;

    await storageService.saveCaseHistory({
      caseId: state.currentCase.id,
      verdict,
      correctVerdict: state.currentCase.correctVerdict,
      wasCorrect: isCorrect,
      coinsEarned: isCorrect ? 50 : -10,
      completedAt: new Date(),
      timeSpent: 0
    });

    dispatch({ type: 'SUBMIT_VERDICT', payload: { verdict, case: state.currentCase } });

    // Check for newly unlocked achievements
    const newAchievements = checkAchievements();

    return { isCorrect, newAchievements };
  };

  const purchaseItem = (itemId: string, price: number): boolean => {
    if (state.coins >= price && !state.purchasedItems.includes(itemId)) {
      dispatch({ type: 'SUBTRACT_COINS', payload: price });
      dispatch({ type: 'PURCHASE_ITEM', payload: itemId });
      checkAchievements();
      return true;
    }
    return false;
  };

  const equipItem = (itemId: string, category: string) => {
    dispatch({ type: 'EQUIP_ITEM', payload: { itemId, category } });
  };

  const completeTutorial = () => {
    dispatch({ type: 'COMPLETE_TUTORIAL' });
  };

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startNewCase,
      submitVerdict,
      purchaseItem,
      equipItem,
      checkAchievements,
      completeTutorial
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
