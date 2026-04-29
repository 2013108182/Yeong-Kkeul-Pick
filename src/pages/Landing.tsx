import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Landing = () => {
  const nav = useNavigate();

  return (
    <div className="page-content">
      <motion.div
        className="glass glass-strong fade-up"
        style={{ marginTop: '6vh', textAlign: 'center', padding: 'clamp(32px, 5vw, 56px)' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--accent-cyan)', marginBottom: 16 }}>
        영끌픽 · 2026
        </div>

        <h1 className="h-display" style={{ marginBottom: 16 }}>
          내 연봉으로 살 수 있는 집,<br />
          <span className="gradient-text">토허제까지 다 따져드려요</span>
        </h1>

        <p className="t-sub" style={{ maxWidth: 540, margin: '0 auto 32px', fontSize: 16, lineHeight: 1.7 }}>
          강남3구·용산 / 기타 토허제 / 비토허제<br />
          세 갈래로 나눠서 계산하고,<br />
          내 우선순위에 맞는 아파트까지 한 번에 골라드립니다.
        </p>

        <button className="btn btn-primary" onClick={() => nav('/wizard')} style={{ padding: '16px 36px', fontSize: 16 }}>
          내 영끌 시작하기 →
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {['스트레스 DSR 3단계', '신생아특례', '6억 캡', 'KB 시세 반영'].map(t => (
            <span key={t} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12,
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)',
              color: 'var(--text-2)',
            }}>
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
