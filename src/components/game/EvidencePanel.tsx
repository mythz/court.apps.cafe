import React from 'react';
import type { Evidence } from '../../types/case.types';

interface EvidencePanelProps {
  evidence: Evidence[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence }) => {
  return (
    <div className="evidence-panel space-y-4">
      {evidence.map((item) => (
        <div key={item.id} className="evidence-item bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <span className="text-sm text-gray-400">{item.type}</span>
          </div>
          <p className="text-gray-300">{item.description}</p>
          <div className="mt-2 flex gap-2">
            <span className="text-xs px-2 py-1 bg-gray-600 rounded">
              Weight: {item.weight}/10
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
