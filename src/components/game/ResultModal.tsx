import React, { useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Verdict } from '../../types/game.types';
import { audioService } from '../../services/audioService';

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
            <h3 className="font-semibold mb-2">Keep practicing!</h3>
            <p className="text-gray-300">
              Pay close attention to the evidence weight and credibility scores.
              Look for visual clues on characters that might indicate deception.
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
