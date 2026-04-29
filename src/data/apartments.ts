/**
 * 아파트 큐레이션 풀 (2026년 4월 시세 기준 추정값)
 *
 * 6개 카테고리: station(역세권), reconstruction(재건축), school(학군),
 *              newBuild(신축), bigComplex(대단지), view(한강·숲세권)
 *
 * 가격 단위: 억 (億 KRW). 평형은 일반적으로 24/34평 위주.
 * 데이터 풀: 약 60개 (서울 35 / 경기 18 / 인천 7)
 */

export type CategoryKey = 'station' | 'reconstruction' | 'school' | 'newBuild' | 'bigComplex' | 'view';

export const CATEGORIES: { key: CategoryKey; label: string; emoji: string; tagline: string }[] = [
  { key: 'station',        label: '역세권',     emoji: '🚇', tagline: '출퇴근이 인생을 결정한다' },
  { key: 'reconstruction', label: '재건축',     emoji: '🏗️', tagline: '한 방을 노린다' },
  { key: 'school',         label: '학군',       emoji: '🎓', tagline: '아이 학교가 1순위' },
  { key: 'newBuild',       label: '신축',       emoji: '✨', tagline: '오래된 집은 못 산다' },
  { key: 'bigComplex',     label: '대단지',     emoji: '🏘️', tagline: '1,000세대 이상이 안전하다' },
  { key: 'view',           label: '한강·숲세권', emoji: '🌊', tagline: '뷰가 인생이다' },
];

export type Apartment = {
  id: string;
  name: string;
  regionCode: string;
  district: string;
  metro?: string;
  buildYear: number;
  totalUnits: number;
  sizes: { area: number; price: number }[];   // {평, 억}
  tags: CategoryKey[];
  oneLiner: string;
};

