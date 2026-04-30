import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { useAppStore } from '../store/useAppStore';
import { calcAllCases, type CaseKey, type CaseResult, type EntryCost } from '../engine/calculator';
import { CATEGORIES, curateApartments, type Apartment } from '../data/apartments';
import { REGION_BY_CODE } from '../data/regulated-zones';
import { comma } from '../utils/format';
import { buildShareUrl, copyToClipboard, decodeShareState } from '../utils/shareUrl';

const CASE_ORDER: CaseKey[] = ['GANGNAM3_YONGSAN', 'OTHER_REGULATED', 'NON_REGULATED'];
const CASE_STYLE: Record<CaseKey, { cls: string; tagline: string }> = {
  GANGNAM3_YONGSAN: { cls: 'gangnam',   tagline: '최고 강도 규제 · 자금조달계획서 + 실거주 의무' },
  OTHER_REGULATED:  { cls: 'regulated', tagline: '토허제 + 수도권 6억 캡' },
  NON_REGULATED:    { cls: 'normal',    tagline: '캡 없음 · 최대 LTV 70%' },
};

// 국토부 실거래가 공개시스템 단지 검색 URL
const naverAptUrl = (name: string) =>
  `https://m.land.naver.com/search/result/${encodeURIComponent(name)}`;

