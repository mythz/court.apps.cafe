import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useGame } from '../../contexts/GameContext';
import { storageService } from '../../services/storageService';
import type { CompletedCase } from '../../types/storage.types';

export const Statistics: React.FC = () => {
  const { state, dispatch } = useGame();
  const [caseHistory, setCaseHistory] = useState<CompletedCase[]>([]);

  useEffect(() => {
    loadCaseHistory();
  }, []);

  const loadCaseHistory = async () => {
    const history = await storageService.getCaseHistory();
    setCaseHistory(history.reverse());
  };

  const winRate = state.completedCases > 0
    ? ((state.correctVerdicts / state.completedCases) * 100).toFixed(1)
    : '0';

  return (
    <div className="statistics p-8 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Your Statistics</h1>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}>
          Back to Menu
        </Button>
      </div>

      <div className="stats-grid grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

        <div className="stat-card bg-orange-900 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Current Streak</h3>
          <p className="text-4xl font-bold">🔥 {state.currentStreak}</p>
        </div>

        <div className="stat-card bg-purple-900 p-6 rounded-lg">
          <h3 className="text-gray-400 mb-2">Best Streak</h3>
          <p className="text-4xl font-bold">⭐ {state.bestStreak}</p>
        </div>
      </div>

      <div className="case-history">
        <h2 className="text-2xl font-bold mb-4">Recent Cases</h2>
        {caseHistory.length === 0 ? (
          <p className="text-gray-400">No cases completed yet. Start a new case to see your history!</p>
        ) : (
          <div className="history-list space-y-2">
            {caseHistory.slice(0, 10).map((caseRecord, index) => (
              <div
                key={index}
                className={`history-item p-4 rounded-lg ${
                  caseRecord.wasCorrect ? 'bg-green-900' : 'bg-red-900'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{caseRecord.caseId}</span>
                  <span>{caseRecord.wasCorrect ? '✓' : '✗'} {caseRecord.verdict.toUpperCase()}</span>
                  <span className="text-yellow-400">
                    {caseRecord.coinsEarned > 0 ? '+' : ''}{caseRecord.coinsEarned} coins
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
