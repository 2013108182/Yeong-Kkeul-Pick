/**
 * 2026년 정책 반영 영끌 계산 엔진
 * 3케이스 분기:
 *   GANGNAM3_YONGSAN — 강남3구 + 용산 (수도권 6억 캡 + 토허제 + LTV 70%)
 *   OTHER_REGULATED  — 기타 토허제 (수도권 6억 캡 + LTV 70%)
 *   NON_REGULATED    — 비토허제 (캡 없음 + 생애최초 LTV 80%)
 */

import {
  DSR_LIMIT, STRESS_RATE_CAPITAL, NORMAL_RATE,
  LTV, CAPITAL_LOAN_CAP,
  isAbleDidimdol, isAbleNewBornSpecial, isAbleBogeumjari,
  getDidimdolBaseRate, getDidimdolPrimeRate, getDidimdolLimit, getDidimdolPriceCap,
  getNewBornBaseRate, NEW_BORN_LIMIT, NEW_BORN_PRICE_CAP,
  BOGEUMJARI_RATE, BOGEUMJARI_PRICE_CAP, getBogeumjariLimit,
  DIDIMDOL_RATE_FLOOR,
  getInternationalAge,
} from '../data/policy-2026';

export type CaseKey = 'GANGNAM3_YONGSAN' | 'OTHER_REGULATED' | 'NON_REGULATED';

export type Inputs = {
  birthday: string;
  isMarried: boolean;
  isNewCouple: boolean;
  hasNewBorn2yr: boolean;
  isDualIncome: boolean;
  isFirstTime: boolean;
  isNoHouse: boolean;
  yearIncome: number;          // 만원
  myAsset: number;             // 만원 (가용자금)
  monthlySaving: number;       // 만원
  borrowingYear: 10 | 15 | 20 | 30 | 40;
  paymentType: 'fixed' | 'fixedPrincipal' | 'gradual';
  kidsCount: number;
  isHavingKids: boolean;
  isSingleParent: boolean;
  isMultiCultural: boolean;
  isDisabled: boolean;
};

export type LoanPiece = {
  name: string;            // '디딤돌' | '신생아특례' | '보금자리' | '일반주담대'
  amount: number;          // 억
  rate: number;            // %
  monthlyPayment: number;  // 원, 원리금균등 기준
  totalInterest: number;   // 억
};

export type CaseResult = {
  caseKey: CaseKey;
  caseLabel: string;
  myAssetEok: number;
  ltv: number;
  loanCap: number;          // 억 (Infinity이면 캡없음)
  maxLoan: number;          // 억 - DSR/LTV/캡 종합 후
  maxPropertyPrice: number; // 억
  loanPieces: LoanPiece[];
  monthlyTotal: number;     // 원
  yearlyDsrUsed: number;    // 만원
  stressDsrImpact: number;  // 억 - "스트레스 DSR이 줄인 한도"
  warnings: string[];
};

// ─── 원리금균등 월 상환액 ───
const monthlyFixed = (principalEok: number, ratePct: number, years: number): number => {
  const principal = principalEok * 1e8;
  const i = ratePct / 100 / 12;
  const n = years * 12;
  if (i === 0) return principal / n;
  return Math.ceil((principal * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1));
};

// ─── 총 이자 (원리금균등 기준) ───
const totalInterestFixed = (principalEok: number, ratePct: number, years: number): number => {
  const monthly = monthlyFixed(principalEok, ratePct, years);
  return (monthly * years * 12 - principalEok * 1e8) / 1e8;
};

// ─── DSR 기반 연 가용 원리금 ───
const dsrAvailableYearly = (yearIncomeWon: number) => yearIncomeWon * 10000 * DSR_LIMIT;