export const Result = () => {
  const nav = useNavigate();
  const s = useAppStore();
  const [params] = useSearchParams();
  const captureRef = useRef<HTMLDivElement>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const r = params.get('r');
    if (r) {
      const decoded = decodeShareState(r);
      if (decoded) s.hydrate(decoded);
    }
  }, []);

  const cases = useMemo(() => calcAllCases(s), [s]);

  const budget = cases.NON_REGULATED.maxPropertyPrice;
  const apartments = useMemo(
    () => curateApartments({ budget, category: s.preferCategory, regionCodes: s.preferRegions }),
    [budget, s.preferCategory, s.preferRegions],
  );

  const onCopyLink = async () => {
    const url = buildShareUrl(s);
    if (await copyToClipboard(url)) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    }
  };

  const onSaveImage = async () => {
    if (!captureRef.current) return;
    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true, backgroundColor: '#1a1735', pixelRatio: 2,
      });
      const a = document.createElement('a');
      a.download = `yeong-kkeul-pick-${Date.now()}.png`;
      a.href = dataUrl; a.click();
    } catch (e) { console.error(e); }
  };

  const cat = CATEGORIES.find(c => c.key === s.preferCategory)!;

  return (
    <div className="page-content">
      <div className="row between" style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost" onClick={() => nav('/wizard')}>← 다시 입력</button>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost" onClick={onCopyLink}>
            {shareCopied ? '✓ 복사됨' : '🔗 링크 복사'}
          </button>
          <button className="btn btn-ghost" onClick={onSaveImage}>📸 이미지 저장</button>
        </div>
      </div>

      <div ref={captureRef}>
        {/* ─── HERO ─── */}
        <motion.div
          className="glass glass-strong fade-up"
          style={{ marginBottom: 24, textAlign: 'center', padding: 'clamp(24px, 4vw, 40px)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--accent-cyan)', marginBottom: 12 }}>
            영끌 시뮬레이션 결과
          </div>
          <div className="h-display" style={{ marginBottom: 12 }}>
            연봉 <span className="gradient-text">{(s.yearIncome / 10000).toFixed(1)}억</span>
            {' '}+ 자산 <span className="gradient-text">{(s.myAsset / 10000).toFixed(1)}억</span>으로
          </div>
          <div className="h-1" style={{ marginBottom: 4 }}>
            최대{' '}
            <span className="t-num gradient-text" style={{ fontSize: '1.4em' }}>
              {cases.NON_REGULATED.maxPropertyPrice.toFixed(1)}억
            </span>
            {' '}까지 가능
          </div>
          <div className="t-sub">비토허제 기준. 토허제·강남3구는 아래에서 확인하세요 ↓</div>
        </motion.div>

        {/* ─── 3 케이스 비교 ─── */}
        <div className="grid-3" style={{ marginBottom: 32 }}>
          {CASE_ORDER.map((k, idx) => (
            <CaseCard key={k} caseKey={k} result={cases[k]} delay={idx * 0.08} />
          ))}
        </div>

        {/* ─── 큐레이션 ─── */}
        <motion.div
          className="glass fade-up"
          style={{ marginBottom: 24 }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <div className="row between" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <div className="h-2">{cat.emoji} {cat.label} 우선 큐레이션</div>
              <div className="t-sub" style={{ marginTop: 4 }}>
                "{cat.tagline}" · 예산 {budget.toFixed(1)}억 이하
              </div>
            </div>
            <div className="t-mute">{apartments.length}개 매칭</div>
          </div>

          {apartments.length === 0 ? (
            <div className="glass-tile" style={{ textAlign: 'center', padding: 32 }}>
              <div className="h-3" style={{ marginBottom: 8 }}>예산에 맞는 단지가 없어요 😢</div>
              <div className="t-sub">희망 지역을 넓히거나 다른 카테고리를 선택해보세요</div>
            </div>
          ) : (
            <div className="grid-3">
              {apartments.map((apt, i) => (
                <ApartmentCard key={apt.id} apt={apt} delay={i * 0.04} />
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── 정책 인사이트 ─── */}
        <motion.div
          className="glass fade-up"
          style={{ marginBottom: 24 }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          <div className="h-2" style={{ marginBottom: 12 }}>📊 2026 정책 인사이트</div>
          <div className="col" style={{ gap: 10 }}>
            <Insight
              label="스트레스 DSR 3단계 영향"
              value={`-${cases.NON_REGULATED.stressDsrImpact.toFixed(2)}억`}
              hint="2025.7 시행 가산금리 1.5%p가 줄인 한도 (수도권 기준)"
              warn
            />
            <Insight
              label="강남3구·용산 vs 비토허제 차이"
              value={`${(cases.NON_REGULATED.maxPropertyPrice - cases.GANGNAM3_YONGSAN.maxPropertyPrice).toFixed(2)}억`}
              hint="6억 캡 + 규제로 인한 격차"
            />
            {cases.NON_REGULATED.loanPieces.some(p => p.name.includes('신생아')) && (
              <Insight
                label="신생아특례 적용"
                value="✓"
                hint="5년간 1.8~3.3% 저금리 적용"
                emerald
              />
            )}
          </div>
        </motion.div>
      </div>

      <div style={{ textAlign: 'center', padding: '24px 0 40px', color: 'var(--text-3)', fontSize: 12 }}>
        ⚠️ 본 결과는 참고용 추정치입니다. 정확한 한도·금리는 은행 상담 필수.
      </div>
    </div>
  );
};

// ─── Case Card ───
const CaseCard = ({ caseKey, result, delay }: {
  caseKey: CaseKey; result: CaseResult; delay: number;
}) => {
  const style = CASE_STYLE[caseKey];
  const ec    = result.entryCost;

  return (
    <motion.div
      className={`case-card ${style.cls}`}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    >
      <div className="row between">
        <span className="badge">{result.caseLabel}</span>
        <span className="t-mute">LTV {result.ltv}%</span>
      </div>

      <div>
        <div className="t-mute" style={{ marginBottom: 4 }}>최대 매수 가능</div>
        <div className="case-price gradient-text">{result.maxPropertyPrice.toFixed(1)}억</div>
      </div>

      <div className="case-meta">
        <div>자기자본 <strong>{result.myAssetEok.toFixed(1)}억</strong> + 대출 <strong>{result.maxLoan.toFixed(1)}억</strong></div>
        <div>월 상환 약 <strong>{comma(Math.round(result.monthlyTotal / 10000) * 10000)}원</strong></div>
        {result.loanCap !== Infinity && <div className="t-mute">⚠ 주담대 {result.loanCap}억 캡</div>}
      </div>

      {/* ─── 취득세 + 중개수수료 ─── */}
      <div className="entry-cost-box">
        <div className="entry-cost-title">💰 실제 진입 비용</div>
        <div className="entry-cost-row">
          <span>취득세</span>
          <span>{comma(ec.acquisitionTax)}만</span>
        </div>
        <div className="entry-cost-row">
          <span>중개수수료</span>
          <span>{comma(ec.brokerageFee)}만</span>
        </div>
        <div className="entry-cost-row total">
          <span>실 현금 필요액</span>
          <span className="t-num" style={{ color: 'var(--accent-cyan)' }}>
            {ec.requiredCash >= 10000
              ? `${(ec.requiredCash / 10000).toFixed(1)}억`
              : `${comma(ec.requiredCash)}만`}
          </span>
        </div>
        <div className="t-mute" style={{ fontSize: 10, marginTop: 4 }}>
          ※ 자기자본 - 대출 + 취득세 + 중개수수료
        </div>
      </div>

      <div className="t-mute" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 10, marginTop: 'auto' }}>
        {style.tagline}
      </div>

      {result.loanPieces.length > 0 && (
        <details>
          <summary className="t-sub" style={{ cursor: 'pointer', marginTop: 4 }}>대출 구성 보기</summary>
          <div className="col" style={{ gap: 6, marginTop: 8 }}>
            {result.loanPieces.map((p, i) => (
              <div key={i} className="loan-piece">
                <div>
                  <div className="name">{p.name}</div>
                  <div className="meta">{p.rate}% · {(p.monthlyPayment / 10000).toFixed(0)}만/월</div>
                </div>
                <div className="amount">{p.amount.toFixed(1)}억</div>
              </div>
            ))}
          </div>
        </details>
      )}

      {result.warnings.length > 0 && (
        <div className="col" style={{ gap: 4, marginTop: 8 }}>
          {result.warnings.map((w, i) => (
            <div key={i} className="t-mute" style={{ fontSize: 11 }}>· {w}</div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ─── Apartment Card ───
const ApartmentCard = ({ apt, delay }: { apt: Apartment; delay: number }) => {
  const region = REGION_BY_CODE[apt.regionCode];
  const regulationBadge =
    region?.regulation === 'GANGNAM3_YONGSAN' ? { label: '강남3구·용산', color: 'var(--accent-pink)' }   :
    region?.regulation === 'OTHER_REGULATED'  ? { label: '토허제',       color: 'var(--accent-amber)' }  :
    { label: '비토허제', color: 'var(--accent-emerald)' };

  // 네이버 부동산 실거래가 링크
  const priceUrl = naverAptUrl(apt.name);

  return (
    <motion.div
      className="apt-card"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    >
      <div className="row between">
        <div className="name">{apt.name}</div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
          background: 'rgba(255,255,255,0.08)', color: regulationBadge.color, letterSpacing: 0.5,
        }}>{regulationBadge.label}</span>
      </div>

      <div className="district">{apt.district}{apt.metro && ` · ${apt.metro}`}</div>
      <div className="one-liner">{apt.oneLiner}</div>

      <div className="price-row">
        {apt.sizes.map((sz, i) => (
          <span key={i} className="price-chip">{sz.area}평 · {sz.price}억</span>
        ))}
      </div>

      <div className="row between" style={{ marginTop: 4 }}>
        <span className="t-mute">{apt.buildYear}년 · {comma(apt.totalUnits)}세대</span>
        <div className="tag-row">
          {apt.tags.slice(0, 3).map(t => (
            <span key={t} className="tag">
              {CATEGORIES.find(c => c.key === t)?.emoji}
            </span>
          ))}
        </div>
      </div>

      {/* ─── 실거래가 링크 ─── */}
      <a
        href={priceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="price-link"
      >
        📊 실거래가 보기 →
      </a>
    </motion.div>
  );
};

// ─── Insight Row ───
const Insight = ({ label, value, hint, warn, emerald }: {
  label: string; value: string; hint: string; warn?: boolean; emerald?: boolean;
}) => (
  <div className="glass-tile" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
    <div>
      <div className="t-body" style={{ fontWeight: 600 }}>{label}</div>
      <div className="t-mute" style={{ marginTop: 2 }}>{hint}</div>
    </div>
    <div className="t-num" style={{
      fontSize: 18,
      color: warn ? 'var(--danger)' : emerald ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
    }}>
      {value}
    </div>
  </div>
);
