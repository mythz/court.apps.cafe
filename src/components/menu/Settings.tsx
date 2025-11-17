import React from 'react';
import { Button } from '../ui/Button';
import { useGame } from '../../contexts/GameContext';
import type { Difficulty } from '../../types/game.types';

export const Settings: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleDifficultyChange = (difficulty: Difficulty) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { difficulty } });
  };

  const toggleSound = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { soundEnabled: !state.settings.soundEnabled } });
  };

  const toggleMusic = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { musicEnabled: !state.settings.musicEnabled } });
  };

  const toggleHints = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { hintHighlightEnabled: !state.settings.hintHighlightEnabled } });
  };

  return (
    <div className="settings p-8 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Settings</h1>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}>
          Back to Menu
        </Button>
      </div>

      <div className="settings-content max-w-2xl space-y-6">
        {/* Difficulty Setting */}
        <div className="setting-group bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Difficulty</h2>
          <div className="flex gap-4">
            {(['easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  state.settings.difficulty === diff
                    ? 'bg-yellow-600 text-black ring-2 ring-yellow-400'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-3">
            {state.settings.difficulty === 'easy' && 'Simpler cases with clear evidence'}
            {state.settings.difficulty === 'medium' && 'Balanced cases with some ambiguity'}
            {state.settings.difficulty === 'hard' && 'Complex cases requiring careful analysis'}
          </p>
        </div>

        {/* Audio Settings */}
        <div className="setting-group bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Audio</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-lg">Sound Effects</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={state.settings.soundEnabled}
                  onChange={toggleSound}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-colors ${
                  state.settings.soundEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  <div className={`w-6 h-6 bg-white rounded-full m-1 transition-transform ${
                    state.settings.soundEnabled ? 'translate-x-6' : ''
                  }`} />
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-lg">Background Music</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={state.settings.musicEnabled}
                  onChange={toggleMusic}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-colors ${
                  state.settings.musicEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  <div className={`w-6 h-6 bg-white rounded-full m-1 transition-transform ${
                    state.settings.musicEnabled ? 'translate-x-6' : ''
                  }`} />
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Gameplay Settings */}
        <div className="setting-group bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Gameplay</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-lg block">Visual Clue Hints</span>
              <span className="text-gray-400 text-sm">Highlight discoverable clues on hover</span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={state.settings.hintHighlightEnabled}
                onChange={toggleHints}
                className="sr-only"
              />
              <div className={`w-14 h-8 rounded-full transition-colors ${
                state.settings.hintHighlightEnabled ? 'bg-green-600' : 'bg-gray-600'
              }`}>
                <div className={`w-6 h-6 bg-white rounded-full m-1 transition-transform ${
                  state.settings.hintHighlightEnabled ? 'translate-x-6' : ''
                }`} />
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
