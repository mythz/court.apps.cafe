import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Verdict } from '../../types/game.types';

interface VerdictPanelProps {
  onSubmit: (verdict: Verdict) => void;
  onCancel: () => void;
}

export const VerdictPanel: React.FC<VerdictPanelProps> = ({ onSubmit, onCancel }) => {
  const [selectedVerdict, setSelectedVerdict] = useState<Verdict | null>(null);

  return (
    <Modal onClose={onCancel}>
      <div className="verdict-panel bg-gray-800 p-8 rounded-lg max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Render Your Verdict
        </h2>

        <div className="verdict-options flex flex-col gap-4 mb-6">
          <button
            className={`verdict-btn p-6 rounded-lg text-xl font-semibold transition-all ${
              selectedVerdict === 'guilty'
                ? 'bg-red-600 ring-4 ring-red-400'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setSelectedVerdict('guilty')}
          >
            GUILTY
          </button>

          <button
            className={`verdict-btn p-6 rounded-lg text-xl font-semibold transition-all ${
              selectedVerdict === 'not-guilty'
                ? 'bg-green-600 ring-4 ring-green-400'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setSelectedVerdict('not-guilty')}
          >
            NOT GUILTY
          </button>
        </div>

        <div className="actions flex gap-4">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedVerdict && onSubmit(selectedVerdict)}
            variant="primary"
            className="flex-1"
            disabled={!selectedVerdict}
          >
            Submit Verdict
          </Button>
        </div>
      </div>
    </Modal>
  );
};
