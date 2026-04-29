import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';

const Step1Personal = () => {
  const { inputs, updateInput, nextStep } = useCalculatorStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">누구신가요? 👤</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-white/60 mb-1 block">생년월일</label>
          <input 
            type="date"
            value={inputs.birthday}
            onChange={(e) => updateInput('birthday', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex-1 cursor-pointer">
            <input 
              type="checkbox" 
              className="hidden peer"
              checked={inputs.isMarried}
              onChange={(e) => updateInput('isMarried', e.target.checked)}
            />
            <div className="py-3 text-center border border-white/10 rounded-xl text-white peer-checked:bg-cyan-400/20 peer-checked:border-cyan-400 transition-all">
              기혼 💍
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input 
              type="checkbox" 
              className="hidden peer"
              checked={inputs.isFirstTime}
              onChange={(e) => updateInput('isFirstTime', e.target.checked)}
            />
            <div className="py-3 text-center border border-white/10 rounded-xl text-white peer-checked:bg-cyan-400/20 peer-checked:border-cyan-400 transition-all">
              생애최초 🏠
            </div>
          </label>
        </div>

        {/* 2년 내 출산 여부 (신생아 특례 판정용) */}
        <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-xl border border-white/10">
          <input 
            type="checkbox"
            checked={inputs.hasNewBorn2yr}
            onChange={(e) => updateInput('hasNewBorn2yr', e.target.checked)}
            className="w-5 h-5 accent-cyan-400"
          />
          <span className="text-white">2년 내 출산/예정 (신생아특례) 👶</span>
        </label>
      </div>

      <button 
        onClick={nextStep}
        className="w-full bg-cyan-400 hover:bg-cyan-300 text-[#0F0C29] font-bold py-4 rounded-2xl transition-all"
      >
        다음 단계로
      </button>
    </div>
  );
};

export default Step1Personal;