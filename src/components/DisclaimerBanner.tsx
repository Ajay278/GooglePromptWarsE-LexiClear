import React, { useState } from 'react';
import { ShieldAlert, X, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showFull, setShowFull] = useState(false);

  if (isDismissed) {
    return (
      <div className="bg-stone-100 border-b border-stone-200 px-4 py-1 text-xs text-stone-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-stone-500" />
          <span>Informational Legal Guidance Tool — Not Professional Legal Advice</span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-stone-500 hover:text-stone-800 underline text-xs cursor-pointer"
        >
          View Full Notice
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-950 transition-all">
      <div className="max-w-7xl mx-auto flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-900">Legal Information & Assistance Notice: </span>
            <span>
              LexiClear provides AI-assisted document navigation, risk analysis, and clause simplification for informational purposes only. It does not provide legal representation, attorney-client privilege, or formal legal advice.
            </span>
            {showFull ? (
              <p className="mt-1 text-amber-900 leading-relaxed">
                Laws vary by state and jurisdiction. Contracts should always be reviewed by a licensed attorney before signing or when disputing contractual obligations. LexiClear prioritizes document grounding and will explicitly state when a document does not contain an answer rather than guessing.
              </p>
            ) : null}
            <button
              onClick={() => setShowFull(!showFull)}
              className="ml-2 font-medium text-amber-800 underline hover:text-amber-950 cursor-pointer"
            >
              {showFull ? 'Show less' : 'Read full notice'}
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-700 hover:text-amber-900 p-1 rounded hover:bg-amber-100/60 cursor-pointer transition-colors"
          title="Minimize notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