// 가격(억)은 2026.04 추정. 24평/34평 대표값.
export const APARTMENTS: Apartment[] = [
  // ─── 강남구 (11680) ───
  { id: 'gn-eunma',  name: '은마아파트', regionCode: '11680', district: '강남구 대치동',
    metro: '대치역 도보 5분', buildYear: 1979, totalUnits: 4424,
    sizes: [{ area: 31, price: 27 }, { area: 34, price: 30 }],
    tags: ['reconstruction','school','bigComplex'],
    oneLiner: '대치동 학군 + 압구정 다음가는 재건축 기대주' },
  { id: 'gn-rae6',   name: '래미안대치팰리스', regionCode: '11680', district: '강남구 대치동',
    metro: '한티역 도보 7분', buildYear: 2015, totalUnits: 1278,
    sizes: [{ area: 24, price: 28 }, { area: 34, price: 38 }],
    tags: ['school','newBuild','bigComplex'],
    oneLiner: '대치동 학군 No.1, 신축에 가까운 준신축' },
  { id: 'gn-acro',   name: '아크로리버파크', regionCode: '11650', district: '서초구 반포동',
    metro: '신반포역 도보 3분', buildYear: 2016, totalUnits: 1612,
    sizes: [{ area: 34, price: 50 }, { area: 45, price: 75 }],
    tags: ['view','newBuild','station','bigComplex'],
    oneLiner: '한강뷰 끝판왕, 평당 1억 시대를 연 단지' },
  { id: 'gn-rae33',  name: '반포래미안퍼스티지', regionCode: '11650', district: '서초구 반포동',
    metro: '반포역 도보 5분', buildYear: 2009, totalUnits: 2444,
    sizes: [{ area: 34, price: 45 }, { area: 45, price: 65 }],
    tags: ['school','bigComplex','station','view'],
    oneLiner: '반포 대표 단지, 학군·역세권·대단지 트리플 크라운' },

  // ─── 송파구 (11710) ───
  { id: 'sp-helio',  name: '헬리오시티', regionCode: '11710', district: '송파구 가락동',
    metro: '송파역 직결', buildYear: 2018, totalUnits: 9510,
    sizes: [{ area: 24, price: 18 }, { area: 34, price: 24 }],
    tags: ['bigComplex','newBuild','station'],
    oneLiner: '국내 최대 9,510세대, 신축 대단지의 정석' },
  { id: 'sp-leaders',name: '잠실엘스', regionCode: '11710', district: '송파구 잠실동',
    metro: '잠실역 도보 8분', buildYear: 2008, totalUnits: 5678,
    sizes: [{ area: 34, price: 28 }, { area: 45, price: 36 }],
    tags: ['bigComplex','school','view'],
    oneLiner: '잠실 5단지 대장, 한강·석촌호수 더블뷰' },
  { id: 'sp-jamsil', name: '잠실주공5단지', regionCode: '11710', district: '송파구 잠실동',
    metro: '잠실역 도보 5분', buildYear: 1978, totalUnits: 3930,
    sizes: [{ area: 34, price: 30 }, { area: 36, price: 33 }],
    tags: ['reconstruction','station','view','bigComplex'],
    oneLiner: '재건축 추진 중, 잠실 마지막 노른자' },

  // ─── 용산구 (11170) ───
  { id: 'ys-hannam', name: '한남더힐', regionCode: '11170', district: '용산구 한남동',
    metro: '한강진역 도보 8분', buildYear: 2011, totalUnits: 600,
    sizes: [{ area: 60, price: 80 }, { area: 80, price: 110 }],
    tags: ['view','newBuild'],
    oneLiner: '연예인·재벌 거주, 한국 최고가 아파트' },
  { id: 'ys-yongsan',name: '용산e편한세상', regionCode: '11170', district: '용산구 효창동',
    metro: '효창공원앞역 도보 3분', buildYear: 2016, totalUnits: 867,
    sizes: [{ area: 24, price: 14 }, { area: 34, price: 20 }],
    tags: ['station','newBuild'],
    oneLiner: '용산 진입의 가성비, 더블역세권' },

  // ─── 마포구 (11440) ───
  { id: 'mp-rae',    name: '마포래미안푸르지오', regionCode: '11440', district: '마포구 아현동',
    metro: '아현역 도보 5분', buildYear: 2014, totalUnits: 3885,
    sizes: [{ area: 24, price: 14 }, { area: 34, price: 19 }],
    tags: ['bigComplex','station','newBuild'],
    oneLiner: '마포 대장, 신축 대단지 + 광화문 출퇴근' },
  { id: 'mp-edif',   name: '공덕자이', regionCode: '11440', district: '마포구 공덕동',
    metro: '공덕역 도보 3분', buildYear: 2014, totalUnits: 1164,
    sizes: [{ area: 24, price: 13 }, { area: 34, price: 17 }],
    tags: ['station','bigComplex'],
    oneLiner: '5호선·6호선·공항철도·경의중앙선 쿼드러플 역세권' },

  // ─── 성동구 (11200) ───
  { id: 'sd-trim',   name: '트리마제', regionCode: '11200', district: '성동구 성수동1가',
    metro: '뚝섬역 도보 3분', buildYear: 2017, totalUnits: 688,
    sizes: [{ area: 34, price: 28 }, { area: 50, price: 45 }],
    tags: ['view','newBuild','station'],
    oneLiner: '한강뷰 + 성수 트렌드 1번지' },
  { id: 'sd-acro',   name: '아크로서울포레스트', regionCode: '11200', district: '성동구 성수동1가',
    metro: '서울숲역 도보 1분', buildYear: 2020, totalUnits: 280,
    sizes: [{ area: 34, price: 35 }, { area: 50, price: 55 }],
    tags: ['view','newBuild','station'],
    oneLiner: '서울숲 + 한강 + 성수동, 3박자 끝장' },

  // ─── 광진구 (11215) ───
  { id: 'gj-gwangj', name: '광장힐스테이트', regionCode: '11215', district: '광진구 광장동',
    metro: '광나루역 도보 8분', buildYear: 2012, totalUnits: 1815,
    sizes: [{ area: 24, price: 11 }, { area: 34, price: 16 }],
    tags: ['school','bigComplex'],
    oneLiner: '광남학군의 핵심, 강남 학군 부럽지 않은' },

  // ─── 양천구 (11470) ───
  { id: 'yc-mokdong',name: '목동신시가지7단지', regionCode: '11470', district: '양천구 목동',
    metro: '오목교역 도보 7분', buildYear: 1986, totalUnits: 2550,
    sizes: [{ area: 27, price: 17 }, { area: 35, price: 22 }],
    tags: ['reconstruction','school','bigComplex'],
    oneLiner: '목동 학군 + 재건축 동시 호재' },
  { id: 'yc-mokpark',name: '목동파크자이', regionCode: '11470', district: '양천구 목동',
    metro: '목동역 도보 5분', buildYear: 2007, totalUnits: 1400,
    sizes: [{ area: 24, price: 13 }, { area: 34, price: 17 }],
    tags: ['school','bigComplex','station'],
    oneLiner: '목동 학군 + 5호선 더블역세권' },

  // ─── 노원구 (11350) ───
  { id: 'nw-junggye',name: '중계청구3차', regionCode: '11350', district: '노원구 중계동',
    metro: '하계역 도보 10분', buildYear: 1995, totalUnits: 780,
    sizes: [{ area: 24, price: 8 }, { area: 32, price: 11 }],
    tags: ['school','reconstruction'],
    oneLiner: '은행사거리 학원가 직주근접, 노원 학군 No.1' },
  { id: 'nw-sanggye',name: '상계주공7단지', regionCode: '11350', district: '노원구 상계동',
    metro: '상계역 도보 5분', buildYear: 1988, totalUnits: 2634,
    sizes: [{ area: 24, price: 7 }, { area: 32, price: 9.5 }],
    tags: ['reconstruction','bigComplex','station'],
    oneLiner: '상계 재건축 1군, 4호선 역세권' },

  // ─── 동작구 (11590) ───
  { id: 'dj-acro',   name: '아크로리버하임', regionCode: '11590', district: '동작구 흑석동',
    metro: '흑석역 도보 5분', buildYear: 2019, totalUnits: 1073,
    sizes: [{ area: 24, price: 18 }, { area: 34, price: 25 }],
    tags: ['newBuild','view','station'],
    oneLiner: '흑석뉴타운 대장, 한강뷰 + 9호선' },

  // ─── 영등포구 (11560) ───
  { id: 'yd-park',   name: '여의도파크원', regionCode: '11560', district: '영등포구 여의도동',
    metro: '여의도역 도보 3분', buildYear: 2020, totalUnits: 580,
    sizes: [{ area: 34, price: 26 }, { area: 50, price: 40 }],
    tags: ['newBuild','station','view'],
    oneLiner: '여의도 신축 + 5·9호선 더블역세권' },
  { id: 'yd-shin1',  name: '여의도시범', regionCode: '11560', district: '영등포구 여의도동',
    metro: '여의도역 도보 5분', buildYear: 1971, totalUnits: 1584,
    sizes: [{ area: 24, price: 18 }, { area: 35, price: 24 }],
    tags: ['reconstruction','view','station'],
    oneLiner: '여의도 재건축 1순위, 한강뷰 + 통대지' },

  // ─── 강서구 (11500) ───
  { id: 'gs-magok',  name: '마곡엠밸리7단지', regionCode: '11500', district: '강서구 마곡동',
    metro: '마곡나루역 도보 5분', buildYear: 2014, totalUnits: 1004,
    sizes: [{ area: 24, price: 11 }, { area: 34, price: 14 }],
    tags: ['newBuild','bigComplex','station'],
    oneLiner: '마곡지구 신축 대단지 + 9호선·공항철도' },

  // ─── 동대문구 (11230) ───
  { id: 'dd-cheonghak',name:'청량리역한양수자인', regionCode: '11230', district: '동대문구 용두동',
    metro: '청량리역 직결', buildYear: 2023, totalUnits: 1152,
    sizes: [{ area: 24, price: 11 }, { area: 34, price: 15 }],
    tags: ['newBuild','station','bigComplex'],
    oneLiner: '청량리 GTX-B·C 호재 + 신축 대단지' },

  // ─── 서대문구 (11410) ───
  { id: 'sd-gajwa',  name: '가재울뉴타운센트레빌', regionCode: '11410', district: '서대문구 남가좌동',
    metro: '가좌역 도보 7분', buildYear: 2015, totalUnits: 1340,
    sizes: [{ area: 24, price: 9 }, { area: 34, price: 13 }],
    tags: ['bigComplex','newBuild'],
    oneLiner: '가재울뉴타운 핵심, 광화문 출퇴근 30분' },

  // ─── 강동구 (11740) ───
  { id: 'gd-godeok', name: '고덕그라시움', regionCode: '11740', district: '강동구 고덕동',
    metro: '고덕역 도보 7분', buildYear: 2019, totalUnits: 4932,
    sizes: [{ area: 24, price: 14 }, { area: 34, price: 18 }],
    tags: ['newBuild','bigComplex','station'],
    oneLiner: '강동 신축 대단지, 5호선 역세권' },
  { id: 'gd-amsa',   name: '암사선사힐스테이트', regionCode: '11740', district: '강동구 암사동',
    metro: '암사역 도보 8분', buildYear: 2008, totalUnits: 1339,
    sizes: [{ area: 24, price: 9 }, { area: 34, price: 12 }],
    tags: ['bigComplex','view'],
    oneLiner: '한강 조망 + 8호선, 가성비 강동' },

  // ─── 관악구 (11620) ───
  { id: 'ga-bongchun',name: '봉천우성', regionCode: '11620', district: '관악구 봉천동',
    metro: '봉천역 도보 3분', buildYear: 2002, totalUnits: 1597,
    sizes: [{ area: 24, price: 8 }, { area: 32, price: 10 }],
    tags: ['station','bigComplex'],
    oneLiner: '강남 출퇴근 + 2호선 역세권 가성비' },

  // ─── 은평구 (11380) ───
  { id: 'ep-magok',  name: '북한산푸르지오', regionCode: '11380', district: '은평구 응암동',
    metro: '응암역 도보 5분', buildYear: 2016, totalUnits: 1230,
    sizes: [{ area: 24, price: 8 }, { area: 34, price: 11 }],
    tags: ['view','bigComplex'],
    oneLiner: '북한산뷰 + 6호선, 숲세권' },

  // ─── 종로/중구 ───
  { id: 'jr-gyeong', name: '경희궁자이', regionCode: '11110', district: '종로구 홍파동',
    metro: '서대문역 도보 7분', buildYear: 2017, totalUnits: 2415,
    sizes: [{ area: 24, price: 17 }, { area: 34, price: 23 }],
    tags: ['newBuild','bigComplex','school'],
    oneLiner: '도심 한가운데 신축, 광화문 도보권' },

  // ─── 경기 분당 (41135) ───
  { id: 'bd-pangyo', name: '판교푸르지오그랑블', regionCode: '41135', district: '성남시 분당구 판교동',
    metro: '판교역 도보 8분', buildYear: 2011, totalUnits: 948,
    sizes: [{ area: 34, price: 22 }, { area: 45, price: 30 }],
    tags: ['station','school','bigComplex'],
    oneLiner: '판교 테크밸리 직주근접, 판교 학군' },
  { id: 'bd-bunjeong', name:'정자동상록우성', regionCode: '41135', district: '성남시 분당구 정자동',
    metro: '정자역 도보 3분', buildYear: 1995, totalUnits: 1762,
    sizes: [{ area: 24, price: 11 }, { area: 32, price: 14 }],
    tags: ['reconstruction','station','school'],
    oneLiner: '분당 1기 신도시 재건축 + 정자역세권' },

  // ─── 경기 과천 (41290) ───
  { id: 'gc-let',    name: '과천위버필드', regionCode: '41290', district: '과천시 별양동',
    metro: '과천역 도보 5분', buildYear: 2021, totalUnits: 2128,
    sizes: [{ area: 24, price: 18 }, { area: 34, price: 23 }],
    tags: ['newBuild','station','bigComplex'],
    oneLiner: '과천 재건축 신축, 4호선 역세권' },

  // ─── 경기 광명 (41210) ───
  { id: 'gm-purg',   name: '광명푸르지오포레', regionCode: '41210', district: '광명시 광명동',
    metro: '광명사거리역 도보 7분', buildYear: 2022, totalUnits: 1187,
    sizes: [{ area: 24, price: 9 }, { area: 34, price: 12 }],
    tags: ['newBuild','bigComplex','station'],
    oneLiner: '광명뉴타운 신축, 7호선 + KTX 광명역' },

  // ─── 경기 수원 영통 (41117) ───
  { id: 'sw-yongtong',name: '영통자이', regionCode: '41117', district: '수원시 영통구 영통동',
    metro: '영통역 도보 7분', buildYear: 2018, totalUnits: 1162,
    sizes: [{ area: 24, price: 7 }, { area: 34, price: 9.5 }],
    tags: ['newBuild','school','bigComplex'],
    oneLiner: '광교·영통 학군, 분당선 영통역' },

  // ─── 경기 용인 수지 (41465) ───
  { id: 'yi-suji',   name: '수지e편한세상', regionCode: '41465', district: '용인시 수지구 풍덕천동',
    metro: '수지구청역 도보 8분', buildYear: 2007, totalUnits: 1932,
    sizes: [{ area: 24, price: 6 }, { area: 34, price: 8 }],
    tags: ['school','bigComplex'],
    oneLiner: '수지 학군 + 신분당선' },

  // ─── 경기 하남 (41450) ───
  { id: 'hn-misa',   name: '하남미사강변', regionCode: '41450', district: '하남시 망월동',
    metro: '미사역 도보 5분', buildYear: 2017, totalUnits: 1542,
    sizes: [{ area: 24, price: 8 }, { area: 34, price: 11 }],
    tags: ['newBuild','bigComplex','view'],
    oneLiner: '한강뷰 + 5호선 미사역, 신도시 신축' },

  // ─── 경기 고양 일산 (41285) ───
  { id: 'gy-ilsan',  name: '일산자이3차', regionCode: '41285', district: '고양시 일산동구 마두동',
    metro: '마두역 도보 5분', buildYear: 2018, totalUnits: 1232,
    sizes: [{ area: 24, price: 7 }, { area: 34, price: 9 }],
    tags: ['newBuild','bigComplex','school'],
    oneLiner: '일산 신축 대단지, GTX-A 마두역 호재' },

  // ─── 경기 남양주 (41360) ───
  { id: 'ny-dasan',  name: '다산자연앤자이', regionCode: '41360', district: '남양주시 다산동',
    metro: '다산역 도보 5분', buildYear: 2019, totalUnits: 1614,
    sizes: [{ area: 24, price: 6 }, { area: 34, price: 8 }],
    tags: ['newBuild','bigComplex','station'],
    oneLiner: '다산신도시 신축, 8호선·경의중앙선' },

  // ─── 경기 김포 (41570) ───
  { id: 'kp-hano',   name: '김포한강신도시반도유보라', regionCode: '41570', district: '김포시 운양동',
    metro: '운양역 도보 5분', buildYear: 2017, totalUnits: 1142,
    sizes: [{ area: 24, price: 5 }, { area: 34, price: 6.8 }],
    tags: ['bigComplex','newBuild','view'],
    oneLiner: '한강뷰 + 김포 골드라인, 가성비 신도시' },

  // ─── 경기 화성 동탄 (41590) ───
  { id: 'hs-dt',     name: '동탄역더샵센트럴시티', regionCode: '41590', district: '화성시 오산동',
    metro: '동탄역 도보 3분', buildYear: 2020, totalUnits: 1996,
    sizes: [{ area: 24, price: 8 }, { area: 34, price: 11 }],
    tags: ['newBuild','station','bigComplex'],
    oneLiner: 'GTX-A 동탄역 직결 + SRT, 신축 대단지' },

  // ─── 경기 평택 (41390) ───
  { id: 'pt-godeok', name: '평택고덕신도시제일풍경채', regionCode: '41390', district: '평택시 고덕면',
    buildYear: 2022, totalUnits: 1022,
    sizes: [{ area: 24, price: 4 }, { area: 34, price: 5.5 }],
    tags: ['newBuild','bigComplex'],
    oneLiner: '삼성평택 직주근접, 고덕 신도시 신축' },

  // ─── 인천 송도 (28185) ───
  { id: 'ic-songdo1',name: '송도더샵퍼스트파크', regionCode: '28185', district: '연수구 송도동',
    metro: '인천대입구역 도보 5분', buildYear: 2017, totalUnits: 1769,
    sizes: [{ area: 24, price: 7 }, { area: 34, price: 10 }],
    tags: ['newBuild','bigComplex','school'],
    oneLiner: '송도 국제도시 학군 + 신축 대단지' },
  { id: 'ic-songdo2',name: '송도SK뷰', regionCode: '28185', district: '연수구 송도동',
    metro: '캠퍼스타운역 도보 7분', buildYear: 2018, totalUnits: 1184,
    sizes: [{ area: 24, price: 6.5 }, { area: 34, price: 9.5 }],
    tags: ['view','newBuild','bigComplex'],
    oneLiner: '센트럴파크뷰 + 송도 트리플역세권' },

  // ─── 인천 청라 (28260) ───
  { id: 'ic-cheong', name: '청라푸르지오', regionCode: '28260', district: '서구 청라동',
    metro: '청라국제도시역 도보 8분', buildYear: 2013, totalUnits: 1230,
    sizes: [{ area: 24, price: 5 }, { area: 34, price: 7 }],
    tags: ['bigComplex','school','view'],
    oneLiner: '청라호수공원뷰 + 신도시 학군' },

  // ─── 인천 부평 (28237) ───
  { id: 'ic-bupyeong',name:'부평래미안', regionCode: '28237', district: '부평구 부평동',
    metro: '부평역 도보 5분', buildYear: 2008, totalUnits: 1305,
    sizes: [{ area: 24, price: 5 }, { area: 34, price: 6.8 }],
    tags: ['station','bigComplex'],
    oneLiner: '1호선·7호선 더블역세권 가성비' },

  // ─── 인천 영종 (28110) ───
  { id: 'ic-yeongjong',name:'영종하늘도시한라비발디', regionCode: '28110', district: '중구 운서동',
    buildYear: 2014, totalUnits: 1188,
    sizes: [{ area: 24, price: 3.5 }, { area: 34, price: 5 }],
    tags: ['bigComplex','view'],
    oneLiner: '공항 직주근접 + 바다뷰, 인천 가성비 끝판' },

  // ─── 추가 학군 강세 ───
  { id: 'gn-daechi', name: '대치아이파크', regionCode: '11680', district: '강남구 대치동',
    metro: '대치역 도보 3분', buildYear: 2008, totalUnits: 768,
    sizes: [{ area: 34, price: 32 }, { area: 45, price: 45 }],
    tags: ['school','station','newBuild'],
    oneLiner: '대치동 학원가 도보권, 학군 No.1' },
  { id: 'sc-banpo',  name: '반포자이', regionCode: '11650', district: '서초구 반포동',
    metro: '반포역 도보 7분', buildYear: 2008, totalUnits: 3410,
    sizes: [{ area: 34, price: 38 }, { area: 45, price: 55 }],
    tags: ['school','bigComplex','view'],
    oneLiner: '반포 학군 + 한강뷰 + 대단지' },

  // ─── 비규제 가성비 추가 ───
  { id: 'sd-wangsib',name: '왕십리뉴타운센트라스', regionCode: '11200', district: '성동구 하왕십리동',
    metro: '왕십리역 도보 5분', buildYear: 2016, totalUnits: 2529,
    sizes: [{ area: 24, price: 14 }, { area: 34, price: 18 }],
    tags: ['newBuild','bigComplex','station'],
    oneLiner: '왕십리 신축 대단지, 2·5호선·분당선 트리플' },
  { id: 'gj-acero',  name: '롯데캐슬리버파크시그니처', regionCode: '11215', district: '광진구 자양동',
    metro: '구의역 도보 5분', buildYear: 2022, totalUnits: 878,
    sizes: [{ area: 24, price: 14 }, { area: 34, price: 18 }],
    tags: ['newBuild','view','station'],
    oneLiner: '한강뷰 신축 + 2·7호선 광진 신흥강자' },

  // ─── 추가 30~40대 자녀 가구용 ───
  { id: 'sk-mokdong',name: '목동하이페리온', regionCode: '11470', district: '양천구 목동',
    metro: '목동역 도보 5분', buildYear: 2003, totalUnits: 466,
    sizes: [{ area: 50, price: 27 }, { area: 60, price: 35 }],
    tags: ['school','view'],
    oneLiner: '목동 학군 + 안양천 조망, 대형평형' },
  { id: 'gd-godeok2',name: '고덕아르테온', regionCode: '11740', district: '강동구 상일동',
    metro: '상일동역 도보 5분', buildYear: 2020, totalUnits: 4066,
    sizes: [{ area: 24, price: 13 }, { area: 34, price: 17 }],
    tags: ['newBuild','bigComplex'],
    oneLiner: '고덕 신축 대단지 + 5호선' },
];

// ─── 큐레이션 매칭 함수 ───
export type CurationFilter = {
  budget: number;          // 가용 가능 최대 가격 (억)
  category: CategoryKey;
  regionCodes?: string[];  // 빈 배열이면 전체
};

export const curateApartments = (filter: CurationFilter, limit = 9): Apartment[] => {
  const { budget, category, regionCodes } = filter;

  const candidates = APARTMENTS.filter(apt => {
    // 카테고리 매칭 필수
    if (!apt.tags.includes(category)) return false;
    // 지역 매칭 (지정된 경우만)
    if (regionCodes && regionCodes.length > 0) {
      if (!regionCodes.includes(apt.regionCode)) return false;
    }
    // 예산 내 평형이 하나라도 있어야 함
    return apt.sizes.some(s => s.price <= budget);
  });

  // 점수: 예산 적합도(높을수록 예산을 잘 활용) × 카테고리 일치 정도
  return candidates
    .map(apt => {
      const minPrice = Math.min(...apt.sizes.map(s => s.price));
      const fitness = minPrice / budget; // 0~1, 1에 가까울수록 예산 풀활용
      const tagBonus = apt.tags.filter(t => t === category).length;
      return { apt, score: fitness * 0.7 + tagBonus * 0.3 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.apt);
};
