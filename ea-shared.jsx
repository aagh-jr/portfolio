// ea-shared-v2.jsx — shared UI primitives — new palette

const V2 = {
  bg:          '#fffffd',
  white:       '#ffffff',
  dark:        '#2a2b2a',
  ink:         '#2a2b2a',
  muted:       'rgba(42,43,42,0.45)',
  border:      'rgba(42,43,42,0.08)',
  // Palette accents
  periwinkle:  '#b6c2fe',
  petal:       '#ffc7d8',
  sage:        '#bcd8cd',
  // Semantic
  accent:      '#b6c2fe',       // periwinkle — positive / highlight
  accentBg:    'rgba(182,194,254,0.18)',
  warn:        '#e8789a',       // deeper petal — warnings / issues
  warnBg:      'rgba(255,199,216,0.25)',
  neutral:     '#bcd8cd',       // sage — neutral
  neutralBg:   'rgba(188,216,205,0.22)',
};

const Placeholder = ({ label, height = 220, note }) => (
  <div style={{
    height, borderRadius: 14,
    background: 'rgba(42,43,42,0.04)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', border: '1px dashed rgba(42,43,42,0.12)',
    gap: 8, padding: 24, textAlign: 'center',
  }}>
    <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(42,43,42,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>[ {label} ]</span>
    {note && <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(42,43,42,0.2)', maxWidth: 320, lineHeight: 1.6 }}>{note}</span>}
  </div>
);

const Tag = ({ children, color = 'default' }) => {
  const p = {
    default:     { fg: V2.muted,       border: V2.border,                     bg: 'transparent' },
    green:       { fg: '#2a6e8a',      border: 'rgba(182,194,254,0.5)',        bg: V2.accentBg },
    amber:       { fg: '#b05070',      border: 'rgba(255,199,216,0.5)',        bg: V2.warnBg },
    gray:        { fg: V2.muted,       border: V2.border,                     bg: V2.neutralBg },
    blue:        { fg: '#4a5ab8',      border: 'rgba(182,194,254,0.4)',        bg: V2.accentBg },
    dark:        { fg: '#fffffd',      border: 'transparent',                  bg: V2.dark },
    red:         { fg: '#b04030',      border: 'rgba(176,64,48,0.25)',         bg: 'rgba(176,64,48,0.08)' },
  };
  const c = p[color] || p.default;
  return (
    <span style={{
      background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
      borderRadius: 100, padding: '3px 12px',
      fontSize: 11, fontWeight: 600, display: 'inline-block',
      lineHeight: 1.6, letterSpacing: '0.03em',
    }}>{children}</span>
  );
};

const Stat = ({ value, label, accent, sub }) => (
  <div style={{
    borderRadius: 16, padding: '28px 20px', textAlign: 'center',
    border: `1px solid ${V2.border}`,
    display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center',
    background: V2.white,
    boxShadow: '0 2px 12px rgba(42,43,42,0.05)',
  }}>
    <span style={{ fontSize: 40, fontWeight: 500, color: accent || V2.accent, lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'Lora, Georgia, serif' }}>{value}</span>
    <span style={{ fontSize: 12, color: V2.muted, lineHeight: 1.4, maxWidth: 110 }}>{label}</span>
    {sub && <span style={{ fontSize: 11, color: accent || V2.accent, fontWeight: 600 }}>{sub}</span>}
  </div>
);

const QuoteBlock = ({ text, author, role }) => (
  <div style={{ padding: '24px 32px', borderLeft: `3px solid ${V2.accent}`, background: V2.accentBg, borderRadius: '0 12px 12px 0' }}>
    <p style={{ fontSize: 18, lineHeight: 1.8, color: V2.ink, fontStyle: 'italic', margin: 0, fontFamily: 'Lora, Georgia, serif', fontWeight: 400 }}>"{text}"</p>
    {author && <div style={{ marginTop: 12, fontSize: 12, color: V2.muted, fontWeight: 500, letterSpacing: '0.04em' }}>— {author}{role ? `, ${role}` : ''}</div>}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: V2.white, borderRadius: 16, padding: '28px',
    boxShadow: '0 2px 16px rgba(42,43,42,0.06), 0 1px 3px rgba(42,43,42,0.04)',
    ...style
  }}>{children}</div>
);

