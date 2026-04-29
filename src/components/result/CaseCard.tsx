import React from 'react';
import { CaseResult } from '../../lib/calculator';

const CaseCard = ({ result }: { result: CaseResult }) => {
  const isRegulated = result.caseKey !== 'NON_REGULATED';
  
  return (
    <div className="min-w-[280px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-bold text-white/60">{result.caseLabel}</span>
        <span className={`text-[10px] px-2 py-1 rounded-full ${isRegulated ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {isRegulated ? '규제지역' : '비규제'}
        </span>
      </div>
      
      <div className="text-2xl font-black text-white mb-1">{result.maxPropertyPrice}억</div>
      <div className="text-xs text-white/40 mb-6">LTV {result.ltv}% 적용</div>
      
      <div className="space-y-3">
        {result.warnings.slice(0, 2).map((w, i) => (
          <div key={i} className="text-[11px] text-yellow-400/80 flex gap-2">
            <span>•</span> {w}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseCard;
