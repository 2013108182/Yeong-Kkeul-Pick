import React from 'react';
import { useCalculatorStore } from '../store/useCalculatorStore';
import Step1Personal from './steps/Step1Personal';
import Step2Financial from './steps/Step2Financial';
import Step3Preference from './steps/Step3Preference';

const InputWizard = () => {
  const { step } = useCalculatorStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] flex items-center justify-center p-4">
      {/* 글래스모피즘 컨테이너 */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 transition-all duration-500">
        
        {/* 진행률 바 */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-cyan-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* 스텝별 화면 전환 */}
        {step === 1 && <Step1Personal />}
        {step === 2 && <Step2Financial />}
        {step === 3 && <Step3Preference />}
        
      </div>
    </div>
  );
};

export default InputWizard;
