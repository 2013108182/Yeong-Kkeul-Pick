/**
 * 2026년 4월 기준 부동산 대출 정책 상수
 *
 * ⚠️ 정책은 자주 바뀝니다. 운영 시에는 백엔드/CMS로 외부화 권장.
 * 현재 값은 공개된 한국주택금융공사·금융위 자료, 시중은행 공시를 종합한 추정치.
 */

// ─── 디딤돌 대출 (소득 구간 × 대출기간 → 기본금리) ───
export const DIDIMDOL_RATE = {
  '<=2000':  { 10: 2.85, 15: 2.95, 20: 3.05, 30: 3.10, 40: 3.10 },
  '<=4000':  { 10: 3.20, 15: 3.30, 20: 3.40, 30: 3.45, 40: 3.45 },
  '<=6000':  { 10: 3.50, 15: 3.60, 20: 3.70, 30: 3.75, 40: 3.75 },
  '<=7000':  { 10: 3.85, 15: 3.95, 20: 4.05, 30: 4.10, 40: 4.10 }, // 신혼/다자녀 한정 7000까지
} as const;

export const DIDIMDOL_LIMIT_BASE = 2.5;        // 억
export const DIDIMDOL_LIMIT_BONUS_2KIDS = 1.5; // 결혼+자녀+2자녀↑ → 한도 4억
export const DIDIMDOL_LIMIT_BONUS_NEW_COUPLE = 0.5; // 신혼 → +0.5억
export const DIDIMDOL_RATE_FLOOR = 1.5;        // 우대 후 최저금리

// ─── 디딤돌 사용 시 주택가격 상한 (억) ───
export const DIDIMDOL_PRICE_CAP = {
  GENERAL: 5,        // 기본
  PRIME:   6,        // 신혼 OR 결혼+자녀+2자녀↑
  YOUNG_SOLO: 3,     // 30세↑ 미혼
};

// ─── 신생아특례 디딤돌 ───
// 2년 내 출산 + 부부합산 1.3억 (맞벌이 2억) 이하 + 무주택/1주택(대환)
export const NEW_BORN_RATE = {
  '<=5000':  { specialPeriod: 1.80, normalAfter: 3.30 },  // 5년 특례 + 이후
  '<=6500':  { specialPeriod: 2.10, normalAfter: 3.60 },
  '<=8500':  { specialPeriod: 2.50, normalAfter: 3.90 },
  '<=10000': { specialPeriod: 2.90, normalAfter: 4.20 },
  '<=13000': { specialPeriod: 3.30, normalAfter: 4.50 },
} as const;
export const NEW_BORN_LIMIT = 4;                // 억
export const NEW_BORN_PRICE_CAP = 9;            // 억

// ─── 보금자리론 (특례보금자리 폐지 후 2026.1 인상안) ───
export const BOGEUMJARI_RATE = { 10: 3.90, 15: 4.00, 20: 4.10, 30: 4.20, 40: 4.25 } as const;
export const BOGEUMJARI_LIMIT_BASE = 3.6;       // 억
export const BOGEUMJARI_LIMIT_FIRST = 4.2;      // 생애최초
export const BOGEUMJARI_LIMIT_KIDS3 = 4.0;      // 다자녀
export const BOGEUMJARI_PRICE_CAP = 6;          // 6억 이하 주택만

// ─── 일반 주택담보대출 (시중은행 평균 변동금리 추정) ───
export const NORMAL_RATE = 5.50;

// ─── 스트레스 DSR 3단계 (2025.07 시행) ───
export const STRESS_RATE_CAPITAL = 1.5;  // 수도권 (서울·인천·경기)
export const STRESS_RATE_LOCAL = 0.75;
export const DSR_LIMIT = 0.40;           // 은행 40%

// ─── LTV ───
export const LTV = {
  FIRSTTIME_NON_REGULATED: 80,   // 생애최초 + 비규제
  FIRSTTIME_REGULATED:     70,   // 생애최초 + 수도권/규제지역
  GENERAL:                 70,   // 일반
};

// ─── 수도권/규제지역 주담대 한도 캡 (2025) ───
export const CAPITAL_LOAN_CAP = 6;       // 억

// ─── 자격 판정 헬퍼 ───
export const isAbleDidimdol = (yearIncome: number, isMarried: boolean, isHavingKids: boolean, isNewCouple: boolean) => {
  if (yearIncome <= 6000) return true;
  if ((isMarried && isHavingKids) || (isMarried && isNewCouple)) return yearIncome <= 7000;
  return false;
};

export const isAbleNewBornSpecial = (
  hasNewBorn2yr: boolean,
  yearIncome: number,
  isDualIncome: boolean
) => {
  if (!hasNewBorn2yr) return false;
  return isDualIncome ? yearIncome <= 20000 : yearIncome <= 13000;
};

