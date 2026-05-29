// ea-sections-1-v2.jsx — Hero, Overview, Research Goals, Methodology (v2 visual)

const HeroSection = () =>
  <SectionWrap id="hero" style={{ padding: '100px 0 72px', background: 'transparent' }}>
    <Container noBorder>

      {/* Eyebrow */}
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: V2.muted, marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span>UX Research</span>
        <span style={{ color: V2.border }}>·</span>
        <span>Product Design</span>
        <span style={{ color: V2.border }}>·</span>
        <span>EdTech</span>
        <span style={{ color: V2.border }}>·</span>
        <span>2024</span>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(56px, 7vw, 88px)', fontWeight: 500, lineHeight: 1.0,
        letterSpacing: '-0.035em', color: V2.ink, marginBottom: 36,
        fontFamily: 'Lora, Georgia, serif', maxWidth: 760,
      }}>
        Energy Ave.
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 18, lineHeight: 1.75, color: V2.muted,
        maxWidth: 540, marginBottom: 56, fontWeight: 400,
      }}>
        Designing a gamified energy conservation experience for PlanetFlip — research-backed, fully playable, and built in 10 weeks.
      </p>

      {/* Metadata row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: 0,
        width: 'fit-content', marginBottom: 72,
        borderTop: `1px solid ${V2.border}`,
        borderBottom: `1px solid ${V2.border}`,
      }}>
        {[['Role', 'Researcher & Designer'], ['Team', '8 People'], ['Duration', '10 Weeks'], ['Client', 'PlanetFlip']].map(([l, v], i) =>
          <div key={l} style={{
            padding: '18px 36px 18px', paddingLeft: i === 0 ? 0 : 36,
            borderLeft: i > 0 ? `1px solid ${V2.border}` : 'none',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: V2.muted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: V2.ink }}>{v}</div>
          </div>
        )}
        <div style={{ padding: '18px 36px 18px', borderLeft: `1px solid ${V2.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: V2.muted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Links</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[{ label: 'Figma Files', href: '#' }, { label: 'Full Report', href: '#' }].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 14, fontWeight: 500, color: V2.ink,
                textDecoration: 'none', transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {label}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div style={{ marginTop: 48, marginBottom: 56, paddingTop: 36, borderTop: `1px solid ${V2.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: V2.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
          Executive Summary
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.9, color: '#3a3a34', margin: 0, maxWidth: 580 }}>
          Energy Ave is a fully playable, browser-based game teaching household energy conservation through room-by-room interaction — designed, tested, and shipped in 10 weeks for PlanetFlip, a K–12 sustainability platform. I led user research across two formal study rounds, conducted stakeholder interviews with NPS staff, and drove concept selection using a weighted decision matrix. The team shipped in March 2025, meeting or exceeding all five pre-defined success metrics: 12-minute average sessions, 90% task success, 80% knowledge improvement, 2.5-month development timeline, and full mobile and desktop accessibility.
        </p>
      </div>

      <Video
        src="uploads/ea-gameplay.mp4"
        caption="Bedroom level — final hi-fi build (2× speed)."
      />
    </Container>
  </SectionWrap>;


const OverviewSection = () =>
  <SectionWrap id="overview" style={{ background: V2.white }}>
    <Container>
      <SectionHeader num={1} title="The Problem" subtitle="The gap between awareness and action is climate's hardest challenge." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 10, fontWeight: 700, color: V2.accent, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>Challenge</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#3a3a34', margin: 0 }}>
            Sustainability education leans on information delivery, not interactive engagement. Younger users already <em>know</em> it matters — they need a tool that turns awareness into habit.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 10, fontWeight: 700, color: V2.accent, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>Our Approach</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#3a3a34', margin: 0 }}>
            PlanetFlip had concepts but nothing built or validated. We designed a fully playable, research-backed game from scratch: educationally grounded, usable without instruction, and engaging enough to hold attention.
          </p>
        </Card>
      </div>

      {/* Research question — dark card */}
      <div style={{ background: V2.dark, borderRadius: 20, padding: '36px 40px', marginBottom: 40 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>Research Question</div>
        <p style={{ fontSize: 20, lineHeight: 1.65, fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, maxWidth: 680, fontFamily: 'Lora, Georgia, serif' }}>
          "How might we design a gamified energy conservation experience that's engaging to complete, intuitive without instruction, and meaningful enough to translate to real life?"
        </p>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: V2.ink, letterSpacing: '-0.01em' }}>What is Energy Ave?</h3>
      <div style={{ marginBottom: 20 }}>
        <Photo
          src="uploads/ea-title-hifi.png"
          alt="Energy Ave title screen"
          caption="Title screen — pixel-art aesthetic carried through every scene."
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          ['Room by Room', 'Players navigate a virtual home — bedroom, bathroom, kitchen — clicking on items in each space.', 'rgba(184,118,42,0.07)', V2.accent],
          ['Spot & Fix',   'Tap household appliances and electronics to identify and correct energy-wasting behaviors.',       'rgba(0,0,0,0.03)',           V2.muted],
          ['Learn & Earn', 'Each interaction triggers a real-world energy fact card. Earn points, fill the meter, unlock the next room.', 'rgba(0,0,0,0.03)', V2.muted],
        ].map(([title, desc, bg, accent]) =>
          <div key={title} style={{ background: bg, borderRadius: 16, padding: '24px 22px', border: `1px solid ${V2.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: accent, letterSpacing: '-0.01em' }}>{title}</div>
            <div style={{ fontSize: 14, color: '#5a5a52', lineHeight: 1.7 }}>{desc}</div>
          </div>
        )}
      </div>
    </Container>
  </SectionWrap>;


const ResearchGoalsSection = () =>
  <SectionWrap id="goals">
    <Container>
      <SectionHeader num={2} title="Research Goals & Questions" />
      {(() => {
        const [visible, setVisible] = React.useState([false, false, false, false]);
        const rowRefs = React.useRef([]);

        React.useEffect(() => {
          const observers = rowRefs.current.map((el, i) => {
            if (!el) return null;
            const obs = new IntersectionObserver(([entry]) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setVisible(prev => { const next = [...prev]; next[i] = true; return next; });
                }, i * 120);
                obs.disconnect();
              }
            }, { threshold: 0.4 });
            obs.observe(el);
            return obs;
          });
          return () => observers.forEach(o => o && o.disconnect());
        }, []);

        const questions = [
          'What patterns in existing sustainability games drive or kill engagement?',
          'Which concept best meets the needs of our target users and client?',
          'Can users understand how to play without a tutorial?',
          'Does the game motivate players to apply energy-saving habits in real life?',
        ];
        const goals = [
          'Understand what makes existing sustainability games succeed or fail at engaging users',
          'Identify which concept best balances educational impact, usability, feasibility, and engagement',
          'Validate whether the interaction model is intuitive without explicit instruction',
          'Evaluate whether the game teaches, engages, and motivates real-world behavior change',
        ];
        // Arrow line length (x1=0 x2=58, total ~58px + marker)
        const lineLen = 62;
        return (
          <div style={{ marginBottom: 48 }}>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', marginBottom: 18 }}>
              <h3 style={{ fontSize: 10, fontWeight: 700, color: V2.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Research Questions</h3>
              <div></div>
              <h3 style={{ fontSize: 10, fontWeight: 700, color: V2.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Research Goals</h3>
            </div>
            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {questions.map((q, i) => (
                <div key={i} ref={el => rowRefs.current[i] = el} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', minHeight: 98 }}>
                  {/* RQ Card */}
                  <div style={{ background: V2.white, borderRadius: 14, padding: '16px 20px', border: `1px solid ${V2.border}`, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: V2.accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>RQ{i + 1}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4a4a42', margin: 0 }}>{q}</p>
                  </div>
                  {/* Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      transform: visible[i] ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left center',
                      transition: visible[i] ? 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' : 'none',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <svg width="64" height="16" viewBox="0 0 64 16" style={{ overflow: 'visible' }}>
                        <defs>
                          <marker id={`arrowhead-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill={V2.accent} opacity="0.6" />
                          </marker>
                        </defs>
                        <line x1="2" y1="8" x2="56" y2="8" stroke={V2.accent} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 3" markerEnd={`url(#arrowhead-${i})`} />
                      </svg>
                    </div>
                  </div>
                  {/* Goal */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', height: '100%' }}>
                    <div style={{ minWidth: 24, height: 24, background: V2.accentBg, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: V2.accent, flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: '#4a4a42', margin: 0 }}>{goals[i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 16, color: V2.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Success Metrics — Defined Upfront</div>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Metric', 'Method', 'Target'].map(h =>
                  <th key={h} style={{ background: V2.accentBg, color: V2.accent, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 16px', textAlign: 'left' }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {[
                ['User Engagement',       'Session Timing',    '≥ 10 min/session'],
                ['Task Success Rate',     'Usability Testing', '≥ 85%'],
                ['Knowledge Improvement', 'Pre/Post Survey',   '≥ 75% of users improve'],
                ['Development Feasibility','Timeline Tracking','≤ 3 months'],
                ['Device Accessibility',  'Technical Testing', 'Mobile & desktop supported'],
              ].map(([m, method, t]) =>
                <tr key={m}>
                  <td style={{ padding: '11px 16px', fontSize: 14, borderBottom: `1px solid ${V2.border}`, fontWeight: 500, color: V2.ink }}>{m}</td>
                  <td style={{ padding: '11px 16px', fontSize: 14, borderBottom: `1px solid ${V2.border}`, color: V2.muted }}>{method}</td>
                  <td style={{ padding: '11px 16px', fontSize: 14, borderBottom: `1px solid ${V2.border}` }}><Tag color="amber">{t}</Tag></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  </SectionWrap>;


const MethodologySection = () =>
  <SectionWrap id="methodology" style={{ background: V2.white }}>
    <Container>
      <SectionHeader num={3} title="Methodology" subtitle="A mixed-methods approach across four research phases — behavioral and attitudinal." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 48 }}>
        {[
          { icon: 'competitive', phase: '01', label: 'Competitive Analysis', desc: 'Audited 4 gamified sustainability tools to map the landscape and identify the gap' },
          { icon: 'interview',   phase: '02', label: 'Stakeholder Interviews', desc: 'PlanetFlip, SD Climate Collaborative & Cabrillo NPS — 3 orgs, 3 perspectives' },
          { icon: 'usability',   phase: '03', label: 'Formative Testing', desc: 'Affordance test + cognitive walkthrough on static wireframes before any code was written' },
          { icon: 'survey',      phase: '04', label: 'Summative Testing', desc: 'Full gameplay observation + 7-question post-task attitudinal survey' },
        ].map(({ icon, phase, label, desc }) =>
          <Card key={phase} style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <MethodIcon type={icon} size={44} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: V2.accent, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>{phase}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: V2.ink, letterSpacing: '-0.01em' }}>{label}</div>
            <div style={{ fontSize: 13, color: V2.muted, lineHeight: 1.6 }}>{desc}</div>
          </Card>
        )}
      </div>

    </Container>
  </SectionWrap>;

const MyRoleSection = () =>
  <SectionWrap id="my-role" style={{ background: V2.white }}>
    <Container>
      <SectionHeader num={0} title="My Role" subtitle="Lead researcher on an 8-person team." />

      {/* Contribution tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {[
          'Stakeholder Interviews (NPS)',
          'Concept Evaluation & Selection',
          'Study 1 Procedure & Introduction',
          'Study 2 Execution',
          'Conclusions & Recommendations',
          'Initial Wireframes & Lo-fi',
          'Hi-fi Design Contributions',
          'Item Cards & Variant Design',
          'Survey Response Chart',
        ].map((c) => <Tag key={c} color="gray">{c}</Tag>)}
      </div>

      <Card>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#444', margin: 0 }}>
          My primary contribution was research. I designed the structure for both testing rounds — a formative affordance test and cognitive walkthrough on static wireframes, followed by a summative gameplay observation and post-task survey — and wrote the Study 1 introduction and procedure. I led the Study 2 sessions with stakeholders and student participants, synthesized findings into the project's conclusions and recommendations, and built the user test survey response chart. I also conducted in-person stakeholder interviews with NPS staff and drove the concept evaluation process that selected Energy Ave over three competing designs. Within an 8-person team, I was the lead researcher: the person who designed the studies, ran the sessions, and ensured findings translated into product decisions.
        </p>
      </Card>
    </Container>
  </SectionWrap>;

Object.assign(window, { HeroSection, OverviewSection, ResearchGoalsSection, MethodologySection, MyRoleSection });
