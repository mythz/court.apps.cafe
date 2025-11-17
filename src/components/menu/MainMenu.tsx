import React from 'react';
import { Button } from '../ui/Button';
import { useGame } from '../../contexts/GameContext';

export const MainMenu: React.FC = () => {
  const { startNewCase, dispatch } = useGame();

  return (
    <div className="main-menu flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-900 to-gray-800">
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
    </div>
  );
};
