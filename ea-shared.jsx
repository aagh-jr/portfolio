// ea-shared.jsx — shared UI primitives (minimal research-article aesthetic)

const Placeholder = ({ label, height = 220, note }) => (
  <div style={{
    height, borderRadius: 12,
    background: '#F5F5F3',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', border: '1px dashed rgba(0,0,0,0.13)',
    gap: 8, padding: 24, textAlign: 'center',
  }}>
    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>[ {label} ]</span>
    {note && <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#ccc', maxWidth: 320, lineHeight: 1.6 }}>{note}</span>}
  </div>
);

const Tag = ({ children, color = 'green' }) => {
  const p = {
    green: { bg: 'transparent', fg: '#2A8A5C', border: 'rgba(61,170,116,0.35)' },
    amber: { bg: 'transparent', fg: '#B85C0D', border: 'rgba(224,125,46,0.35)' },
    gray:  { bg: 'transparent', fg: '#666',    border: 'rgba(0,0,0,0.15)' },
    blue:  { bg: 'transparent', fg: '#3A52B0', border: 'rgba(90,110,232,0.35)' },
    dark:  { bg: '#111',        fg: '#fafaf8', border: 'transparent' },
    red:   { bg: 'transparent', fg: '#C04030', border: 'rgba(192,64,48,0.3)' },
  };
  const c = p[color] || p.gray;
  return (
    <span style={{
      background: c.bg, color: c.fg,
      border: `1px solid ${c.border}`,
      borderRadius: 100, padding: '3px 12px',
      fontSize: 11, fontWeight: 600, display: 'inline-block',
      lineHeight: 1.6, letterSpacing: '0.02em',
    }}>
      {children}
    </span>
  );
};

const Stat = ({ value, label, accent = '#3DAA74', sub }) => (
  <div style={{
    borderRadius: 16, padding: '32px 24px',
    textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center',
    background: '#fff',
  }}>
    <span style={{ fontSize: 42, fontWeight: 600, color: accent, lineHeight: 1, letterSpacing: '-0.03em', fontFamily: 'Lora, Georgia, serif' }}>{value}</span>
    <span style={{ fontSize: 13, color: '#888', lineHeight: 1.4, maxWidth: 110 }}>{label}</span>
    {sub && <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{sub}</span>}
  </div>
);

const QuoteBlock = ({ text, author, role, accent = '#3DAA74' }) => (
  <div style={{
    padding: '28px 36px',
    borderLeft: `2px solid ${accent}`,
    background: 'transparent',
  }}>
    <p style={{
      fontSize: 20, lineHeight: 1.75, color: '#222',
      fontStyle: 'italic', margin: 0,
      fontFamily: 'Lora, Georgia, serif', fontWeight: 400,
    }}>"{text}"</p>
    {author && <div style={{ marginTop: 14, fontSize: 13, color: '#999', fontWeight: 500 }}>— {author}{role ? `, ${role}` : ''}</div>}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff',
    borderRadius: 16,
    padding: '28px',
    border: '1px solid rgba(0,0,0,0.08)',
    ...style
  }}>
    {children}
  </div>
);

const SectionHeader = ({ num, title, subtitle }) => (
  <div style={{ marginBottom: 52 }}>
    <div style={{
      fontSize: 11, fontWeight: 600, color: '#aaa',
      letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16,
    }}>
      {String(num).padStart(2, '0')}
    </div>
    <h2 style={{
      fontSize: 38, fontWeight: 500, margin: 0,
      color: '#111', lineHeight: 1.15, letterSpacing: '-0.02em',
      fontFamily: 'Lora, Georgia, serif',
    }}>{title}</h2>
    {subtitle && <p style={{
      marginTop: 16, fontSize: 16, color: '#777',
      lineHeight: 1.7, maxWidth: 600, margin: '16px 0 0',
    }}>{subtitle}</p>}
  </div>
);

const SectionWrap = ({ id, children, style = {} }) => (
  <section id={id} style={{ padding: '48px 0', ...style }}>
    {children}
  </section>
);

