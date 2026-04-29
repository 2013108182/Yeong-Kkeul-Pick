import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';

const Step2Financial = () => {
  const { inputs, updateInput, nextStep, prevStep } = useCalculatorStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">얼마나 있나요? 💰</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-white/60 mb-1 block">연 소득 (부부합산)</label>
          <div className="relative">
            <input 
              type="number"
              value={inputs.yearIncome}
              onChange={(e) => updateInput('yearIncome', Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white pr-12 focus:outline-none"
            />
            <span className="absolute right-4 top-3 text-white/40">만원</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">가용 자금 (보증금+모은돈+지원)</label>
          <div className="relative">
            <input 
              type="number"
              value={inputs.myAsset}
              onChange={(e) => updateInput('myAsset', Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white pr-12 focus:outline-none"
            />
            <span className="absolute right-4 top-3 text-white/40">만원</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">대출 기간</label>
          <select 
            value={inputs.borrowingYear}
            onChange={(e) => updateInput('borrowingYear', Number(e.target.value) as any)}
            className="w-full bg-[#1A1A3A] border border-white/10 rounded-xl px-4 py-3 text-white"
          >
            {[10, 15, 20, 30, 40].map(y => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 py-4 border border-white/20 text-white rounded-2xl">이전</button>
        <button onClick={nextStep} className="flex-[2] bg-cyan-400 text-[#0F0C29] font-bold rounded-2xl">다음 단계로</button>
      </div>
    </div>
  );
};

export default Step2Financial;