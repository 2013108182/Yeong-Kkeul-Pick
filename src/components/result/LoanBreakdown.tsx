import React from 'react';
import { CaseResult } from '../../lib/calculator';

const LoanBreakdown = ({ result }: { result: CaseResult }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-xs text-white/40">매월 예상 상환액</div>
          <div className="text-2xl font-black text-cyan-400">
            {result.monthlyTotal.toLocaleString()}원
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-red-400 font-bold">Stress DSR 영향</div>
          <div className="text-sm text-red-400">-{result.stressDsrImpact}억 한도감소</div>
        </div>
      </div>

      <div className="space-y-4">
        {result.loanPieces.map((loan, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <div className="font-bold text-sm">{loan.name}</div>
              <div className="text-[10px] text-white/40">{loan.rate}% | {result.maxLoan}억 중 {loan.amount}억</div>
            </div>
            <div className="text-right font-mono text-sm text-white/80">
              {loan.monthlyPayment.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanBreakdown;
