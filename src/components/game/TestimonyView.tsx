import React from 'react';
import type { Testimony } from '../../types/case.types';

interface TestimonyViewProps {
  testimonies: Testimony[];
}

export const TestimonyView: React.FC<TestimonyViewProps> = ({ testimonies }) => {
  return (
    <div className="testimony-view space-y-4">
      {testimonies.map((testimony, index) => (
        <div key={index} className={`testimony-item p-4 rounded-lg ${
          testimony.role === 'prosecutor' ? 'bg-red-900' : 'bg-blue-900'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold">{testimony.speaker}</h3>
            <span className="text-sm">Credibility: {testimony.credibility}/10</span>
          </div>
          <p className="text-gray-200 italic">"{testimony.statement}"</p>
          {testimony.contradictions && testimony.contradictions.length > 0 && (
            <div className="mt-2 text-yellow-400 text-sm">
              ⚠ Contradictions: {testimony.contradictions.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
