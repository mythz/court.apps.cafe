import React from 'react';
import type { JuryOpinion } from '../../types/case.types';

interface JuryPanelProps {
  opinions: JuryOpinion[];
}

export const JuryPanel: React.FC<JuryPanelProps> = ({ opinions }) => {
  const guiltyCount = opinions.filter(o => o.opinion === 'guilty').length;
  const notGuiltyCount = opinions.filter(o => o.opinion === 'not-guilty').length;

  return (
    <div className="jury-panel">
      <div className="jury-summary mb-4 flex gap-4">
        <div className="flex-1 bg-red-900 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">{guiltyCount}</div>
          <div className="text-sm">Guilty</div>
        </div>
        <div className="flex-1 bg-green-900 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold">{notGuiltyCount}</div>
          <div className="text-sm">Not Guilty</div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {opinions.map((opinion) => (
          <div
            key={opinion.jurorId}
            className={`juror p-2 rounded text-center text-xs ${
              opinion.opinion === 'guilty' ? 'bg-red-700' : 'bg-green-700'
            }`}
            title={`Confidence: ${opinion.confidence}/10`}
          >
            #{opinion.jurorId}
          </div>
        ))}
      </div>
    </div>
  );
};
