import React from 'react';
import { Button } from '../ui/Button';
import { useGame } from '../../contexts/GameContext';

export const Achievements: React.FC = () => {
  const { state, dispatch } = useGame();

  const unlockedCount = state.achievements.filter(a => a.unlocked).length;
  const totalRewards = state.achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="achievements p-8 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Achievements</h1>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}>
          Back to Menu
        </Button>
      </div>

      <div className="achievements-summary mb-8 grid grid-cols-2 gap-4 max-w-2xl">
        <div className="bg-yellow-900 p-4 rounded-lg">
          <div className="text-3xl font-bold">{unlockedCount}/{state.achievements.length}</div>
          <div className="text-sm text-gray-300">Achievements Unlocked</div>
        </div>
        <div className="bg-green-900 p-4 rounded-lg">
          <div className="text-3xl font-bold">{totalRewards}</div>
          <div className="text-sm text-gray-300">Total Coins Earned</div>
        </div>
      </div>

      <div className="achievements-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`achievement-card p-6 rounded-lg border-2 transition-all ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-yellow-900 to-yellow-950 border-yellow-600'
                : 'bg-gray-800 border-gray-700 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-4xl">
                {achievement.unlocked ? '🏆' : '🔒'}
              </div>
              <div className={`px-3 py-1 rounded text-sm font-semibold ${
                achievement.unlocked ? 'bg-yellow-600 text-black' : 'bg-gray-700'
              }`}>
                {achievement.reward} coins
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
            <p className="text-gray-300 text-sm">{achievement.description}</p>

            {achievement.unlocked && (
              <div className="mt-3 text-green-400 text-sm font-semibold">
                ✓ Unlocked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