const SectionHeader = ({ num, title, subtitle }) => (
  <div style={{ marginBottom: 44 }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: V2.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
      {String(num).padStart(2, '0')}
    </div>
    <h2 style={{ fontSize: 36, fontWeight: 500, margin: 0, color: V2.ink, lineHeight: 1.12, letterSpacing: '-0.025em', fontFamily: 'Lora, Georgia, serif' }}>{title}</h2>
    {subtitle && <p style={{ marginTop: 14, fontSize: 15, color: V2.muted, lineHeight: 1.7, maxWidth: 600, margin: '14px 0 0' }}>{subtitle}</p>}
  </div>
);

const SectionWrap = ({ id, children, style = {} }) => (
  <section id={id} style={{ padding: '56px 0', ...style }}>{children}</section>
);

const Container = ({ children, noBorder = false }) => {
  const embed = new URLSearchParams(window.location.search).has('embed');
  return (
    <div style={{ marginLeft: embed ? 0 : '23vw', width: embed ? '100%' : '70vw', paddingLeft: embed ? '10%' : 0, paddingRight: embed ? '10%' : 0, boxSizing: 'border-box' }}>
      <div style={{ maxWidth: embed ? 'none' : 580, margin: '0 auto', padding: '36px 48px 0', borderTop: noBorder ? 'none' : `1px solid ${V2.border}` }}>
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
        <rect x="6" y="8" width="40" height="26" rx="10" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <circle cx="17" cy="21" r="3" fill={V2.accent}/><circle cx="26" cy="21" r="3" fill={V2.accent}/><circle cx="35" cy="21" r="3" fill={V2.accent}/>
        <path d="M16 34 L11 44 L26 40" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    survey: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="8" y="4" width="36" height="44" rx="7" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <line x1="15" y1="16" x2="37" y2="16" stroke={V2.accent} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="24" x2="37" y2="24" stroke={V2.accent} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="32" x2="28" y2="32" stroke={V2.accent} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="40" cy="40" r="8" fill={V2.accent}/>
        <path d="M36 40 L39 43 L44 36" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    usability: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="6" width="44" height="30" rx="7" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <line x1="20" y1="36" x2="32" y2="36" stroke={V2.accent} strokeWidth="1.5"/>
        <line x1="26" y1="36" x2="26" y2="46" stroke={V2.accent} strokeWidth="1.5"/>
        <line x1="20" y1="46" x2="32" y2="46" stroke={V2.accent} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 24 L28 18 L28 30 Z" fill={V2.accent}/>
      </svg>
    ),
    competitive: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="5" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <rect x="28" y="4" width="20" height="20" rx="5" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <rect x="4" y="28" width="20" height="20" rx="5" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <rect x="28" y="28" width="20" height="20" rx="5" fill={V2.accent}/>
        <path d="M32 38 L37 43 L44 34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    matrix: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="44" height="44" rx="7" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <line x1="4" y1="18" x2="48" y2="18" stroke={V2.accent} strokeWidth="1"/>
        <line x1="4" y1="32" x2="48" y2="32" stroke={V2.accent} strokeWidth="1"/>
        <line x1="18" y1="4" x2="18" y2="48" stroke={V2.accent} strokeWidth="1"/>
        <line x1="32" y1="4" x2="32" y2="48" stroke={V2.accent} strokeWidth="1"/>
        <circle cx="25" cy="25" r="6" fill={V2.accent}/>
      </svg>
    ),
    affinity: (
      <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
        <rect x="4" y="4" width="20" height="14" rx="4" fill={V2.accent}/>
        <rect x="28" y="4" width="20" height="14" rx="4" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <rect x="4" y="24" width="20" height="14" rx="4" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
        <rect x="28" y="24" width="20" height="14" rx="4" fill={V2.accentBg} stroke={V2.accent} strokeWidth="1.5"/>
      </svg>
    ),
  };
  return (
    <div style={{ width: 64, height: 64, background: V2.accentBg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icons[type] || <div style={{ width: s, height: s, background: V2.accentBg, borderRadius: 8 }} />}
    </div>
  );
};

const HitMiss = ({ v }) => {
  if (v === 'hit')  return <span style={{ color: '#4a8a6a', fontWeight: 700, fontSize: 12 }}>✓ Hit</span>;
  if (v === 'miss') return <span style={{ color: V2.warn, fontWeight: 700, fontSize: 12 }}>✗ Miss</span>;
  if (v === 'fp')   return <span style={{ color: V2.warn, fontWeight: 700, fontSize: 12 }}>✗ False+</span>;
  return <span style={{ color: '#ddd', fontSize: 12 }}>—</span>;
};

Object.assign(window, { V2, Placeholder, Tag, Stat, QuoteBlock, Card, SectionHeader, SectionWrap, Container, MethodIcon, HitMiss });