const Container = ({ children, noBorder = false }) => {
  const embed = new URLSearchParams(window.location.search).has('embed');
  return (
    <div style={{ marginLeft: embed ? 0 : '20vw', width: embed ? '100%' : '80vw', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: embed ? 'none' : 765, margin: '0 auto', padding: '36px 48px 0', borderTop: noBorder ? 'none' : '1px solid rgba(0,0,0,0.07)' }}>
        {children}
      </div>
    </div>
  );
};

const MethodIcon = ({ type, size = 44 }) => {
  const s = size;
  const icons = {
    interview: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="6" y="8" width="40" height="26" rx="10" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <circle cx="17" cy="21" r="3" fill="#3DAA74"/>
        <circle cx="26" cy="21" r="3" fill="#3DAA74"/>
        <circle cx="35" cy="21" r="3" fill="#3DAA74"/>
        <path d="M16 34 L11 44 L26 40" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    survey: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="8" y="4" width="36" height="44" rx="7" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="15" y1="16" x2="37" y2="16" stroke="#3DAA74" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="24" x2="37" y2="24" stroke="#3DAA74" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="32" x2="28" y2="32" stroke="#3DAA74" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="40" cy="40" r="8" fill="#3DAA74"/>
        <path d="M36 40 L39 43 L44 36" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    usability: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="6" width="44" height="30" rx="7" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="20" y1="36" x2="32" y2="36" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="26" y1="36" x2="26" y2="46" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="20" y1="46" x2="32" y2="46" stroke="#3DAA74" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 24 L28 18 L28 30 Z" fill="#3DAA74"/>
      </svg>
    ),
    competitive: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="5" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <rect x="28" y="4" width="20" height="20" rx="5" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <rect x="4" y="28" width="20" height="20" rx="5" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <rect x="28" y="28" width="20" height="20" rx="5" fill="#3DAA74"/>
        <path d="M32 38 L37 43 L44 34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    matrix: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="44" height="44" rx="7" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="4" y1="18" x2="48" y2="18" stroke="#3DAA74" strokeWidth="1"/>
        <line x1="4" y1="32" x2="48" y2="32" stroke="#3DAA74" strokeWidth="1"/>
        <line x1="18" y1="4" x2="18" y2="48" stroke="#3DAA74" strokeWidth="1"/>
        <line x1="32" y1="4" x2="32" y2="48" stroke="#3DAA74" strokeWidth="1"/>
        <circle cx="25" cy="25" r="6" fill="#3DAA74"/>
      </svg>
    ),
    affinity: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="20" height="14" rx="4" fill="#3DAA74"/>
        <rect x="28" y="4" width="20" height="14" rx="4" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <rect x="4" y="24" width="20" height="14" rx="4" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <rect x="28" y="24" width="20" height="14" rx="4" fill="#F0FAF5" stroke="#3DAA74" strokeWidth="1.5"/>
        <line x1="24" y1="11" x2="28" y2="11" stroke="#3DAA74" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="24" y1="31" x2="28" y2="31" stroke="#3DAA74" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="14" y1="18" x2="14" y2="24" stroke="#3DAA74" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="38" y1="18" x2="38" y2="24" stroke="#3DAA74" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    ),
  };
  return (
    <div style={{
      width: 68, height: 68, background: '#FAFAF8',
      borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {icons[type] || <div style={{ width: s, height: s, background: '#F0FAF5', borderRadius: 8 }} />}
    </div>
  );
};

const HitMiss = ({ v }) => {
  if (v === 'hit')  return <span style={{ color: '#3DAA74', fontWeight: 600, fontSize: 12 }}>✓ Hit</span>;
  if (v === 'miss') return <span style={{ color: '#E07D2E', fontWeight: 600, fontSize: 12 }}>✗ Miss</span>;
  if (v === 'fp')   return <span style={{ color: '#E07D2E', fontWeight: 600, fontSize: 12 }}>✗ False+</span>;
  return <span style={{ color: '#ddd', fontSize: 12 }}>—</span>;
};

Object.assign(window, {
  Placeholder, Tag, Stat, QuoteBlock, Card, SectionHeader, SectionWrap, Container, MethodIcon, HitMiss
});
