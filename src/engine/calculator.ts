/**
 * 2026년 정책 반영 영끌 계산 엔진 (단위 통일 버전)
 *
 * ★ 단위 규칙
 *   Inputs.yearIncome  : 만원  (예: 7000 = 7천만원)
 *   Inputs.myAsset     : 만원  (예: 20000 = 2억)
 *   대출 한도/가격      : 억
 *   monthlyPayment     : 원
 *   취득세/중개수수료   : 만원
 */

import {
  DSR_LIMIT,
  STRESS_RATE_CAPITAL,
  NORMAL_RATE,
  LTV,
  getCapitalLoanCap,
  isAbleDidimdol,
  isAbleNewBornSpecial,
  isAbleBogeumjari,
  getDidimdolBaseRate,
  getDidimdolPrimeRate,
  getDidimdolLimit,
  getDidimdolPriceCap,
  getNewBornBaseRate,
  NEW_BORN_LIMIT,
  NEW_BORN_PRICE_CAP,
  BOGEUMJARI_RATE,
  BOGEUMJARI_PRICE_CAP,
  getBogeumjariLimit,
  DIDIMDOL_RATE_FLOOR,
  getInternationalAge,
  calcAcquisitionTax,
  calcBrokerageFee,
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
  yearIncome: number;    // 만원
  myAsset: number;       // 만원
  monthlySaving: number; // 만원
  borrowingYear: 10 | 15 | 20 | 30 | 40;
  paymentType: 'fixed' | 'fixedPrincipal' | 'gradual';
  kidsCount: number;
  isHavingKids: boolean;
  isSingleParent: boolean;
  isMultiCultural: boolean;
  isDisabled: boolean;
};

export type LoanPiece = {
  name: string;
  amount: number;         // 억
  rate: number;           // %
  monthlyPayment: number; // 원
  totalInterest: number;  // 억
};

export type EntryCost = {
  propertyPrice:  number; // 억
  acquisitionTax: number; // 만원
  brokerageFee:   number; // 만원
  totalCost:      number; // 만원
  requiredCash:   number; // 만원 (실 현금 필요액)
};

export type CaseResult = {
  caseKey: CaseKey;
  caseLabel: string;
  myAssetEok: number;
  ltv: number;
  loanCap: number;
  maxLoan: number;
  maxPropertyPrice: number;
  loanPieces: LoanPiece[];
  monthlyTotal: number;
  yearlyDsrUsed: number;
  stressDsrImpact: number;
  entryCost: EntryCost;
  warnings: string[];
};

// ─── 원리금균등 월 상환액 (원) ───
const monthlyFixed = (principalEok: number, ratePct: number, years: number): number => {
  if (principalEok <= 0) return 0;
  const principal = principalEok * 1e8;
  const i = ratePct / 100 / 12;
  const n = years * 12;
  if (i === 0) return Math.ceil(principal / n);
  return Math.ceil((principal * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1));
};

const totalInterestFixed = (principalEok: number, ratePct: number, years: number): number => {
  if (principalEok <= 0) return 0;
  const monthly = monthlyFixed(principalEok, ratePct, years);
  return parseFloat(((monthly * years * 12 - principalEok * 1e8) / 1e8).toFixed(2));
};

// yearIncomeMw: 만원 → ×10000 → 원 → ×DSR
const dsrAvailableYearly = (yearIncomeMw: number): number =>
  yearIncomeMw * 10000 * DSR_LIMIT;

