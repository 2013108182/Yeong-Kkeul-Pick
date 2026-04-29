import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { CATEGORIES, type CategoryKey } from '../data/apartments';
import { REGIONS_BY_PROVINCE } from '../data/regulated-zones';
import { comma } from '../utils/format';

const STEPS = ['인적사항', '자금 / 소득', '큐레이션 선호'] as const;

export const Wizard = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const s = useAppStore();

  const next = () => (step < 2 ? setStep(step + 1) : nav('/result'));
  const prev = () => (step > 0 ? setStep(step - 1) : nav('/'));

  return (
    <div className="page-content">
      <Steps current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="glass"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28 }}
        >
          {step === 0 && <StepPersonal />}
          {step === 1 && <StepFinance />}
          {step === 2 && <StepPreference />}
        </motion.div>
      </AnimatePresence>

      <div className="row between" style={{ marginTop: 24 }}>
        <button className="btn btn-ghost" onClick={prev}>{step === 0 ? '← 처음으로' : '← 이전'}</button>
        <button className="btn btn-primary" onClick={next}>
          {step === 2 ? '결과 보기 →' : '다음 →'}
        </button>
      </div>
    </div>
  );
};

// ─── Step Progress ───
const Steps = ({ current }: { current: number }) => (
  <div className="steps">
    {STEPS.map((label, i) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: i < STEPS.length - 1 ? 0 : undefined }}>
        <div className={`step-dot ${i === current ? 'active' : ''}`}>
          <span className="num">{i + 1}</span>
          <span>{label}</span>
        </div>
        {i < STEPS.length - 1 && <div className="bar" style={{ width: 24 }} />}
      </div>
    ))}
  </div>
);

