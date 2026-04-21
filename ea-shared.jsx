// ea-shared.jsx — shared UI primitives

const Placeholder = ({ label, height = 220, note }) => (
  <div style={{
    height, borderRadius: 16,
    background: 'repeating-linear-gradient(-45deg,#e8e4dd 0,#e8e4dd 1px,#FAF7F2 0,#FAF7F2 50%)',
    backgroundSize: '14px 14px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', border: '1.5px dashed rgba(0,0,0,0.12)',
    gap: 8, padding: 24, textAlign: 'center',
  }}>
    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>[ {label} ]</span>
    {note && <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#bbb', maxWidth: 320, lineHeight: 1.6 }}>{note}</span>}
  </div>
);

const Tag = ({ children, color = 'green' }) => {
  const p = {
    green: { bg: '#EBF7F2', fg: '#2A8A5C' },
    amber: { bg: '#FDF0E6', fg: '#B85C0D' },
    gray:  { bg: '#EEEBE7', fg: '#555' },
    blue:  { bg: '#EBF0FF', fg: '#3A52B0' },
    dark:  { bg: '#1A1A1A', fg: '#FAF7F2' },
    red:   { bg: '#FEF0EE', fg: '#C04030' },
  };
  const c = p[color] || p.gray;
  return (
    <span style={{ background: c.bg, color: c.fg, borderRadius: 100, padding: '4px 13px', fontSize: 12, fontWeight: 600, display: 'inline-block', lineHeight: 1.5, letterSpacing: '0.01em' }}>
      {children}
    </span>
  );
};

const Stat = ({ value, label, accent = '#3DAA74', sub }) => (
  <div style={{ background: '#fff', borderRadius: 20, padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
    <span style={{ fontSize: 38, fontWeight: 700, color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</span>
    <span style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.4, maxWidth: 110 }}>{label}</span>
    {sub && <span style={{ fontSize: 11, color: '#3DAA74', fontWeight: 600 }}>{sub}</span>}
  </div>
);

const QuoteBlock = ({ text, author, role, accent = '#3DAA74' }) => (
  <div style={{ background: accent === '#3DAA74' ? '#EBF7F2' : '#FDF0E6', borderRadius: 20, padding: '28px 32px', borderLeft: `4px solid ${accent}` }}>
    <p style={{ fontSize: 17, lineHeight: 1.8, color: '#1A1A1A', fontStyle: 'italic', margin: 0 }}>"{text}"</p>
    {author && <div style={{ marginTop: 14, fontSize: 13, color: accent, fontWeight: 600 }}>— {author}{role ? `, ${role}` : ''}</div>}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: '#fff', borderRadius: 20, padding: '28px', boxShadow: '0 2px 20px rgba(0,0,0,0.055)', ...style }}>
    {children}
  </div>
);

const SectionHeader = ({ num, title, subtitle }) => (
  <div style={{ marginBottom: 48 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>
      {String(num).padStart(2, '0')}
    </div>
    <h2 style={{ fontSize: 40, fontWeight: 700, margin: 0, color: '#141414', lineHeight: 1.1, letterSpacing: '-0.025em' }}>{title}</h2>
    {subtitle && <p style={{ marginTop: 14, fontSize: 17, color: '#6B6B6B', lineHeight: 1.65, maxWidth: 620, margin: '14px 0 0' }}>{subtitle}</p>}
  </div>
);

const SectionWrap = ({ id, children, style = {} }) => (
  <section id={id} style={{ padding: '96px 0', ...style }}>
    {children}
  </section>
);

const Container = ({ children }) => (
  <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 36px' }}>
    {children}
  </div>
);

const MethodIcon = ({ type, size = 44 }) => {
  const s = size;
  const icons = {
    interview: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="6" y="8" width="40" height="26" rx="10" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <circle cx="17" cy="21" r="3" fill="#3DAA74"/>
        <circle cx="26" cy="21" r="3" fill="#3DAA74"/>
        <circle cx="35" cy="21" r="3" fill="#3DAA74"/>
        <path d="M16 34 L11 44 L26 40" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    survey: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="8" y="4" width="36" height="44" rx="7" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <line x1="15" y1="16" x2="37" y2="16" stroke="#3DAA74" strokeWidth="2" strokeLinecap="round"/>
        <line x1="15" y1="24" x2="37" y2="24" stroke="#3DAA74" strokeWidth="2" strokeLinecap="round"/>
        <line x1="15" y1="32" x2="28" y2="32" stroke="#3DAA74" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="40" cy="40" r="8" fill="#3DAA74"/>
        <path d="M36 40 L39 43 L44 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    usability: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="6" width="44" height="30" rx="7" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <line x1="20" y1="36" x2="32" y2="36" stroke="#3DAA74" strokeWidth="2"/>
        <line x1="26" y1="36" x2="26" y2="46" stroke="#3DAA74" strokeWidth="2"/>
        <line x1="20" y1="46" x2="32" y2="46" stroke="#3DAA74" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 24 L28 18 L28 30 Z" fill="#3DAA74"/>
      </svg>
    ),
    competitive: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="5" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <rect x="28" y="4" width="20" height="20" rx="5" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <rect x="4" y="28" width="20" height="20" rx="5" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <rect x="28" y="28" width="20" height="20" rx="5" fill="#3DAA74"/>
        <path d="M32 38 L37 43 L44 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    matrix: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="44" height="44" rx="7" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <line x1="4" y1="18" x2="48" y2="18" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="4" y1="32" x2="48" y2="32" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="18" y1="4" x2="18" y2="48" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="32" y1="4" x2="32" y2="48" stroke="#3DAA74" strokeWidth="1.5"/>
        <circle cx="25" cy="25" r="6" fill="#3DAA74"/>
      </svg>
    ),
    affinity: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="20" height="14" rx="4" fill="#3DAA74"/>
        <rect x="28" y="4" width="20" height="14" rx="4" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <rect x="4" y="24" width="20" height="14" rx="4" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <rect x="28" y="24" width="20" height="14" rx="4" fill="#EBF7F2" stroke="#3DAA74" strokeWidth="2"/>
        <line x1="24" y1="11" x2="28" y2="11" stroke="#3DAA74" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="24" y1="31" x2="28" y2="31" stroke="#3DAA74" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="14" y1="18" x2="14" y2="24" stroke="#3DAA74" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="38" y1="18" x2="38" y2="24" stroke="#3DAA74" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    ),
  };
  return (
    <div style={{ width: 76, height: 76, background: 'white', borderRadius: 20, boxShadow: '0 2px 14px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icons[type] || <div style={{ width: s, height: s, background: '#EBF7F2', borderRadius: 8 }} />}
    </div>
  );
};

const HitMiss = ({ v }) => {
  if (v === 'hit')  return <span style={{ color: '#3DAA74', fontWeight: 700, fontSize: 12 }}>✓ Hit</span>;
  if (v === 'miss') return <span style={{ color: '#E07D2E', fontWeight: 700, fontSize: 12 }}>✗ Miss</span>;
  if (v === 'fp')   return <span style={{ color: '#E07D2E', fontWeight: 700, fontSize: 12 }}>✗ False+</span>;
  return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>;
};

Object.assign(window, {
  Placeholder, Tag, Stat, QuoteBlock, Card, SectionHeader, SectionWrap, Container, MethodIcon, HitMiss
});
