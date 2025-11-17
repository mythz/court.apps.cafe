import React from 'react';
import { Button } from '../ui/Button';
import { useGame } from '../../contexts/GameContext';

export const MainMenu: React.FC = () => {
  const { state, startNewCase, dispatch } = useGame();

  const unlockedAchievements = state.achievements.filter(a => a.unlocked).length;

  return (
    <div className="main-menu flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-6xl font-bold mb-4 text-yellow-400">Court Justice</h1>

      {/* Streak Display */}
      {state.currentStreak > 0 && (
        <div className="mb-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg animate-pulse">
          <div className="text-sm text-gray-200">Current Streak</div>
          <div className="text-3xl font-bold">🔥 {state.currentStreak}</div>
        </div>
      )}

      {state.bestStreak > 0 && (
        <div className="mb-6 text-center">
          <div className="text-sm text-gray-400">Best Streak: {state.bestStreak}</div>
        </div>
      )}

      <div className="flex flex-col gap-4 w-64 mb-6">
        <Button onClick={startNewCase} variant="primary" size="lg">
          New Case
        </Button>

        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'shop' })} variant="secondary" size="lg">
          🛒 Shop
        </Button>

        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'statistics' })} variant="secondary" size="lg">
          📊 Statistics
        </Button>

        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'achievements' })} variant="secondary" size="lg">
          🏆 Achievements
          {unlockedAchievements > 0 && (
            <span className="ml-2 px-2 py-1 bg-yellow-600 text-black rounded text-sm">
              {unlockedAchievements}
            </span>
          )}
        </Button>

        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'settings' })} variant="secondary" size="lg">
          ⚙️ Settings
        </Button>
      </div>
    </div>
  );
};
