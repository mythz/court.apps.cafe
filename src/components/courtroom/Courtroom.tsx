import React, { useState } from 'react';
import type { Case, VisualClue } from '../../types/case.types';

interface CourtroomProps {
  case: Case;
  onClueClick: (clue: VisualClue) => void;
  discoveredClues: Set<string>;
  hintMode: boolean;
}

export const Courtroom: React.FC<CourtroomProps> = ({
  case: currentCase,
  onClueClick,
  discoveredClues,
  hintMode
}) => {
  const [hoveredClue, setHoveredClue] = useState<string | null>(null);

  return (
    <div className="courtroom relative w-full h-96 bg-gradient-to-b from-amber-900 to-amber-950 flex items-center justify-around px-8">

      {/* Prosecutor */}
      <div className="character prosecutor relative text-center">
        <div className="w-32 h-48 bg-gray-700 rounded-lg flex items-center justify-center text-6xl relative">
          👨‍💼

          {/* Visual clue overlays */}
          {currentCase.visualClues.map(clue => {
            const isDiscovered = discoveredClues.has(clue.id);
            const showHint = hintMode && hoveredClue === clue.id;

            return (
              <div
                key={clue.id}
                className={`clue-hotspot absolute cursor-pointer ${
                  isDiscovered ? 'opacity-50 bg-green-500 bg-opacity-30' : 'hover:bg-yellow-400 hover:bg-opacity-30'
                }`}
                style={{
                  left: `${clue.position.x - 100}px`,
                  top: `${clue.position.y - 200}px`,
                  width: `${clue.position.width}px`,
                  height: `${clue.position.height}px`,
                  border: showHint ? '2px solid yellow' : isDiscovered ? '2px solid green' : 'none'
                }}
                onClick={() => !isDiscovered && onClueClick(clue)}
                onMouseEnter={() => setHoveredClue(clue.id)}
                onMouseLeave={() => setHoveredClue(null)}
              >
                {showHint && (
                  <div className="hint-tooltip absolute bg-black text-white p-2 rounded text-xs -top-10 left-0 w-48 z-10">
                    {clue.hint}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-sm font-semibold">Prosecutor</p>
        <p className="text-xs text-gray-400">{currentCase.prosecutor.name}</p>
      </div>

      {/* Defendant */}
      <div className="character defendant text-center">
        <div className="w-32 h-48 bg-gray-700 rounded-lg flex items-center justify-center text-6xl">
          👤
        </div>
        <p className="mt-2 text-sm font-semibold">Defendant</p>
        <p className="text-xs text-gray-400">{currentCase.defendant.name}</p>
      </div>

      {/* Defense Lawyer */}
      <div className="character defense-lawyer text-center">
        <div className="w-32 h-48 bg-gray-700 rounded-lg flex items-center justify-center text-6xl">
          👩‍💼
        </div>
        <p className="mt-2 text-sm font-semibold">Defense Attorney</p>
        <p className="text-xs text-gray-400">{currentCase.defenseLawyer.name}</p>
      </div>

      {/* Judge's gavel (bottom center) */}
      <div className="gavel absolute bottom-4 left-1/2 transform -translate-x-1/2 text-4xl">
        🔨
      </div>
    </div>
  );
};
