/**
 * 2026년 4월 기준 부동산 대출 정책 상수
 *
 * ⚠️ 단위 규칙 (전체 파일 통일):
 *   - 소득/자산: 만원 (yearIncome: 7000 = 7천만원)
 *   - 대출 한도/주택 가격: 억 (eok: 4 = 4억)
 *   - 금리: % (rate: 3.5 = 3.5%)
 *
 * ⚠️ 정책은 자주 바뀝니다. 운영 시에는 백엔드/CMS로 외부화 권장.
 */

// ─── 디딤돌 대출 금리 (소득 구간 만원 × 대출기간 → 기본금리 %) ───
export const DIDIMDOL_RATE = {
  '<=2000':  { 10: 2.85, 15: 2.95, 20: 3.05, 30: 3.10, 40: 3.10 },
  '<=4000':  { 10: 3.20, 15: 3.30, 20: 3.40, 30: 3.45, 40: 3.45 },
  '<=6000':  { 10: 3.50, 15: 3.60, 20: 3.70, 30: 3.75, 40: 3.75 },
  '<=7000':  { 10: 3.85, 15: 3.95, 20: 4.05, 30: 4.10, 40: 4.10 },
} as const;

export const DIDIMDOL_LIMIT_BASE        = 2.5;  // 억
export const DIDIMDOL_LIMIT_BONUS_2KIDS = 1.5;  // 억 (결혼+2자녀↑ → 4억)
export const DIDIMDOL_LIMIT_BONUS_NEW_COUPLE = 0.5; // 억 (신혼 → 3억)
export const DIDIMDOL_RATE_FLOOR        = 1.5;  // %

// 디딤돌 주택가격 상한 (억)
export const DIDIMDOL_PRICE_CAP = {
  GENERAL:    5,
  PRIME:      6,   // 신혼 or 2자녀↑
  YOUNG_SOLO: 3,   // 30세↑ 미혼
};

// ─── 신생아특례 디딤돌 (억, %) ───
export const NEW_BORN_RATE = {
  '<=5000':  { specialPeriod: 1.80, normalAfter: 3.30 },
  '<=6500':  { specialPeriod: 2.10, normalAfter: 3.60 },
  '<=8500':  { specialPeriod: 2.50, normalAfter: 3.90 },
  '<=10000': { specialPeriod: 2.90, normalAfter: 4.20 },
  '<=13000': { specialPeriod: 3.30, normalAfter: 4.50 },
} as const;
export const NEW_BORN_LIMIT     = 4;  // 억
export const NEW_BORN_PRICE_CAP = 9;  // 억

// ─── 보금자리론 (억, %) ───
export const BOGEUMJARI_RATE: Record<number, number> = {
  10: 3.90, 15: 4.00, 20: 4.10, 30: 4.20, 40: 4.25,
};
export const BOGEUMJARI_LIMIT_BASE  = 3.6;  // 억
export const BOGEUMJARI_LIMIT_FIRST = 4.2;  // 억 (생애최초)
export const BOGEUMJARI_LIMIT_KIDS3 = 4.0;  // 억 (다자녀)
export const BOGEUMJARI_PRICE_CAP   = 6;    // 억

// ─── 일반 주담대 ───
export const NORMAL_RATE = 5.50; // %

// ─── 스트레스 DSR 3단계 (2025.07~) ───
export const STRESS_RATE_CAPITAL = 3.0;  // %p 가산 (수도권, 스트레스 DSR 3단계 2026.04~)
export const STRESS_RATE_LOCAL   = 0.75; // %p 가산 (지방)
export const DSR_LIMIT           = 0.40; // 40%

// ─── LTV (%) ───
export const LTV = {
  GENERAL: 70, // 수도권 전역 생애최초 포함 최대 70% (2026.04~)
};

// ─── 수도권 주담대 한도 캡 (주택 가격 기준, 억) ───
export const getCapitalLoanCap = (priceEok: number): number => {
  if (priceEok <= 15) return 6;
  if (priceEok <= 25) return 4;
  return 2;
};

// ─── 취득세율 (주택 가격 억 기준, 1주택) ───
// 6억 이하: 1%, 6~9억: 1~3% 선형, 9억 초과: 3%
export const getAcquisitionTaxRate = (priceEok: number): number => {
  if (priceEok <= 6) return 0.01;
  if (priceEok <= 9) return 0.01 + (priceEok - 6) / 3 * 0.02;
  return 0.03;
};

// 취득세 계산 (억 → 만원)
export const calcAcquisitionTax = (priceEok: number): number => {
  const rate = getAcquisitionTaxRate(priceEok);
  return Math.round(priceEok * 10000 * rate);
};

// ─── 중개수수료 계산 (억 → 만원) ───
// 2021년 10월 개편 기준
export const calcBrokerageFee = (priceEok: number): number => {
  const priceWon = priceEok * 10000; // 만원
  let rate: number;
  if (priceWon < 5000)       rate = 0.006;
  else if (priceWon < 20000) rate = 0.005;
  else if (priceWon < 90000) rate = 0.004; // 9억 미만
  else                        rate = 0.009; // 9억 이상 (협의, 상한)
  const fee = priceWon * rate;
  // 상한 한도
  const caps: [number, number][] = [
    [5000, 250], [20000, 800], [90000, Infinity],
  ];
  for (const [limit, cap] of caps) {
    if (priceWon < limit) return Math.min(Math.round(fee), cap);
  }
  return Math.round(fee);
};

