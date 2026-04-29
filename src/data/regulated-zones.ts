/**
 * 2026년 4월 기준 토지거래허가구역(아파트) 매핑
 * 출처:
 *  - 서울시 도시계획위원회 2025.09.17 (강남3구·용산 1년 3개월 재지정)
 *  - 서울시 신통기획 후보지 8곳 (2025.09.30~2026.08.30)
 *  - 정부 10·15 부동산대책 경기 12곳 (2025)
 *  - 인천경제자유구역 IFEZ (송도/청라/영종)
 *
 * 분류 기준 (3 케이스):
 *   GANGNAM3_YONGSAN — 강남3구 + 용산 (가장 강한 규제)
 *   OTHER_REGULATED  — 기타 토허제 지정 구역
 *   NON_REGULATED    — 토허제 미지정 (디폴트)
 */

export type RegulationLevel = 'GANGNAM3_YONGSAN' | 'OTHER_REGULATED' | 'NON_REGULATED';

export type Region = {
  code: string;       // 행자부 표준 코드 (5자리)
  name: string;       // 표시명
  province: '서울' | '경기' | '인천';
  regulation: RegulationLevel;
  note?: string;      // 부분지정 등 메모
};

export const REGIONS: Region[] = [
  // ─── 서울 강남3구 + 용산 (GANGNAM3_YONGSAN) ───
  { code: '11680', name: '강남구',     province: '서울', regulation: 'GANGNAM3_YONGSAN', note: '아파트 전체 토허제 ~2026.12.31' },
  { code: '11650', name: '서초구',     province: '서울', regulation: 'GANGNAM3_YONGSAN', note: '아파트 전체 토허제 ~2026.12.31' },
  { code: '11710', name: '송파구',     province: '서울', regulation: 'GANGNAM3_YONGSAN', note: '아파트 전체 토허제 ~2026.12.31' },
  { code: '11170', name: '용산구',     province: '서울', regulation: 'GANGNAM3_YONGSAN', note: '아파트 전체 토허제 ~2026.12.31' },

  // ─── 서울 신통기획 후보지 (OTHER_REGULATED, 부분 지정) ───
  { code: '11560', name: '영등포구',   province: '서울', regulation: 'OTHER_REGULATED', note: '도림동 일부 신통기획 토허제' },
  { code: '11305', name: '강북구',     province: '서울', regulation: 'OTHER_REGULATED', note: '미아동 일부 신통기획 토허제' },
  { code: '11320', name: '도봉구',     province: '서울', regulation: 'OTHER_REGULATED', note: '방학동 일부 신통기획 토허제' },
  { code: '11590', name: '동작구',     province: '서울', regulation: 'OTHER_REGULATED', note: '상도·사당동 일부 신통기획 토허제' },
  { code: '11440', name: '마포구',     province: '서울', regulation: 'OTHER_REGULATED', note: '아현동 일부 신통기획 토허제' },
  { code: '11530', name: '구로구',     province: '서울', regulation: 'OTHER_REGULATED', note: '가리봉동 일부 공공재개발 토허제' },

  // ─── 서울 비규제 자치구 ───
  { code: '11110', name: '종로구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11140', name: '중구',       province: '서울', regulation: 'NON_REGULATED' },
  { code: '11200', name: '성동구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11215', name: '광진구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11230', name: '동대문구',   province: '서울', regulation: 'NON_REGULATED' },
  { code: '11260', name: '중랑구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11290', name: '성북구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11350', name: '노원구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11380', name: '은평구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11410', name: '서대문구',   province: '서울', regulation: 'NON_REGULATED' },
  { code: '11470', name: '양천구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11500', name: '강서구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11545', name: '금천구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11620', name: '관악구',     province: '서울', regulation: 'NON_REGULATED' },
  { code: '11740', name: '강동구',     province: '서울', regulation: 'NON_REGULATED' },

  // ─── 경기 12곳 (10·15 대책 OTHER_REGULATED) ───
  { code: '41290', name: '과천시',         province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41210', name: '광명시',         province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41135', name: '성남시 분당구',  province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41131', name: '성남시 수정구',  province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41133', name: '성남시 중원구',  province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41117', name: '수원시 영통구',  province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41111', name: '수원시 장안구',  province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41115', name: '수원시 팔달구',  province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41173', name: '안양시 동안구',  province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41465', name: '용인시 수지구',  province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41430', name: '의왕시',         province: '경기', regulation: 'OTHER_REGULATED' },
  { code: '41450', name: '하남시',         province: '경기', regulation: 'OTHER_REGULATED' },

  // ─── 경기 비규제 (선별) ───
  { code: '41281', name: '고양시 덕양구',  province: '경기', regulation: 'NON_REGULATED' },
  { code: '41285', name: '고양시 일산동구', province: '경기', regulation: 'NON_REGULATED' },
  { code: '41287', name: '고양시 일산서구', province: '경기', regulation: 'NON_REGULATED' },
  { code: '41310', name: '구리시',         province: '경기', regulation: 'NON_REGULATED' },
  { code: '41360', name: '남양주시',       province: '경기', regulation: 'NON_REGULATED' },
  { code: '41410', name: '시흥시',         province: '경기', regulation: 'NON_REGULATED' },
  { code: '41271', name: '안양시 만안구',  province: '경기', regulation: 'NON_REGULATED' },
  { code: '41463', name: '용인시 처인구',  province: '경기', regulation: 'NON_REGULATED' },
  { code: '41370', name: '오산시',         province: '경기', regulation: 'NON_REGULATED' },
  { code: '41590', name: '화성시',         province: '경기', regulation: 'NON_REGULATED' },
  { code: '41390', name: '평택시',         province: '경기', regulation: 'NON_REGULATED' },
  { code: '41480', name: '파주시',         province: '경기', regulation: 'NON_REGULATED' },
  { code: '41570', name: '김포시',         province: '경기', regulation: 'NON_REGULATED' },

  // ─── 인천 IFEZ (OTHER_REGULATED, 외국인 토허제 포함) ───
  { code: '28185', name: '연수구 (송도IFEZ)', province: '인천', regulation: 'OTHER_REGULATED', note: 'IFEZ 토허제 유지' },
  { code: '28260', name: '서구 (청라IFEZ)',   province: '인천', regulation: 'OTHER_REGULATED', note: 'IFEZ 토허제 유지' },
  { code: '28110', name: '중구 (영종IFEZ)',   province: '인천', regulation: 'OTHER_REGULATED', note: '2026.7 영종구로 분리 예정' },

  // ─── 인천 비규제 ───
  { code: '28177', name: '미추홀구',       province: '인천', regulation: 'NON_REGULATED' },
  { code: '28200', name: '남동구',         province: '인천', regulation: 'NON_REGULATED' },
  { code: '28237', name: '부평구',         province: '인천', regulation: 'NON_REGULATED' },
  { code: '28245', name: '계양구',         province: '인천', regulation: 'NON_REGULATED' },
  { code: '28140', name: '동구',           province: '인천', regulation: 'NON_REGULATED', note: '2026.7 제물포구로 통합 예정' },
];

export const REGION_BY_CODE: Record<string, Region> = REGIONS.reduce(
  (acc, r) => ({ ...acc, [r.code]: r }),
  {} as Record<string, Region>
);

export const REGIONS_BY_LEVEL: Record<RegulationLevel, Region[]> = {
  GANGNAM3_YONGSAN: REGIONS.filter(r => r.regulation === 'GANGNAM3_YONGSAN'),
  OTHER_REGULATED:  REGIONS.filter(r => r.regulation === 'OTHER_REGULATED'),
  NON_REGULATED:    REGIONS.filter(r => r.regulation === 'NON_REGULATED'),
};

export const REGIONS_BY_PROVINCE: Record<string, Region[]> = {
  서울: REGIONS.filter(r => r.province === '서울'),
  경기: REGIONS.filter(r => r.province === '경기'),
  인천: REGIONS.filter(r => r.province === '인천'),
};

export const isCapitalArea = (province: string) => ['서울', '경기', '인천'].includes(province);