export const isAbleBogeumjari = (
  yearIncome: number,
  isNewCouple: boolean,
  kidsCount: number
) => {
  if (yearIncome <= 7000) return true;
  if (isNewCouple && yearIncome <= 8500) return true;
  if (kidsCount >= 1 && yearIncome <= 8000) return true;
  if (kidsCount >= 2 && yearIncome <= 9000) return true;
  if (kidsCount >= 3 && yearIncome <= 10000) return true;
  return false;
};

// ─── 디딤돌 우대금리 계산 ───
export const getDidimdolPrimeRate = (i: {
  isMarried: boolean;
  isHavingKids: boolean;
  kidsCount: number;
  isNewCouple: boolean;
  isFirstTime: boolean;
  isSingleParent: boolean;
  isMultiCultural: boolean;
  isDisabled: boolean;
  yearIncome: number;
}) => {
  let p = 0;
  if (i.isMarried && i.isHavingKids) {
    if (i.kidsCount === 1) p += 0.3;
    else if (i.kidsCount === 2) p += 0.5;
    else if (i.kidsCount >= 3) p += 0.7;
  }
  if (i.isSingleParent && i.yearIncome <= 6000) p += 0.5;
  if (i.isMarried && i.isNewCouple) p += 0.2;
  if (i.isFirstTime) p += 0.2;
  if (i.isMultiCultural) p += 0.2;
  if (i.isDisabled) p += 0.2;
  return p;
};

// ─── 소득 구간별 디딤돌 베이스 금리 ───
export const getDidimdolBaseRate = (yearIncome: number, year: 10|15|20|30|40): number => {
  if (yearIncome <= 2000) return DIDIMDOL_RATE['<=2000'][year];
  if (yearIncome <= 4000) return DIDIMDOL_RATE['<=4000'][year];
  if (yearIncome <= 6000) return DIDIMDOL_RATE['<=6000'][year];
  return DIDIMDOL_RATE['<=7000'][year];
};

// ─── 신생아특례 베이스 금리 ───
export const getNewBornBaseRate = (yearIncome: number) => {
  if (yearIncome <= 5000)  return NEW_BORN_RATE['<=5000'].specialPeriod;
  if (yearIncome <= 6500)  return NEW_BORN_RATE['<=6500'].specialPeriod;
  if (yearIncome <= 8500)  return NEW_BORN_RATE['<=8500'].specialPeriod;
  if (yearIncome <= 10000) return NEW_BORN_RATE['<=10000'].specialPeriod;
  return NEW_BORN_RATE['<=13000'].specialPeriod;
};

// ─── 디딤돌 한도 계산 ───
export const getDidimdolLimit = (i: {
  isMarried: boolean;
  isHavingKids: boolean;
  kidsCount: number;
  isNewCouple: boolean;
  internationalAge: number;
}) => {
  let limit = DIDIMDOL_LIMIT_BASE; // 2.5억
  if (i.isMarried && i.isHavingKids && i.kidsCount >= 2) limit += DIDIMDOL_LIMIT_BONUS_2KIDS; // 4억
  else if (i.isMarried && i.isNewCouple) limit += DIDIMDOL_LIMIT_BONUS_NEW_COUPLE;            // 3억
  if (!i.isMarried && i.internationalAge >= 30) limit -= 1.0;                                  // 1.5억
  return Math.max(limit, 1.5);
};

// ─── 디딤돌 주택 가격 상한 ───
export const getDidimdolPriceCap = (i: {
  isMarried: boolean;
  isHavingKids: boolean;
  kidsCount: number;
  isNewCouple: boolean;
  internationalAge: number;
}) => {
  if (i.isMarried && i.isNewCouple) return DIDIMDOL_PRICE_CAP.PRIME;
  if (i.isMarried && i.isHavingKids && i.kidsCount >= 2) return DIDIMDOL_PRICE_CAP.PRIME;
  if (!i.isMarried && i.internationalAge >= 30) return DIDIMDOL_PRICE_CAP.YOUNG_SOLO;
  return DIDIMDOL_PRICE_CAP.GENERAL;
};

// ─── 보금자리 한도 ───
export const getBogeumjariLimit = (isFirstTime: boolean, kidsCount: number) => {
  if (isFirstTime) return BOGEUMJARI_LIMIT_FIRST;
  if (kidsCount >= 3) return BOGEUMJARI_LIMIT_KIDS3;
  return BOGEUMJARI_LIMIT_BASE;
};

// ─── 만나이 ───
export const getInternationalAge = (birthday: string): number => {
  const b = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
};