// ─── 자격 판정 헬퍼 ───
export const isAbleDidimdol = (
  yearIncome: number,   // 만원
  isMarried: boolean,
  isHavingKids: boolean,
  isNewCouple: boolean,
) => {
  if (yearIncome <= 6000) return true;
  if ((isMarried && isHavingKids) || (isMarried && isNewCouple)) return yearIncome <= 7000;
  return false;
};

export const isAbleNewBornSpecial = (
  hasNewBorn2yr: boolean,
  yearIncome: number,   // 만원
  isDualIncome: boolean,
) => {
  if (!hasNewBorn2yr) return false;
  return isDualIncome ? yearIncome <= 20000 : yearIncome <= 13000;
};

export const isAbleBogeumjari = (
  yearIncome: number,   // 만원
  isNewCouple: boolean,
  kidsCount: number,
) => {
  if (yearIncome <= 7000) return true;
  if (isNewCouple && yearIncome <= 8500) return true;
  if (kidsCount >= 1 && yearIncome <= 8000) return true;
  if (kidsCount >= 2 && yearIncome <= 9000) return true;
  if (kidsCount >= 3 && yearIncome <= 10000) return true;
  return false;
};

// ─── 디딤돌 우대금리 계산 (%p) ───
export const getDidimdolPrimeRate = (i: {
  isMarried: boolean;
  isHavingKids: boolean;
  kidsCount: number;
  isNewCouple: boolean;
  isFirstTime: boolean;
  isSingleParent: boolean;
  isMultiCultural: boolean;
  isDisabled: boolean;
  yearIncome: number; // 만원
}) => {
  let p = 0;
  if (i.isMarried && i.isHavingKids) {
    if (i.kidsCount === 1)    p += 0.3;
    else if (i.kidsCount === 2) p += 0.5;
    else if (i.kidsCount >= 3) p += 0.7;
  }
  if (i.isSingleParent && i.yearIncome <= 6000) p += 0.5;
  if (i.isMarried && i.isNewCouple)   p += 0.2;
  if (i.isFirstTime)                  p += 0.2;
  if (i.isMultiCultural)              p += 0.2;
  if (i.isDisabled)                   p += 0.2;
  return p;
};

// ─── 소득 구간별 디딤돌 기본금리 ───
export const getDidimdolBaseRate = (yearIncome: number, year: 10 | 15 | 20 | 30 | 40): number => {
  if (yearIncome <= 2000) return DIDIMDOL_RATE['<=2000'][year];
  if (yearIncome <= 4000) return DIDIMDOL_RATE['<=4000'][year];
  if (yearIncome <= 6000) return DIDIMDOL_RATE['<=6000'][year];
  return DIDIMDOL_RATE['<=7000'][year];
};

// ─── 신생아특례 기본금리 ───
export const getNewBornBaseRate = (yearIncome: number): number => {
  if (yearIncome <= 5000)  return NEW_BORN_RATE['<=5000'].specialPeriod;
  if (yearIncome <= 6500)  return NEW_BORN_RATE['<=6500'].specialPeriod;
  if (yearIncome <= 8500)  return NEW_BORN_RATE['<=8500'].specialPeriod;
  if (yearIncome <= 10000) return NEW_BORN_RATE['<=10000'].specialPeriod;
  return NEW_BORN_RATE['<=13000'].specialPeriod;
};

// ─── 디딤돌 한도 (억) ───
export const getDidimdolLimit = (i: {
  isMarried: boolean;
  isHavingKids: boolean;
  kidsCount: number;
  isNewCouple: boolean;
  internationalAge: number;
}): number => {
  let limit = DIDIMDOL_LIMIT_BASE;
  if (i.isMarried && i.isHavingKids && i.kidsCount >= 2)
    limit += DIDIMDOL_LIMIT_BONUS_2KIDS;
  else if (i.isMarried && i.isNewCouple)
    limit += DIDIMDOL_LIMIT_BONUS_NEW_COUPLE;
  if (!i.isMarried && i.internationalAge >= 30) limit -= 1.0;
  return Math.max(limit, 1.5);
};

// ─── 디딤돌 주택 가격 상한 (억) ───
export const getDidimdolPriceCap = (i: {
  isMarried: boolean;
  isHavingKids: boolean;
  kidsCount: number;
  isNewCouple: boolean;
  internationalAge: number;
}): number => {
  if (i.isMarried && i.isNewCouple) return DIDIMDOL_PRICE_CAP.PRIME;
  if (i.isMarried && i.isHavingKids && i.kidsCount >= 2) return DIDIMDOL_PRICE_CAP.PRIME;
  if (!i.isMarried && i.internationalAge >= 30) return DIDIMDOL_PRICE_CAP.YOUNG_SOLO;
  return DIDIMDOL_PRICE_CAP.GENERAL;
};

// ─── 보금자리 한도 (억) ───
export const getBogeumjariLimit = (isFirstTime: boolean, kidsCount: number): number => {
  if (isFirstTime) return BOGEUMJARI_LIMIT_FIRST;
  if (kidsCount >= 3) return BOGEUMJARI_LIMIT_KIDS3;
  return BOGEUMJARI_LIMIT_BASE;
};

// ─── 만 나이 계산 ───
export const getInternationalAge = (birthday: string): number => {
  if (!birthday) return 30;
  const b = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
};
