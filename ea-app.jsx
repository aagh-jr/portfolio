// ea-app.jsx — Nav + App + Tweaks

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

const Nav = ({ accent }) => {
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
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', left: 24, top: '50%', transform: 'translateY(-50%)',
      zIndex: 150, display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => scrollTo(id)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', padding: '3px 0',
            fontSize: 12, fontWeight: isActive ? 600 : 400,
            color: isActive ? '#141414' : '#aaa',
            transition: 'color 0.15s',
            textAlign: 'left', whiteSpace: 'nowrap',
          }}>
            <span style={{
              fontSize: 10, lineHeight: 1,
              color: accent,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.15s',
            }}>›</span>
            {label}
          </button>
        );
      })}
    </nav>
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

  // Inject accent into CSS custom props
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  return (
    <div style={{ '--section-pad': sectionPadding }}>
      <Nav accent={accent} />
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

      {/* Footer */}
      <div style={{ background: '#141414', padding: '60px 36px 64px', textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.025em' }}>Energy Ave</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>UX Research Case Study · UCSD ENG 100D · Winter 2025</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Researcher & Designer', '8-Person Team', '10 Weeks', 'PlanetFlip', 'Construct3'].map(t => (
            <span key={t} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)', borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
