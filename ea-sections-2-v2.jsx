// ea-sections-2-v2.jsx — Competitive Analysis, Stakeholder Interviews, Concept Selection

const CompetitiveAnalysisSection = () => {
  const games = [
    { title: 'Space Waste Odyssey', org: 'PBS Kids', fit: 'K–6',
      pros: ['Closed captioning', 'Multi-level progression', 'High-quality visuals'],
      cons: ['Levels too long', 'No penalties for inaction', 'Low urgency — no time constraints'] },
    { title: 'Become an Energy Champion', org: 'National Energy Foundation', fit: 'K–8',
      pros: ['Good educational content', 'Character customization'],
      cons: ['Highly repetitive mini-games', 'Hard to navigate', 'No accessibility features'] },
    { title: 'Fidget Power', org: 'PBS Kids / Design Squad', fit: 'K–6',
      pros: ['Location-based mini-games', 'Strong loading screen'],
      cons: ['Repetitive tasks', 'Thin sustainability info', 'Dead end after completion'] },
    { title: 'Financial Freedom', org: 'Legends of Learning', fit: '6–12',
      pros: ['Penalizes unsustainable choices', 'Avatar customization'],
      cons: ['Requires account to access', 'Slow pacing', 'Too complex for younger users'] },
  ];

  return (
    <SectionWrap id="competitive">
      <Container>
        <SectionHeader num={4} title="Competitive Analysis" subtitle="Four existing games. One clear gap." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
          {games.map(({ title, org, pros, cons, fit }) => (
            <Card key={title}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: V2.ink }}>{title}</div>
                  <div style={{ fontSize: 13, color: V2.muted, marginTop: 2 }}>{org}</div>
                </div>
                <Tag color="gray">Ages {fit}</Tag>
              </div>
              {pros.map(p => (
                <div key={p} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: '#4a8a6a', fontWeight: 800, fontSize: 13, lineHeight: 1.5 }}>+</span>
                  <span style={{ fontSize: 13, color: '#444', lineHeight: 1.55 }}>{p}</span>
                </div>
              ))}
              <div style={{ height: 1, background: V2.border, margin: '10px 0' }} />
              {cons.map(c => (
                <div key={c} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: V2.warn, fontWeight: 800, fontSize: 13, lineHeight: 1.5 }}>−</span>
                  <span style={{ fontSize: 13, color: V2.muted, lineHeight: 1.55 }}>{c}</span>
                </div>
              ))}
            </Card>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Card style={{ background: V2.accentBg, boxShadow: 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4a6aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Who Was Served</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: V2.ink, margin: 0 }}>K–6 students were well-covered. Older students and adults were underserved — Financial Freedom was the only game with appropriate complexity, but account requirements limited reach.</p>
          </Card>
          <Card style={{ background: V2.dark, boxShadow: 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: V2.accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>The Opportunity</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,253,0.75)', margin: 0 }}>A game for elementary-to-middle school users balancing tight interactive learning with short engaging loops — freely accessible, no account required.</p>
          </Card>
        </div>
      </Container>
    </SectionWrap>
  );
};

const StakeholderSection = () => (
  <SectionWrap id="stakeholders" style={{ background: V2.white }}>
    <Container>
      <SectionHeader num={5} title="Stakeholder Interviews" subtitle="Three organizations. Three perspectives that shaped our direction." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 40 }}>
        {[
          { name: 'Ron Kagan', org: 'PlanetFlip — Founder', method: 'Zoom',
            insights: ['Past teams designed concepts but never implemented them', 'Community engagement and scalability were top priorities'] },
          { name: 'A-Bel Gong', org: 'SD Climate Collaborative', method: 'In-person',
            insights: ['Workplaces increasingly need sustainability training', 'Surfaced a workplace use case beyond our K–12 focus'] },
          { name: 'NPS Staff', org: 'National Park Service', method: 'In-person',
            insights: ['Local orgs need accessible engagement tools', 'Validated public institution use case'] },
        ].map(({ name, org, method, insights }) => (
          <Card key={name}>
            <div style={{ width: 40, height: 40, background: V2.accentBg, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="4" fill={V2.accent}/>
                <path d="M2 17c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={V2.accent} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: 13, color: V2.muted, marginBottom: 10 }}>{org}</div>
            <Tag color="gray">{method}</Tag>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: V2.accent, fontWeight: 700, fontSize: 13, lineHeight: 1.5, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, lineHeight: 1.6, color: '#555' }}>{ins}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: V2.ink }}>Concept Feedback — Capture Grid</div>
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Category', 'What Stakeholders Said'].map(h => (
                <th key={h} style={{ background: V2.accentBg, color: '#4a6aaa', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 16px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['green', 'Liked',     'Life-sim aesthetic, real-world integration. "Cozy" feel similar to Animal Crossing and Stardew Valley.'],
              ['amber', 'Wished',    'More critical thinking, community-building, and customization options.'],
              ['gray',  'Questions', 'Multiple paths? Consequences for wrong choices? Single sustainability theme?'],
              ['blue',  'Ideas',     'Character customization, virtual pets, community gardening, water conservation, clothing recycling.'],
            ].map(([color, cat, what]) => (
              <tr key={cat}>
                <td style={{ width: 100, padding: '11px 16px', borderBottom: `1px solid ${V2.border}` }}><Tag color={color}>{cat}</Tag></td>
                <td style={{ fontSize: 14, lineHeight: 1.7, padding: '11px 16px', borderBottom: `1px solid ${V2.border}`, color: '#444' }}>{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  </SectionWrap>
);

const ConceptSelectionSection = () => (
  <SectionWrap id="concept">
    <Container>
      <SectionHeader num={6} title="Choosing a Concept" subtitle="Four ideas. One weighted decision matrix. One winner — for the right reasons." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 36 }}>
        {[
          { name: 'Ocean Cleanup Quest', desc: 'Navigate a submarine removing trash from ocean reefs', winner: false },
          { name: 'Waste Management Sim', desc: 'Life-sim: manage resources and minimize waste across a town', winner: false },
          { name: 'Energy Ave', desc: 'Conserve energy in a virtual home by finding and fixing energy-wasting behaviors room by room', winner: true },
          { name: 'Trash Dash', desc: '60-second timed sorting game: categorize waste for a high score', winner: false },
        ].map(({ name, desc, winner }) => (
          <div key={name} style={{
            background: winner ? V2.dark : V2.white,
            borderRadius: 18, padding: '24px 20px',
            boxShadow: winner ? `0 12px 40px rgba(42,43,42,0.18)` : '0 2px 12px rgba(42,43,42,0.06)',
            position: 'relative',
          }}>
            {winner && (
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: V2.accent, color: V2.dark, borderRadius: 100, padding: '3px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Selected ✓
              </div>
            )}
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: winner ? V2.bg : V2.ink }}>{name}</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: winner ? 'rgba(255,255,253,0.6)' : V2.muted }}>{desc}</div>
          </div>
        ))}
      </div>

      <QuoteBlock
        text="Trash Dash scored higher on feasibility, but stakeholder feedback consistently favored the life-sim approach. Energy Ave was the most balanced choice across every dimension that mattered."
        author="Team Rationale"
      />
    </Container>
  </SectionWrap>
);

Object.assign(window, { CompetitiveAnalysisSection, StakeholderSection, ConceptSelectionSection });
