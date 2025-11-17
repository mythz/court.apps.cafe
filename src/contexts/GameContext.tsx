import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { GameState, GameScreen, Settings, Verdict } from '../types/game.types';
import type { Case } from '../types/case.types';
import { storageService } from '../services/storageService';
import { caseGeneratorService } from '../services/caseGeneratorService';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startNewCase: () => void;
  submitVerdict: (verdict: Verdict) => Promise<void>;
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
  coins: 100,
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

  useEffect(() => {
    const initializeStorage = async () => {
      if (storageInitialized.current) return;

      await storageService.init();
      await caseGeneratorService.loadCases();

      const savedState = await storageService.loadGameState();

      if (savedState) {
        dispatch({ type: 'LOAD_STATE', payload: savedState });
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

  const submitVerdict = async (verdict: Verdict) => {
    if (!state.currentCase) return;

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
  };

  const purchaseItem = (itemId: string): boolean => {
    return false;
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
