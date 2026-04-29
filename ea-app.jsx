// ea-app.jsx — Nav + App + Tweaks

const IS_EMBED = new URLSearchParams(window.location.search).has('embed');

const PROJECTS = [
  { id: 1, title: 'Energy Ave.', year: '2024', tags: ['UXR', 'Product Design', 'EdTech'], href: 'Energy Ave.html', available: true },
  { id: 2, title: "Val's Kitchen", year: '2024', tags: ['UXR', 'Product Design', 'B2B'], href: 'Project 02.html', available: true },
  { id: 3, title: 'Cabrillo NM', year: '2023', tags: ['Visual Design', 'Print', 'NPS'], href: 'Project 03.html', available: true },
  { id: 4, title: 'UCSD Laundry App', year: '2025', tags: ['UX Design', 'Participatory'], href: 'Project 04.html', available: true },
];

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'goals',        label: 'Goals' },
  { id: 'methodology',  label: 'Methods' },
  { id: 'competitive',  label: 'Competitive' },
  { id: 'stakeholders', label: 'Interviews' },
  { id: 'concept',      label: 'Concept' },
  { id: 'round1',       label: 'Round 1' },
  { id: 'round2',       label: 'Round 2' },
  { id: 'affinity',     label: 'Synthesis' },
  { id: 'insights',     label: 'Insights' },
  { id: 'impact',       label: 'Impact' },
  { id: 'reflection',   label: 'Reflection' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#3DAA74",
  "spacing": "normal",
  "showProgress": true
}/*EDITMODE-END*/;

/* ── LEFT: standalone Projects card ── */
const ProjectsCard = () => {
  const currentFile = window.location.pathname.split('/').pop() || window.location.href.split('/').pop();

  return (
    <div id="projects-card" style={{
      position: 'fixed',
      top: '5vw',
      bottom: '5vw',
      left: '5vw',
      width: '18vw',
      background: 'rgba(255, 255, 255, 0.35)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderRadius: 20,
      border: '1px solid rgba(255, 255, 255, 0.55)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 100,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px 14px',
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#141414', letterSpacing: '-0.01em' }}>Projects</span>
        <a href="home.html" style={{
          background: 'rgba(0,0,0,0.07)', border: 'none', borderRadius: 100,
          width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', textDecoration: 'none', flexShrink: 0,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.13)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.07)'}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M2 6.5L8 2L14 6.5V14H10V10H6V14H2V6.5Z" stroke="#141414" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Project list */}
      <div style={{ padding: '10px 12px', flex: 1, overflowY: 'auto' }}>
        {PROJECTS.map((p) => {
          const isActive = decodeURIComponent(currentFile) === p.href;
          return (
            <a key={p.id} href={p.href}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 14,
                background: isActive ? 'rgba(0,0,0,0.03)' : 'transparent',
                marginBottom: 2,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <div>
                <div style={{
                  fontSize: 15, fontWeight: isActive ? 700 : 400,
                  color: p.available ? '#141414' : '#b8b8b0',
                  letterSpacing: '-0.015em', lineHeight: 1.2, marginBottom: 6,
                }}>{p.title}</div>
                {p.available && p.tags ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{
                        fontSize: 10, fontWeight: 600, color: '#888',
                        background: 'rgba(0,0,0,0.06)', borderRadius: 100,
                        padding: '2px 8px', letterSpacing: '0.01em',
                      }}>{t}</span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#a8a8a0', fontWeight: 400 }}>
                    {p.available ? p.year : 'Coming soon'}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

/* ── RIGHT: vertical TOC ── */
const TOCSidebar = ({ accent }) => {
  const [active, setActive] = React.useState('overview');

  React.useEffect(() => {
    const onScroll = () => {
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(NAV_ITEMS[i].id);
          return;
        }
      }
      setActive('overview');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: 24,
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      zIndex: 100,
    }}>
      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => scrollTo(id)} style={{
            background: 'none', border: 'none',
            textAlign: 'right', padding: '4px 0',
            fontSize: 12, fontWeight: isActive ? 600 : 400,
            color: isActive ? '#141414' : '#b0b0a8',
            cursor: 'pointer', fontFamily: 'inherit',
            letterSpacing: '-0.01em', lineHeight: 1.4,
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#555'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#b0b0a8'; }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

const ProgressBar = ({ accent }) => {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setPct(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 199, background: 'rgba(0,0,0,0.06)' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: accent, transition: 'width 0.1s linear', borderRadius: '0 2px 2px 0' }} />
    </div>
  );
};

const TweaksPanel = ({ tweaks, setTweaks, visible }) => {
  if (!visible) return null;
  const update = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  };
  const accents = [
    { label: 'Green', value: '#3DAA74' },
    { label: 'Indigo', value: '#5B6EE8' },
    { label: 'Amber', value: '#E07D2E' },
    { label: 'Rose', value: '#D94F6B' },
  ];
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 300, background: 'white', borderRadius: 20, padding: '24px 22px', boxShadow: '0 8px 40px rgba(0,0,0,0.14)', width: 240, fontFamily: 'inherit' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 18 }}>Tweaks</div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#333' }}>Accent Color</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {accents.map(({ label, value }) => (
            <button key={value} onClick={() => update('accentColor', value)} title={label} style={{
              width: 30, height: 30, borderRadius: 100, background: value, border: tweaks.accentColor === value ? '3px solid #141414' : '3px solid transparent',
              cursor: 'pointer', transition: 'border 0.15s',
            }} />
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#333' }}>Section Spacing</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['compact', 'normal', 'spacious'].map(s => (
            <button key={s} onClick={() => update('spacing', s)} style={{
              flex: 1, padding: '6px 4px', borderRadius: 10, border: tweaks.spacing === s ? `2px solid ${tweaks.accentColor}` : '2px solid #eee',
              background: tweaks.spacing === s ? tweaks.accentColor + '14' : 'white',
              fontSize: 11, fontWeight: 600, color: tweaks.spacing === s ? tweaks.accentColor : '#888',
              cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
            }}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Reading Progress</span>
          <button onClick={() => update('showProgress', !tweaks.showProgress)} style={{
            width: 40, height: 22, borderRadius: 100, background: tweaks.showProgress ? tweaks.accentColor : '#ddd',
            border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
          }}>
            <span style={{ position: 'absolute', top: 3, left: tweaks.showProgress ? 20 : 2, width: 16, height: 16, background: 'white', borderRadius: 100, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('message', (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    });
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  }, []);

  const accent = tweaks.accentColor;
  const sectionPadding = tweaks.spacing === 'compact' ? '64px 0' : tweaks.spacing === 'spacious' ? '128px 0' : '96px 0';

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  return (
    <div style={{ '--section-pad': sectionPadding }}>
      {!IS_EMBED && <ProjectsCard />}
      {/* <TOCSidebar accent={accent} /> */}
      {!IS_EMBED && tweaks.showProgress && <ProgressBar accent={accent} />}
      <HeroSection accent={accent} />
      <OverviewSection />
      <ResearchGoalsSection />
      <MethodologySection />
      <CompetitiveAnalysisSection />
      <StakeholderSection />
      <ConceptSelectionSection />
      <Round1Section />
      <Round2Section />
      <AffinitySection />
      <InsightsSection />
      <DesignImpactSection />
      <ReflectionSection />

      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
