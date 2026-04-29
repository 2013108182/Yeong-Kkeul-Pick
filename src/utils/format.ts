// 만원 → 보기 좋은 한글 (예: 30000 → "3억")
export const formatManwon = (manwon: number): string => {
  if (manwon === 0) return '0원';
  const absVal = Math.abs(manwon);
  const eok = Math.floor(absVal / 10000);
  const rem = absVal % 10000;
  let out = '';
  if (eok > 0) out += `${eok}억`;
  if (rem > 0) out += `${eok > 0 ? ' ' : ''}${rem.toLocaleString()}만`;
  if (manwon < 0) out = '-' + out;
  return out + '원';
};

// 억(소수점) → 보기 좋은 한글 (예: 8.32 → "8억 3,200만")
export const formatEok = (eok: number): string => {
  if (eok === 0) return '0원';
  const total = Math.round(eok * 10000);  // 만원 단위로 환산
  return formatManwon(total);
};

// 천단위 콤마
export const comma = (n: number): string => n.toLocaleString();

// 원 → "○원" with 콤마
export const formatWon = (won: number): string => `${comma(Math.round(won))}원`;

// 평 → ㎡
export const pyeongToM2 = (p: number) => Math.round(p * 3.3058);
