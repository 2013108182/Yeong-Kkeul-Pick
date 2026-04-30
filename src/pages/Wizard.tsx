import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export const Wizard = () => {
  const nav = useNavigate();
  const { input, setInput } = useAppStore(); // Store의 상태 구조에 맞게 조정 필요
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else nav('/result');
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    else nav('/');
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="glass fade-up"
          style={{ width: '100%', maxWidth: 500, padding: '32px' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="step-content">
              <h2 style={{ marginBottom: 24 }}>1. 기본 자금을 알려주세요</h2>
              <div style={{ marginBottom: 16 }}>
                <label>연봉 (만원)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={input.income || ''} 
                  onChange={(e) => setInput({ ...input, income: Number(e.target.value) })} 
                  placeholder="예: 7000" 
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label>모은 돈 (만원)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={input.savings || ''} 
                  onChange={(e) => setInput({ ...input, savings: Number(e.target.value) })} 
                  placeholder="예: 15000" 
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2 style={{ marginBottom: 24 }}>2. 특별 대출 자격이 있나요?</h2>
              
              <div style={{ marginBottom: 16 }}>
                <label>생애최초 주택 구입인가요?</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className={`btn ${input.isFirstHome ? 'btn-primary' : 'btn-outline'}`} onClick={() => setInput({ ...input, isFirstHome: true })}>네</button>
                  <button className={`btn ${!input.isFirstHome ? 'btn-primary' : 'btn-outline'}`} onClick={() => setInput({ ...input, isFirstHome: false })}>아니오</button>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>신생아 특례대출 대상인가요? (2년 내 출산)</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className={`btn ${input.hasNewborn ? 'btn-primary' : 'btn-outline'}`} onClick={() => setInput({ ...input, hasNewborn: true })}>네</button>
                  <button className={`btn ${!input.hasNewborn ? 'btn-primary' : 'btn-outline'}`} onClick={() => setInput({ ...input, hasNewborn: false })}>아니오</button>
                </div>
              </div>

              {/* 신생아 특례 대상일 때만 노출되는 조건부 질문 */}
              {input.hasNewborn && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 16, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                  <label>예상 적용 금리 (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="input-field" 
                    value={input.newbornRate || 2.1} 
                    onChange={(e) => setInput({ ...input, newbornRate: Number(e.target.value) })} 
                  />
                </motion.div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2 style={{ marginBottom: 24 }}>3. 아파트 선택 시 가장 중요한 것은?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['강남 접근성', '학군 (초품아 등)', '교통 (역세권)', '연식 (신축)'].map((pref) => (
                  <button 
                    key={pref}
                    className={`btn ${input.preference === pref ? 'btn-primary' : 'btn-outline'}`} 
                    style={{ width: '100%', textAlign: 'left', padding: '12px 16px' }}
                    onClick={() => setInput({ ...input, preference: pref })}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button className="btn btn-outline" onClick={handlePrev}>
              {step === 1 ? '처음으로' : '이전'}
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              {step === 3 ? '결과 보기' : '다음'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
