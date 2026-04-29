import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { CATEGORIES } from '../../data/apartments';

const Step3Preference = () => {
  const { preferCategory, setPreferences, calculateAndFinish, prevStep } = useCalculatorStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">어디에 살고 싶나요? 🏙️</h2>
      
      <p className="text-white/60 text-sm">가장 중요한 우선순위를 골라주세요.</p>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setPreferences(cat.key, [])}
            className={`p-4 rounded-2xl border text-left transition-all ${
              preferCategory === cat.key 
                ? 'bg-purple-500/30 border-purple-400 shadow-[0_0_15px_rgba(167,139,250,0.3)]' 
                : 'bg-white/5 border-white/10 text-white/80'
            }`}
          >
            <div className="text-2xl mb-1">{cat.emoji}</div>
            <div className="font-bold text-white">{cat.label}</div>
            <div className="text-[10px] text-white/40 leading-tight">{cat.tagline}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={prevStep} className="flex-1 py-4 border border-white/20 text-white rounded-2xl">이전</button>
        <button 
          onClick={calculateAndFinish} 
          className="flex-[2] bg-gradient-to-r from-cyan-400 to-purple-400 text-[#0F0C29] font-black rounded-2xl shadow-lg"
        >
          영끌 결과 보기 🚀
        </button>
      </div>
    </div>
  );
};

export default Step3Preference;