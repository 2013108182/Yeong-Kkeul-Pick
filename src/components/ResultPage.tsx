import React from 'react';
import { useCalculatorStore } from '../store/useCalculatorStore';
import CaseCard from './result/CaseCard';
import ApartmentCard from './result/ApartmentCard';
import LoanBreakdown from './result/LoanBreakdown';

const ResultPage = () => {
  const { results, curatedApts, reset, inputs } = useCalculatorStore();

  if (!results) return null;

  // 비토허제(가장 높은 한도)를 기준으로 메인 영끌액 표시
  const mainResult = results.NON_REGULATED;

  return (
    <div className="min-h-screen bg-[#0F0C29] text-white pb-20">
      {/* 헤로 섹션: 최대 영끌 가능액 */}
      <div className="pt-16 pb-12 px-6 text-center bg-gradient-to-b from-purple-900/20 to-transparent">
        <h1 className="text-xl text-cyan-400 font-bold mb-2">지수님의 영끌 결과</h1>
        <div className="text-4xl font-black mb-4">
          최대 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            {mainResult.maxPropertyPrice}억
          </span>까지 도전 가능!
        </div>
        <p className="text-white/60 text-sm">
          자기자본 {mainResult.myAssetEok}억 + 대출 {mainResult.maxLoan}억
        </p>
      </div>

      {/* 3케이스 비교 카드 (가로 스크롤) */}
      <div className="px-6 mb-12">
        <h3 className="text-lg font-bold mb-4 px-2">규제별 비교</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {(['GANGNAM3_YONGSAN', 'OTHER_REGULATED', 'NON_REGULATED'] as const).map((key) => (
            <CaseCard key={key} result={results[key]} />
          ))}
        </div>
      </div>

      {/* 아파트 큐레이션 섹션 */}
      <div className="px-6 mb-12">
        <div className="flex justify-between items-end mb-4 px-2">
          <h3 className="text-lg font-bold">추천 아파트</h3>
          <span className="text-xs text-white/40">예산 {mainResult.maxPropertyPrice}억 이내</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {curatedApts.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} budget={mainResult.maxPropertyPrice} />
          ))}
        </div>
      </div>

      {/* 자금 구성 상세 */}
      <div className="px-6 mb-12">
        <h3 className="text-lg font-bold mb-4 px-2">대출 구성 상세</h3>
        <LoanBreakdown result={mainResult} />
      </div>

      {/* 하단 플로팅 버튼 */}
      <div className="fixed bottom-6 left-6 right-6 flex gap-3">
        <button 
          onClick={reset}
          className="flex-1 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold"
        >
          다시 계산하기
        </button>
        <button className="flex-[2] py-4 bg-cyan-400 text-[#0F0C29] rounded-2xl font-black shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          결과 공유하기 📤
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
