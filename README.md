# 영끌계산기 2.0

> "내 연봉으로 살 수 있는 집, 토허제까지 다 따져드려요"
> 2026년 정책 반영 · 3 케이스 비교 · 아파트 큐레이션 · 글래스모피즘 UI

`letsbejolboos.com` (영끌계산기 1.0)을 벤치마킹해서 새로 만든 버전입니다. 1.0의 한계 — 폐지된 특례보금자리, 미반영 스트레스 DSR, 자치구 평균만 매칭 — 을 모두 해결했습니다.

## 핵심 차별화

- **3 케이스 비교**: 강남3구·용산 / 기타 토허제 / 비토허제 동시 산출
- **2026 정책 반영**: 디딤돌 4억 한도, 신생아특례, 보금자리론(특례 폐지 후), 스트레스 DSR 3단계, 수도권 6억 캡, 생애최초 LTV 70/80%
- **아파트 큐레이션**: 6 카테고리(역세권·재건축·학군·신축·대단지·한강숲세권) × 서울/경기/인천 60+개 단지 자체 큐레이션
- **결과 공유**: URL 압축(LZ-string) + 이미지 카드 다운로드(html-to-image)
- **글래스모피즘 UX**: 모바일 우선, Framer Motion 전환, Pretendard

## 실행 방법

### 1. 의존성 설치
```bash
cd app
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
`http://localhost:5173` 접속.

### 3. 프로덕션 빌드
```bash
npm run build
npm run preview   # 빌드 결과 미리보기
```
`dist/` 폴더에 정적 파일 생성. Vercel/Netlify 등에 그대로 업로드하면 끝.

## 폴더 구조

```
app/
├─ src/
│  ├─ pages/
│  │  ├─ Landing.tsx      메인 (히어로 + 1.0과의 차이)
│  │  ├─ Wizard.tsx       3단 위저드 (인적사항 / 자금 / 큐레이션 선호)
│  │  └─ Result.tsx       3 케이스 비교 + 큐레이션 + 공유
│  ├─ data/
│  │  ├─ regulated-zones.ts  토허제 매핑 (서울 25 / 경기 25 / 인천 7)
│  │  ├─ apartments.ts       60+ 단지 큐레이션 풀
│  │  └─ policy-2026.ts      디딤돌·신생아특례·보금자리·DSR·LTV 상수
│  ├─ engine/
│  │  └─ calculator.ts    3 케이스 영끌 계산 엔진 (스트레스 DSR 반영)
│  ├─ store/
│  │  └─ useAppStore.ts   zustand 전역 상태
│  ├─ utils/
│  │  ├─ format.ts        만원/억 포매터
│  │  └─ shareUrl.ts      LZ-string 인코딩 + 클립보드
│  └─ styles/
│     └─ globals.css      디자인 토큰 + 글래스 컴포넌트
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

## 디자인 토큰

- 배경: 보라→파랑 그라디언트 + 코너 광원 블롭
- 글래스: `rgba(255,255,255,0.06)` + `backdrop-filter: blur(24px)`
- 강조: 보라 `#A78BFA` ↔ 사이언 `#22D3EE` 그라디언트
- 폰트: Pretendard Variable

## 스택

| 영역 | 라이브러리 |
|---|---|
| 프레임워크 | Vite + React 18 + TypeScript |
| 라우팅 | React Router 6 |
| 상태 | Zustand |
| 모션 | Framer Motion |
| 공유 | LZ-string + html-to-image |

## 향후 로드맵

- **P2**: Next.js 마이그레이션 (동적 OG 이미지 SSR)
- **P2**: 큐레이션 풀 200개 확장 + KB 시세 자동 갱신 잡
- **P3**: 신생아특례 마법사, 청약 시뮬, 갈아타기 시뮬
- **P3**: 정책 변경 알림 (이메일/푸시)

## 면책

표시되는 금리·한도·시세는 2026년 4월 공개 자료 기준 추정치입니다. 실제 대출 가능액은 개인 신용·DTI·은행 정책에 따라 달라지므로, 의사결정 전에는 반드시 은행 상담을 받으세요.