// ─── 어떤 금리/기간으로 연 X원을 갚을 수 있을 때, 빌릴 수 있는 원금(억) ───
const principalFromYearlyPayment = (yearlyPaymentWon: number, ratePct: number, years: number): number => {
  if (yearlyPaymentWon <= 0) return 0;
  // 월 = 연/12. 원리금균등 역산: P = M / (i(1+i)^n / ((1+i)^n - 1))
  const monthly = yearlyPaymentWon / 12;
  const i = ratePct / 100 / 12;
  const n = years * 12;
  if (i === 0) return (monthly * n) / 1e8;
  const factor = (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  return monthly / factor / 1e8;
};

// ─── 스트레스 DSR 미적용 가정 시 한도 ───
const calcUnstressedLoanCapacity = (yearIncomeWon: number, baseRatePct: number, years: number) => {
  const yearly = dsrAvailableYearly(yearIncomeWon);
  return principalFromYearlyPayment(yearly, baseRatePct, years);
};

// ─── 스트레스 DSR 반영 한도 ───
const calcStressedLoanCapacity = (yearIncomeWon: number, baseRatePct: number, years: number) => {
  const yearly = dsrAvailableYearly(yearIncomeWon);
  return principalFromYearlyPayment(yearly, baseRatePct + STRESS_RATE_CAPITAL, years);
};

const caseLabel = (k: CaseKey) =>
  k === 'GANGNAM3_YONGSAN' ? '강남3구·용산' :
  k === 'OTHER_REGULATED'  ? '기타 토허제' : '비토허제';

const getLtvForCase = (caseKey: CaseKey, isFirstTime: boolean) => {
  if (caseKey === 'NON_REGULATED' && isFirstTime) return LTV.FIRSTTIME_NON_REGULATED;
  if (isFirstTime) return LTV.FIRSTTIME_REGULATED;
  return LTV.GENERAL;
};

const getLoanCapForCase = (caseKey: CaseKey) =>
  caseKey === 'NON_REGULATED' ? Infinity : CAPITAL_LOAN_CAP;

// ─── 단일 케이스 계산 ───
export const calcCase = (i: Inputs, caseKey: CaseKey): CaseResult => {
  const myAssetEok = i.myAsset / 10000;
  const yearIncome = i.yearIncome;
  const internationalAge = getInternationalAge(i.birthday);

  const ltv = getLtvForCase(caseKey, i.isFirstTime);
  const loanCap = getLoanCapForCase(caseKey);

  // 1. LTV 기반 최대 대출
  // maxLoanByLtv * (100-ltv)/100 = myAsset (자기부담)
  // → maxPriceByLtv = myAsset / ((100-ltv)/100) = myAsset × 100 / (100-ltv)
  const maxPriceByLtv = (myAssetEok * 100) / (100 - ltv);
  const maxLoanByLtv = maxPriceByLtv - myAssetEok;

  // 2. 정책대출 자격
  const ableDidimdol = isAbleDidimdol(yearIncome, i.isMarried, i.isHavingKids, i.isNewCouple);
  const ableNewBorn = isAbleNewBornSpecial(i.hasNewBorn2yr, yearIncome, i.isDualIncome);
  const ableBogeumjari = isAbleBogeumjari(yearIncome, i.isNewCouple, i.kidsCount);

  const yearlyDsr = dsrAvailableYearly(yearIncome);

  // 3. 저금리 → 고금리 순으로 한도 채워가며 누적
  const pieces: LoanPiece[] = [];
  let remainYearly = yearlyDsr;
  let remainLtvLoan = maxLoanByLtv;
  let totalLoan = 0;

  const tryAddLoan = (
    name: string,
    rate: number,
    productLimit: number,
  ) => {
    if (remainYearly <= 0 || remainLtvLoan <= 0) return;
    // 스트레스 DSR 적용한 심사금리로 산정
    const stressedRate = rate + STRESS_RATE_CAPITAL;
    const dsrPossible = principalFromYearlyPayment(remainYearly, stressedRate, i.borrowingYear);
    const cap = Math.min(productLimit, remainLtvLoan, dsrPossible);
    if (cap < 0.1) return;
    const usedYearly = (monthlyFixed(cap, stressedRate, i.borrowingYear) * 12);
    pieces.push({
      name,
      amount: parseFloat(cap.toFixed(2)),
      rate: parseFloat(rate.toFixed(2)),
      monthlyPayment: monthlyFixed(cap, rate, i.borrowingYear),
      totalInterest: parseFloat(totalInterestFixed(cap, rate, i.borrowingYear).toFixed(2)),
    });
    remainYearly -= usedYearly;
    remainLtvLoan -= cap;
    totalLoan += cap;
  };

  // 신생아특례 (가장 저금리)
  if (ableNewBorn) {
    const baseRate = getNewBornBaseRate(yearIncome);
    tryAddLoan('신생아특례 디딤돌', baseRate, NEW_BORN_LIMIT);
  }

  // 디딤돌
  if (ableDidimdol && pieces.length === 0) {
    // (신생아특례 받은 경우 디딤돌 중복 제한 가정)
    const base = getDidimdolBaseRate(yearIncome, i.borrowingYear);
    const prime = getDidimdolPrimeRate({
      isMarried: i.isMarried, isHavingKids: i.isHavingKids, kidsCount: i.kidsCount,
      isNewCouple: i.isNewCouple, isFirstTime: i.isFirstTime,
      isSingleParent: i.isSingleParent, isMultiCultural: i.isMultiCultural,
      isDisabled: i.isDisabled, yearIncome,
    });
    const finalRate = Math.max(base - prime, DIDIMDOL_RATE_FLOOR);
    const limit = getDidimdolLimit({
      isMarried: i.isMarried, isHavingKids: i.isHavingKids, kidsCount: i.kidsCount,
      isNewCouple: i.isNewCouple, internationalAge,
    });
    tryAddLoan('디딤돌', finalRate, limit);
  }

  // 보금자리
  if (ableBogeumjari) {
    const rate = BOGEUMJARI_RATE[i.borrowingYear];
    const limit = getBogeumjariLimit(i.isFirstTime, i.kidsCount);
    tryAddLoan('보금자리론', rate, limit);
  }

  // 일반주담대 (남는 한도까지)
  tryAddLoan('일반 주담대', NORMAL_RATE, Infinity);

  // 4. 수도권 6억 캡 적용 (캡이 있는 케이스)
  if (loanCap !== Infinity && totalLoan > loanCap) {
    // 가장 비싼 금리부터 깎는다
    let overflow = totalLoan - loanCap;
    pieces.sort((a, b) => b.rate - a.rate);
    for (const p of pieces) {
      if (overflow <= 0) break;
      const cut = Math.min(overflow, p.amount);
      p.amount = parseFloat((p.amount - cut).toFixed(2));
      p.monthlyPayment = monthlyFixed(p.amount, p.rate, i.borrowingYear);
      p.totalInterest = parseFloat(totalInterestFixed(p.amount, p.rate, i.borrowingYear).toFixed(2));
      overflow -= cut;
    }
    pieces.sort((a, b) => a.rate - b.rate);
    totalLoan = pieces.reduce((s, p) => s + p.amount, 0);
  }

  // 5. 디딤돌 사용시 주택가격 상한 적용
  let maxPropertyPrice = myAssetEok + totalLoan;
  const warnings: string[] = [];
  const usingDidimdol = pieces.some(p => p.name.includes('디딤돌'));
  const usingBogeumjari = pieces.some(p => p.name === '보금자리론');

  if (usingDidimdol && !pieces.some(p => p.name === '신생아특례 디딤돌')) {
    const cap = getDidimdolPriceCap({
      isMarried: i.isMarried, isHavingKids: i.isHavingKids, kidsCount: i.kidsCount,
      isNewCouple: i.isNewCouple, internationalAge,
    });
    if (maxPropertyPrice > cap) {
      maxPropertyPrice = cap;
      warnings.push(`디딤돌 사용 시 주택가격 ${cap}억 이하 제한`);
    }
  }
  if (pieces.some(p => p.name === '신생아특례 디딤돌') && maxPropertyPrice > NEW_BORN_PRICE_CAP) {
    maxPropertyPrice = NEW_BORN_PRICE_CAP;
    warnings.push(`신생아특례 사용 시 주택가격 ${NEW_BORN_PRICE_CAP}억 이하 제한`);
  }
  if (usingBogeumjari && maxPropertyPrice > BOGEUMJARI_PRICE_CAP) {
    // 보금자리 빼고 일반주담대로 채워넣기
    warnings.push(`보금자리는 ${BOGEUMJARI_PRICE_CAP}억 이하 주택만 — 미적용`);
    const idx = pieces.findIndex(p => p.name === '보금자리론');
    if (idx >= 0) pieces.splice(idx, 1);
    totalLoan = pieces.reduce((s, p) => s + p.amount, 0);
    maxPropertyPrice = myAssetEok + totalLoan;
  }

  if (caseKey !== 'NON_REGULATED') {
    warnings.push(`수도권/규제 → 주담대 한도 ${CAPITAL_LOAN_CAP}억 캡 적용`);
  }
  if (caseKey === 'GANGNAM3_YONGSAN') {
    warnings.push('자금조달계획서 + 실거주 의무(2년) 필수');
  } else if (caseKey === 'OTHER_REGULATED') {
    warnings.push('자금조달계획서 + 실거주 의무 적용 가능');
  }

  // 6. 스트레스 DSR 카운터팩추얼
  const usedRateAvg = pieces.reduce((s, p) => s + p.rate * p.amount, 0) / Math.max(totalLoan, 0.01);
  const unstressedCap = calcUnstressedLoanCapacity(yearIncome, usedRateAvg || NORMAL_RATE, i.borrowingYear);
  const stressedCap = calcStressedLoanCapacity(yearIncome, usedRateAvg || NORMAL_RATE, i.borrowingYear);
  const stressDsrImpact = parseFloat((unstressedCap - stressedCap).toFixed(2));

  const monthlyTotal = pieces.reduce((s, p) => s + p.monthlyPayment, 0);

  return {
    caseKey,
    caseLabel: caseLabel(caseKey),
    myAssetEok: parseFloat(myAssetEok.toFixed(2)),
    ltv,
    loanCap,
    maxLoan: parseFloat(totalLoan.toFixed(2)),
    maxPropertyPrice: parseFloat(maxPropertyPrice.toFixed(2)),
    loanPieces: pieces,
    monthlyTotal,
    yearlyDsrUsed: yearlyDsr / 10000,
    stressDsrImpact,
    warnings,
  };
};

// ─── 3케이스 묶어서 ───
export const calcAllCases = (i: Inputs): Record<CaseKey, CaseResult> => ({
  GANGNAM3_YONGSAN: calcCase(i, 'GANGNAM3_YONGSAN'),
  OTHER_REGULATED:  calcCase(i, 'OTHER_REGULATED'),
  NON_REGULATED:    calcCase(i, 'NON_REGULATED'),
});
