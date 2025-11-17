import React from 'react';

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
