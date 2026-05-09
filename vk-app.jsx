// vk-app.jsx — Val's Kitchen App: nav, projects card, composition

const VK_IS_EMBED = new URLSearchParams(window.location.search).has('embed');

const VK_PROJECTS = [
  { id: 1, title: 'Energy Ave.', year: '2024', tags: ['UXR', 'Product Design', 'EdTech'], href: 'Energy Ave.html', available: true },
  { id: 2, title: "Val's Kitchen", year: '2024', tags: ['UXR', 'Product Design', 'B2B'], href: 'Project 02.html', available: true },
  { id: 3, title: 'Cabrillo NM', year: '2023', tags: ['PM', 'Public Engagement', 'NPS'], href: 'Project 03.html', available: true },
  { id: 4, title: 'UCSD Laundry App', year: '2025', tags: ['UX Design', 'Participatory'], href: 'Project 04.html', available: true },
];

const VK_NAV_ITEMS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'role',         label: 'My Role' },
  { id: 'methodology',  label: 'Methods' },
  { id: 'participants', label: 'Scenarios' },
  { id: 'findings',     label: 'Findings' },
  { id: 'synthesis',    label: 'Synthesis' },
  { id: 'decisions',    label: 'Decisions' },
  { id: 'prototype',    label: 'Prototype' },
  { id: 'reflection',   label: 'Reflection' },
];

const VK_TWEAK_DEFAULTS = {
  accentColor: '#3DAA74',
  spacing: 'normal',
  showProgress: true,
};

const VKProjectsCard = () => {
  const currentFile = window.location.pathname.split('/').pop() || window.location.href.split('/').pop();
  return (
    <div id="projects-card" style={{
      position: 'fixed', top: '5vw', bottom: '5vw', left: '5vw', width: '18vw',
      background: 'rgba(255, 255, 255, 0.35)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderRadius: 20,
      border: '1px solid rgba(255, 255, 255, 0.55)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 14px' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#141414', letterSpacing: '-0.01em' }}>Projects</span>
        <a href="projects.html" style={{
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
      <div style={{ padding: '10px 12px', flex: 1, overflowY: 'auto' }}>
        {VK_PROJECTS.map((p) => {
          const isActive = decodeURIComponent(currentFile) === p.href;
          return (
            <a key={p.id} href={p.href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 14,
              background: isActive ? 'rgba(0,0,0,0.03)' : 'transparent',
              marginBottom: 2, cursor: 'pointer', textDecoration: 'none',
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

const VKProgressBar = ({ accent }) => {
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

const VKApp = () => {
  const [tweaks] = React.useState(VK_TWEAK_DEFAULTS);
  const accent = tweaks.accentColor;
  const sectionPadding = tweaks.spacing === 'compact' ? '64px 0' : tweaks.spacing === 'spacious' ? '128px 0' : '96px 0';

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  return (
    <div style={{ '--section-pad': sectionPadding }}>
      {!VK_IS_EMBED && <VKProjectsCard />}
      {!VK_IS_EMBED && tweaks.showProgress && <VKProgressBar accent={accent} />}
      <VKHeroSection accent={accent} />
      <VKOverviewSection />
      <VKRoleSection />
      <VKMethodologySection />
      <VKParticipantsSection />
      <VKFindingsSection />
      <VKSynthesisSection />
      <VKDecisionsSection />
      <VKPrototypeSection />
      <VKReflectionSection />

    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<VKApp />);
