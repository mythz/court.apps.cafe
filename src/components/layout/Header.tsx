import React from 'react';
import { CoinDisplay } from '../ui/CoinDisplay';
import { useGame } from '../../contexts/GameContext';

export const Header: React.FC = () => {
  const { state } = useGame();

  return (
    <header className="bg-gray-800 border-b-2 border-yellow-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Court Justice</h1>
        <CoinDisplay coins={state.coins} />
      </div>
    </header>
  );
};