const principalFromYearlyPayment = (yearlyWon: number, ratePct: number, years: number): number => {
  if (yearlyWon <= 0 || years <= 0) return 0;
  const monthly = yearlyWon / 12;
  const i = ratePct / 100 / 12;
  const n = years * 12;
  if (i === 0) return (monthly * n) / 1e8;
  const factor = (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  return monthly / factor / 1e8;
};

const getLtvForCase = (_caseKey: CaseKey, _isFirstTime: boolean): number => LTV.GENERAL;

const CASE_LABEL: Record<CaseKey, string> = {
  GANGNAM3_YONGSAN: '강남3구·용산',
  OTHER_REGULATED:  '기타 토허제',
  NON_REGULATED:    '비토허제',
};

// ─── 단일 케이스 계산 ───
export const calcCase = (raw: Inputs, caseKey: CaseKey): CaseResult => {
  // ★ 입력값 강제 숫자 변환 — 빈 문자열·null 완전 방어
  const yearIncomeMw = Math.max(Number(raw.yearIncome) || 0, 0);
  const myAssetMw    = Math.max(Number(raw.myAsset)    || 0, 0);
  const myAssetEok   = myAssetMw / 10000; // 만원 → 억

  const internationalAge = getInternationalAge(raw.birthday);
  const ltv = getLtvForCase(caseKey, !!raw.isFirstTime);

  // 1. LTV 기반 최대 대출
  // 주택가격 × (1 - ltv/100) = 자기자본
  // → 주택가격 = 자기자본 / (1 - ltv/100)
  const maxPriceByLtv = myAssetEok / (1 - ltv / 100);
  const maxLoanByLtv  = maxPriceByLtv * (ltv / 100);

  // 2. 정책대출 자격
  const ableDidimdol   = isAbleDidimdol(yearIncomeMw, !!raw.isMarried, !!raw.isHavingKids, !!raw.isNewCouple);
  const ableNewBorn    = isAbleNewBornSpecial(!!raw.hasNewBorn2yr, yearIncomeMw, !!raw.isDualIncome);
  const ableBogeumjari = isAbleBogeumjari(yearIncomeMw, !!raw.isNewCouple, raw.kidsCount || 0);

  const yearlyDsrWon = dsrAvailableYearly(yearIncomeMw);

  // 3. 저금리 → 고금리 순 누적
  const pieces: LoanPiece[] = [];
  let remainYearly  = yearlyDsrWon;
  let remainLtvLoan = maxLoanByLtv;
  let totalLoan     = 0;

  const tryAddLoan = (name: string, rate: number, productLimitEok: number) => {
    if (remainYearly < 1000 || remainLtvLoan < 0.01) return;
    // DSR 심사: 스트레스 금리(+1.5%p)로 한도 산정
    const stressedRate = rate + STRESS_RATE_CAPITAL;
    const dsrPossible  = principalFromYearlyPayment(remainYearly, stressedRate, raw.borrowingYear);
    const cap          = Math.min(productLimitEok, remainLtvLoan, dsrPossible);
    if (cap < 0.01) return;

    const dsrUsedWon = monthlyFixed(cap, stressedRate, raw.borrowingYear) * 12;
    pieces.push({
      name,
      amount:         parseFloat(cap.toFixed(2)),
      rate:           parseFloat(rate.toFixed(2)),
      monthlyPayment: monthlyFixed(cap, rate, raw.borrowingYear),
      totalInterest:  totalInterestFixed(cap, rate, raw.borrowingYear),
    });
    remainYearly  -= dsrUsedWon;
    remainLtvLoan -= cap;
    totalLoan     += cap;
  };

  if (ableNewBorn) {
    tryAddLoan('신생아특례 디딤돌', getNewBornBaseRate(yearIncomeMw), NEW_BORN_LIMIT);
  }
  if (ableDidimdol && !pieces.some(p => p.name.includes('신생아'))) {
    const base  = getDidimdolBaseRate(yearIncomeMw, raw.borrowingYear);
    const prime = getDidimdolPrimeRate({
      isMarried: !!raw.isMarried, isHavingKids: !!raw.isHavingKids,
      kidsCount: raw.kidsCount || 0, isNewCouple: !!raw.isNewCouple,
      isFirstTime: !!raw.isFirstTime, isSingleParent: !!raw.isSingleParent,
      isMultiCultural: !!raw.isMultiCultural, isDisabled: !!raw.isDisabled,
      yearIncome: yearIncomeMw,
    });
    tryAddLoan('디딤돌', Math.max(base - prime, DIDIMDOL_RATE_FLOOR), getDidimdolLimit({
      isMarried: !!raw.isMarried, isHavingKids: !!raw.isHavingKids,
      kidsCount: raw.kidsCount || 0, isNewCouple: !!raw.isNewCouple, internationalAge,
    }));
  }
  if (ableBogeumjari) {
    tryAddLoan('보금자리론', BOGEUMJARI_RATE[raw.borrowingYear],
      getBogeumjariLimit(!!raw.isFirstTime, raw.kidsCount || 0));
  }
  tryAddLoan('일반 주담대', NORMAL_RATE, Infinity);

  // 4. 수도권 가격별 캡 (NON_REGULATED는 캡 없음)
  const tentativePrice = myAssetEok + totalLoan;
  const loanCap = caseKey === 'NON_REGULATED' ? Infinity : getCapitalLoanCap(tentativePrice);
  if (loanCap !== Infinity && totalLoan > loanCap) {
    let overflow = totalLoan - loanCap;
    pieces.sort((a, b) => b.rate - a.rate);
    for (const p of pieces) {
      if (overflow <= 0.001) break;
      const cut = Math.min(overflow, p.amount);
      p.amount         = parseFloat((p.amount - cut).toFixed(2));
      p.monthlyPayment = monthlyFixed(p.amount, p.rate, raw.borrowingYear);
      p.totalInterest  = totalInterestFixed(p.amount, p.rate, raw.borrowingYear);
      overflow -= cut;
    }
    pieces.sort((a, b) => a.rate - b.rate);
    totalLoan = pieces.reduce((s, p) => s + p.amount, 0);
  }

  // 5. 정책대출 주택가격 상한
  let maxPropertyPrice = myAssetEok + totalLoan;
  const warnings: string[] = [];

  const usingNewBorn    = pieces.some(p => p.name.includes('신생아'));
  const usingDidimdol   = pieces.some(p => p.name === '디딤돌');
  const usingBogeumjari = pieces.some(p => p.name === '보금자리론');

  if (usingNewBorn && maxPropertyPrice > NEW_BORN_PRICE_CAP) {
    maxPropertyPrice = NEW_BORN_PRICE_CAP;
    warnings.push(`신생아특례 → 주택가격 ${NEW_BORN_PRICE_CAP}억 이하 제한`);
  }
  if (usingDidimdol) {
    const cap = getDidimdolPriceCap({
      isMarried: !!raw.isMarried, isHavingKids: !!raw.isHavingKids,
      kidsCount: raw.kidsCount || 0, isNewCouple: !!raw.isNewCouple, internationalAge,
    });
    if (maxPropertyPrice > cap) {
      maxPropertyPrice = cap;
      warnings.push(`디딤돌 → 주택가격 ${cap}억 이하 제한`);
    }
  }
  if (usingBogeumjari && maxPropertyPrice > BOGEUMJARI_PRICE_CAP) {
    const idx = pieces.findIndex(p => p.name === '보금자리론');
    if (idx >= 0) pieces.splice(idx, 1);
    totalLoan        = pieces.reduce((s, p) => s + p.amount, 0);
    maxPropertyPrice = myAssetEok + totalLoan;
    warnings.push(`보금자리론은 ${BOGEUMJARI_PRICE_CAP}억 이하 주택만 가능 → 제외됨`);
  }

  if (caseKey !== 'NON_REGULATED') warnings.push(`수도권 규제 → 주담대 ${loanCap}억 캡 적용`);
  if (caseKey === 'GANGNAM3_YONGSAN') warnings.push('자금조달계획서 + 실거주 의무(2년) 필수');
  else if (caseKey === 'OTHER_REGULATED') warnings.push('자금조달계획서 + 실거주 의무 적용 가능');

  // 6. 스트레스 DSR 임팩트
  const avgRate = totalLoan > 0
    ? pieces.reduce((s, p) => s + p.rate * p.amount, 0) / totalLoan
    : NORMAL_RATE;
  const unstressed = principalFromYearlyPayment(yearlyDsrWon, avgRate, raw.borrowingYear);
  const stressed   = principalFromYearlyPayment(yearlyDsrWon, avgRate + STRESS_RATE_CAPITAL, raw.borrowingYear);
  const stressDsrImpact = parseFloat(Math.max(0, unstressed - stressed).toFixed(2));

  // 7. 취득세 + 중개수수료
  const acquisitionTax = calcAcquisitionTax(maxPropertyPrice); // 만원
  const brokerageFee   = calcBrokerageFee(maxPropertyPrice);   // 만원
  const propertyMw     = Math.round(maxPropertyPrice * 10000);
  const loanMw         = Math.round(totalLoan * 10000);

  const entryCost: EntryCost = {
    propertyPrice:  parseFloat(maxPropertyPrice.toFixed(2)),
    acquisitionTax,
    brokerageFee,
    totalCost:    propertyMw + acquisitionTax + brokerageFee,
    requiredCash: Math.max(0, propertyMw - loanMw + acquisitionTax + brokerageFee),
  };

  return {
    caseKey,
    caseLabel:        CASE_LABEL[caseKey],
    myAssetEok:       parseFloat(myAssetEok.toFixed(2)),
    ltv,
    loanCap,
    maxLoan:          parseFloat(totalLoan.toFixed(2)),
    maxPropertyPrice: parseFloat(maxPropertyPrice.toFixed(2)),
    loanPieces:       pieces.filter(p => p.amount > 0),
    monthlyTotal:     pieces.reduce((s, p) => s + p.monthlyPayment, 0),
    yearlyDsrUsed:    Math.round(yearlyDsrWon / 10000),
    stressDsrImpact,
    entryCost,
    warnings,
  };
};

export const calcAllCases = (raw: Inputs): Record<CaseKey, CaseResult> => ({
  GANGNAM3_YONGSAN: calcCase(raw, 'GANGNAM3_YONGSAN'),
  OTHER_REGULATED:  calcCase(raw, 'OTHER_REGULATED'),
  NON_REGULATED:    calcCase(raw, 'NON_REGULATED'),
});
