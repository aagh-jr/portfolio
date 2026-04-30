// ea-app-v2.jsx — updated app shell for v2 visual system

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

/* ── LEFT: Projects sidebar card ── */
const ProjectsCard = () => {
  const currentFile = decodeURIComponent(window.location.pathname.split('/').pop() || window.location.href.split('/').pop());

  return (
    <div id="projects-card" style={{
      position: 'fixed',
      top: '5vw',
      bottom: '5vw',
      left: '5vw',
      width: '14vw',
      background: V2.dark,
      borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 100,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 18px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Selected Work</span>
        <a href="index.html" style={{
          background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 100,
          width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', textDecoration: 'none', flexShrink: 0,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M2 6.5L8 2L14 6.5V14H10V10H6V14H2V6.5Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Project list */}
      <div style={{ padding: '10px 10px', flex: 1, overflowY: 'auto' }}>
        {PROJECTS.map((p) => {
          const isActive = currentFile === p.href || currentFile === p.href.replace('.html', ' v2.html');
          return (
            <a key={p.id} href={p.href}
              style={{
                display: 'block',
                padding: '14px 14px',
                borderRadius: 12,
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                marginBottom: 3,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  letterSpacing: '-0.015em', lineHeight: 1.2,
                }}>{p.title}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>{p.year}</div>
              </div>
              {p.available && p.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 10, fontWeight: 500,
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.02em',
                    }}>{t}</span>
                  ))}
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>Abel Angel · 2025</div>
      </div>
    </div>
  );
};

/* ── RIGHT: vertical TOC ── */
const TOCSidebar = () => {
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
      position: 'fixed', top: '50%', right: 24,
      transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 2, zIndex: 100,
    }}>
      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => scrollTo(id)} style={{
            background: 'none', border: 'none', textAlign: 'right',
            padding: '3px 0', fontSize: 11,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? V2.ink : 'rgba(30,30,26,0.3)',
            cursor: 'pointer', fontFamily: 'inherit',
            letterSpacing: '-0.01em', lineHeight: 1.5,
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = V2.muted; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(30,30,26,0.3)'; }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

const ProgressBar = () => {
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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 199, background: 'rgba(0,0,0,0.06)' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: V2.accent, transition: 'width 0.1s linear' }} />
    </div>
  );
};

const App = () => {
  return (
    <div>
      {!IS_EMBED && <ProjectsCard />}
      {!IS_EMBED && <ProgressBar />}
      <HeroSection />
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
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
