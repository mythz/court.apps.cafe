import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { Courtroom } from '../courtroom/Courtroom';
import { EvidencePanel } from './EvidencePanel';
import { TestimonyView } from './TestimonyView';
import { JuryPanel } from './JuryPanel';
import { VerdictPanel } from './VerdictPanel';
import { ResultModal } from './ResultModal';
import { Button } from '../ui/Button';
import type { Verdict } from '../../types/game.types';
import type { VisualClue } from '../../types/case.types';

export const CaseView: React.FC = () => {
  const { state, submitVerdict, dispatch } = useGame();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'evidence' | 'testimonies' | 'jury'>('overview');
  const [discoveredClues, setDiscoveredClues] = useState<Set<string>>(new Set());
  const [showVerdictPanel, setShowVerdictPanel] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [verdictResult, setVerdictResult] = useState<{
    isCorrect: boolean;
    playerVerdict: Verdict;
    correctVerdict: Verdict;
    coinsEarned: number;
  } | null>(null);

  if (!state.currentCase) return null;

  const handleClueClick = (clue: VisualClue) => {
    setDiscoveredClues(prev => new Set([...prev, clue.id]));
  };

  const handleSubmitVerdict = async (verdict: Verdict) => {
    const isCorrect = verdict === state.currentCase!.correctVerdict;
    const coinsEarned = isCorrect ? 50 : -10;

    setVerdictResult({
      isCorrect,
      playerVerdict: verdict,
      correctVerdict: state.currentCase!.correctVerdict,
      coinsEarned
    });

    await submitVerdict(verdict);
    setShowVerdictPanel(false);
    setShowResultModal(true);
  };

  const handleContinue = () => {
    setShowResultModal(false);
    setVerdictResult(null);
    setDiscoveredClues(new Set());
    dispatch({ type: 'SET_SCREEN', payload: 'menu' });
  };

  return (
    <div className="case-view flex flex-col min-h-[calc(100vh-80px)]">
      <Courtroom
        case={state.currentCase}
        onClueClick={handleClueClick}
        discoveredClues={discoveredClues}
        hintMode={state.settings.hintHighlightEnabled}
      />

      <div className="info-panel bg-gray-800 p-6 border-t-2 border-yellow-600 flex-1">
        <div className="tabs flex gap-4 mb-4 border-b border-gray-700">
          <button
            className={`tab px-4 py-2 ${selectedTab === 'overview' ? 'border-b-2 border-yellow-600 text-yellow-400' : 'text-gray-400'}`}
            onClick={() => setSelectedTab('overview')}
          >
            Case Overview
          </button>
          <button
            className={`tab px-4 py-2 ${selectedTab === 'evidence' ? 'border-b-2 border-yellow-600 text-yellow-400' : 'text-gray-400'}`}
            onClick={() => setSelectedTab('evidence')}
          >
            Evidence ({state.currentCase.evidence.length})
          </button>
          <button
            className={`tab px-4 py-2 ${selectedTab === 'testimonies' ? 'border-b-2 border-yellow-600 text-yellow-400' : 'text-gray-400'}`}
            onClick={() => setSelectedTab('testimonies')}
          >
            Testimonies ({state.currentCase.testimonies.length})
          </button>
          <button
            className={`tab px-4 py-2 ${selectedTab === 'jury' ? 'border-b-2 border-yellow-600 text-yellow-400' : 'text-gray-400'}`}
            onClick={() => setSelectedTab('jury')}
          >
            Jury Opinion
          </button>
        </div>

        <div className="tab-content">
          {selectedTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">{state.currentCase.title}</h2>
              <p className="text-gray-300 mb-4">{state.currentCase.description}</p>
              <div className="discovered-clues mt-4 bg-gray-700 p-4 rounded">
                <h3 className="font-semibold mb-2">Visual Clues Discovered: {discoveredClues.size}/{state.currentCase.visualClues.length}</h3>
                <p className="text-sm text-gray-400">
                  Hover over characters in the courtroom to find hidden clues that might reveal their true intentions.
                </p>
              </div>
            </div>
          )}

          {selectedTab === 'evidence' && (
            <EvidencePanel evidence={state.currentCase.evidence} />
          )}

          {selectedTab === 'testimonies' && (
            <TestimonyView testimonies={state.currentCase.testimonies} />
          )}

          {selectedTab === 'jury' && (
            <JuryPanel opinions={state.currentCase.juryOpinions} />
          )}
        </div>

        <div className="actions flex gap-4 mt-6">
          <Button
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}
            variant="secondary"
          >
            Back to Menu
          </Button>
          <Button
            onClick={() => setShowVerdictPanel(true)}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            Render Verdict
          </Button>
        </div>
      </div>

      {showVerdictPanel && (
        <VerdictPanel
          onSubmit={handleSubmitVerdict}
          onCancel={() => setShowVerdictPanel(false)}
        />
      )}

      {showResultModal && verdictResult && (
        <ResultModal
          isCorrect={verdictResult.isCorrect}
          correctVerdict={verdictResult.correctVerdict}
          playerVerdict={verdictResult.playerVerdict}
          coinsEarned={verdictResult.coinsEarned}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};