// ─── Step 1: 인적사항 ───
const StepPersonal = () => {
  const s = useAppStore();
  return (
    <div className="col" style={{ gap: 20 }}>
      <div>
        <div className="h-2">먼저, 본인에 대해 알려주세요</div>
        <div className="t-sub" style={{ marginTop: 8 }}>정책대출 자격을 정확히 판정하기 위해 필요해요</div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label className="field-label">생년월일</label>
          <input
            type="date"
            className="field-input"
            value={s.birthday}
            onChange={(e) => s.set('birthday', e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label">결혼 여부</label>
          <div className="toggle-row">
            <button className={`toggle-pill ${s.isMarried ? 'on' : ''}`} onClick={() => s.set('isMarried', true)}>결혼했어요</button>
            <button className={`toggle-pill ${!s.isMarried ? 'on' : ''}`} onClick={() => s.set('isMarried', false)}>미혼이에요</button>
          </div>
        </div>
      </div>

      {s.isMarried && (
        <>
          <div className="field">
            <label className="field-label">신혼 (혼인 7년 이내)</label>
            <div className="toggle-row">
              <button className={`toggle-pill ${s.isNewCouple ? 'on' : ''}`} onClick={() => s.set('isNewCouple', true)}>신혼이에요</button>
              <button className={`toggle-pill ${!s.isNewCouple ? 'on' : ''}`} onClick={() => s.set('isNewCouple', false)}>아니에요</button>
            </div>
          </div>
          <div className="field">
            <label className="field-label">맞벌이 여부 (신생아특례 자격 판정)</label>
            <div className="toggle-row">
              <button className={`toggle-pill ${s.isDualIncome ? 'on' : ''}`} onClick={() => s.set('isDualIncome', true)}>맞벌이</button>
              <button className={`toggle-pill ${!s.isDualIncome ? 'on' : ''}`} onClick={() => s.set('isDualIncome', false)}>외벌이</button>
            </div>
          </div>
        </>
      )}

      <div className="grid-2">
        <div className="field">
          <label className="field-label">생애 최초 주택 구매</label>
          <div className="toggle-row">
            <button className={`toggle-pill ${s.isFirstTime ? 'on' : ''}`} onClick={() => s.set('isFirstTime', true)}>처음이에요</button>
            <button className={`toggle-pill ${!s.isFirstTime ? 'on' : ''}`} onClick={() => s.set('isFirstTime', false)}>아니에요</button>
          </div>
        </div>
        <div className="field">
          <label className="field-label">현재 무주택</label>
          <div className="toggle-row">
            <button className={`toggle-pill ${s.isNoHouse ? 'on' : ''}`} onClick={() => s.set('isNoHouse', true)}>무주택</button>
            <button className={`toggle-pill ${!s.isNoHouse ? 'on' : ''}`} onClick={() => s.set('isNoHouse', false)}>유주택</button>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="field-label">2년 이내 출산 (신생아특례 자격)</label>
        <div className="toggle-row">
          <button className={`toggle-pill ${s.hasNewBorn2yr ? 'on' : ''}`} onClick={() => s.set('hasNewBorn2yr', true)}>출산했어요</button>
          <button className={`toggle-pill ${!s.hasNewBorn2yr ? 'on' : ''}`} onClick={() => s.set('hasNewBorn2yr', false)}>아니에요</button>
        </div>
      </div>

      <div className="field">
        <label className="field-label">자녀 수 (미성년 + 태아)</label>
        <input
          type="number" min={0} max={6}
          className="field-input"
          value={s.kidsCount}
          onChange={(e) => {
            const n = parseInt(e.target.value || '0', 10);
            s.set('kidsCount', n);
            s.set('isHavingKids', n >= 2);
          }}
        />
      </div>

      <div className="field">
        <label className="field-label">해당 사항 (복수 선택, 우대금리)</label>
        <div className="toggle-row">
          <button className={`toggle-pill ${s.isSingleParent ? 'on' : ''}`} onClick={() => s.set('isSingleParent', !s.isSingleParent)}>한부모</button>
          <button className={`toggle-pill ${s.isMultiCultural ? 'on' : ''}`} onClick={() => s.set('isMultiCultural', !s.isMultiCultural)}>다문화</button>
          <button className={`toggle-pill ${s.isDisabled ? 'on' : ''}`} onClick={() => s.set('isDisabled', !s.isDisabled)}>장애인</button>
        </div>
      </div>
    </div>
  );
};

// ─── Step 2: 자금 / 소득 ───
const StepFinance = () => {
  const s = useAppStore();
  return (
    <div className="col" style={{ gap: 20 }}>
      <div>
        <div className="h-2">얼마 가지고 있고, 얼마 버시나요?</div>
        <div className="t-sub" style={{ marginTop: 8 }}>맞벌이면 합산 소득. 단위는 모두 만원이에요</div>
      </div>

      <div className="field">
        <label className="field-label">연소득 (세전, 만원)</label>
        <div className="field-wrap">
          <input
            type="number"
            className="field-input"
            value={s.yearIncome}
            onChange={(e) => s.set('yearIncome', parseInt(e.target.value || '0', 10))}
            placeholder="9000"
          />
          <span className="field-suffix">만원 / 년</span>
        </div>
        <div className="t-mute">{comma(s.yearIncome)} 만원 = {(s.yearIncome / 10000).toFixed(2)} 억</div>
      </div>

      <div className="field">
        <label className="field-label">가용 자금 (보유 + 가족 지원, 만원)</label>
        <div className="field-wrap">
          <input
            type="number"
            className="field-input"
            value={s.myAsset}
            onChange={(e) => s.set('myAsset', parseInt(e.target.value || '0', 10))}
            placeholder="30000"
          />
          <span className="field-suffix">만원</span>
        </div>
        <div className="t-mute">{comma(s.myAsset)} 만원 = {(s.myAsset / 10000).toFixed(2)} 억</div>
      </div>

      <div className="field">
        <label className="field-label">월 여유자금 (저축 가능액, 만원)</label>
        <div className="field-wrap">
          <input
            type="number"
            className="field-input"
            value={s.monthlySaving}
            onChange={(e) => s.set('monthlySaving', parseInt(e.target.value || '0', 10))}
            placeholder="200"
          />
          <span className="field-suffix">만원 / 월</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label className="field-label">대출 기간</label>
          <select
            className="field-select"
            value={s.borrowingYear}
            onChange={(e) => s.set('borrowingYear', parseInt(e.target.value, 10) as any)}
          >
            <option value={10}>10년</option>
            <option value={15}>15년</option>
            <option value={20}>20년</option>
            <option value={30}>30년</option>
            <option value={40}>40년</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">상환 방식</label>
          <select
            className="field-select"
            value={s.paymentType}
            onChange={(e) => s.set('paymentType', e.target.value as any)}
          >
            <option value="fixed">원리금 균등</option>
            <option value="fixedPrincipal">원금 균등</option>
            <option value="gradual">체증식</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// ─── Step 3: 큐레이션 선호 ───
const StepPreference = () => {
  const s = useAppStore();
  const toggleRegion = (code: string) => {
    const cur = s.preferRegions;
    if (cur.includes(code)) s.set('preferRegions', cur.filter(c => c !== code));
    else if (cur.length < 5) s.set('preferRegions', [...cur, code]);
  };

  return (
    <div className="col" style={{ gap: 24 }}>
      <div>
        <div className="h-2">집을 고를 때 가장 중요한 건?</div>
        <div className="t-sub" style={{ marginTop: 8 }}>
          한 가지만 고르세요. 큐레이션 알고리즘이 이걸 1순위로 매칭해드려요
        </div>
      </div>

      <div className="grid-3">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            className={`glass-tile ${s.preferCategory === c.key ? 'selected' : ''}`}
            style={{ textAlign: 'left' }}
            onClick={() => s.set('preferCategory', c.key as CategoryKey)}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{c.emoji}</div>
            <div className="h-3">{c.label}</div>
            <div className="t-mute" style={{ marginTop: 4 }}>"{c.tagline}"</div>
          </button>
        ))}
      </div>

      <div>
        <div className="h-3" style={{ marginBottom: 12 }}>희망 지역 (최대 5곳, 선택 안 하면 전체)</div>
        {(['서울', '경기', '인천'] as const).map(province => (
          <details key={province} style={{ marginBottom: 12 }}>
            <summary style={{
              padding: 12, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', borderRadius: 12,
              fontSize: 14, fontWeight: 600,
            }}>
              {province} ({REGIONS_BY_PROVINCE[province].length}곳)
            </summary>
            <div className="toggle-row" style={{ marginTop: 10, padding: '0 4px' }}>
              {REGIONS_BY_PROVINCE[province].map(r => (
                <button
                  key={r.code}
                  className={`toggle-pill ${s.preferRegions.includes(r.code) ? 'on' : ''}`}
                  onClick={() => toggleRegion(r.code)}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};
