// ea-sections-2.jsx — Competitive Analysis, Stakeholder Interviews, Concept Selection

const CompetitiveAnalysisSection = () => {
  const games = [
    { title: 'Space Waste Odyssey', org: 'PBS Kids', fit: 'K–6',
      pros: ['Closed captioning', 'Multi-level progression', 'High-quality visuals'],
      cons: ['Levels too long', 'No penalties for inaction', 'No time constraints → low urgency'] },
    { title: 'Become an Energy Champion', org: 'National Energy Foundation', fit: 'K–8',
      pros: ['Good educational content', 'Character customization'],
      cons: ['Highly repetitive mini-games', 'Hard to navigate', 'No accessibility features'] },
    { title: 'Fidget Power', org: 'PBS Kids / Design Squad', fit: 'K–6',
      pros: ['Strong loading screen', 'Location-based mini-games'],
      cons: ['Repetitive tasks', 'Thin sustainability info', 'Nothing to do after completion'] },
    { title: 'Financial Freedom', org: 'Legends of Learning', fit: '6–12',
      pros: ['Unique marine sustainability topic', 'Avatar customization', 'Penalizes unsustainable choices'],
      cons: ['Requires account to access', 'Slow pacing', 'May be too complex for younger users'] },
  ];

  return (
    <SectionWrap id="competitive">
      <Container>
        <SectionHeader num={4} title="Competitive Analysis" subtitle="Four existing games. One clear gap." />
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 40 }}>
          <MethodIcon type="competitive" size={40} />
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#555', maxWidth: 700, paddingTop: 6 }}>
            Before generating concepts, we audited four gamified sustainability tools. The central pattern: a failure to balance information with engagement. Games that led with educational content lost players to boredom. Games that prioritized fun offered little learning transfer. None had cracked the balance.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
          {games.map(({ title, org, pros, cons, fit }) => (
            <Card key={title}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#141414' }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>{org}</div>
                </div>
                <Tag color="gray">Ages {fit}</Tag>
              </div>
              {pros.map(p => (
                <div key={p} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: '#3DAA74', fontWeight: 800, fontSize: 14, lineHeight: 1.5 }}>+</span>
                  <span style={{ fontSize: 13, color: '#444', lineHeight: 1.55 }}>{p}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '12px 0' }} />
              {cons.map(c => (
                <div key={c} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: '#E07D2E', fontWeight: 800, fontSize: 14, lineHeight: 1.5 }}>−</span>
                  <span style={{ fontSize: 13, color: '#888', lineHeight: 1.55 }}>{c}</span>
                </div>
              ))}
            </Card>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card style={{ background: '#EBF7F2', boxShadow: 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 10 }}>Who Was Served</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#333', margin: 0 }}>K–6 students were well-covered by PBS titles. Older students and adults were underserved — Financial Freedom was the only game with appropriate complexity, but its account requirement limited reach.</p>
          </Card>
          <Card style={{ background: '#141414', boxShadow: 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 10 }}>The Opportunity</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.75)', margin: 0 }}>A game targeting elementary-to-middle school users, balancing tight interactive learning moments with short engaging loops — freely accessible, no account required.</p>
          </Card>
        </div>
      </Container>
    </SectionWrap>
  );
};

const StakeholderSection = () => (
  <SectionWrap id="stakeholders" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={5} title="Stakeholder Interviews" subtitle="Three organizations. Three perspectives that shaped our direction." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 48 }}>
        {[
          { name: 'Ron Kagan', org: 'PlanetFlip — Founder', method: 'Zoom interview',
            insights: ['Past student teams designed concepts but never implemented them in Construct3', 'Community engagement and scalability were top priorities'] },
          { name: 'A-Bel Gong', org: 'SD Climate Collaborative', method: 'In-person interview',
            insights: ['More workplaces are creating sustainability manager roles with no training', 'Surfaced a workplace use case beyond our original K–12 focus'] },
          { name: 'NPS Staff', org: 'National Park Service', method: 'In-person interview',
            insights: ['Local orgs need accessible engagement tools for community outreach', 'Validated public institution use case for the platform'] },
        ].map(({ name, org, method, insights }) => (
          <Card key={name}>
            <div style={{ width: 42, height: 42, background: '#EBF7F2', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="4" fill="#3DAA74"/>
                <path d="M2 17c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#3DAA74" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>{org}</div>
            <Tag color="gray">{method}</Tag>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#3DAA74', fontWeight: 700, fontSize: 14, lineHeight: 1.5, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, lineHeight: 1.6, color: '#555' }}>{ins}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Concept Feedback — Capture Grid</h3>
      <Card>
        <table>
          <thead><tr><th>Category</th><th>What Stakeholders Said</th></tr></thead>
          <tbody>
            {[
              ['green','Liked','Life-sim aesthetic and real-world integration. Level-up/setting switch to prevent repetition. "Cozy" feel similar to Animal Crossing and Stardew Valley.'],
              ['amber','Wished','More critical thinking opportunities. Community-building features. More customization options.'],
              ['gray','Questions','Does the game have multiple paths? Are there consequences for wrong choices? Will it stick to one sustainability theme?'],
              ['blue','Ideas','Character customization, virtual pets, step-by-step gameplay. Community gardening, water conservation, clothing recycling as expanded topics.'],
            ].map(([color, cat, what]) => (
              <tr key={cat}>
                <td style={{ width: 100 }}><Tag color={color}>{cat}</Tag></td>
                <td style={{ fontSize: 14, lineHeight: 1.7 }}>{what}</td>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 40 }}>
        {[
          { name: 'Ocean Cleanup Quest', desc: 'Navigate a submarine removing trash from ocean reefs, collecting marine pollution cards', winner: false },
          { name: 'Waste Management Sim', desc: 'Life-sim: manage resources and minimize waste across a town map', winner: false },
          { name: 'Energy Ave', desc: 'Conserve energy in a virtual home by identifying and correcting energy-wasting behaviors room by room', winner: true },
          { name: 'Trash Dash', desc: '60-second timed sorting game: categorize waste items for a high score', winner: false },
        ].map(({ name, desc, winner }) => (
          <div key={name} style={{ background: winner ? '#141414' : '#fff', borderRadius: 20, padding: '28px 20px', boxShadow: winner ? '0 8px 32px rgba(0,0,0,0.15)' : '0 2px 16px rgba(0,0,0,0.06)', position: 'relative' }}>
            {winner && (
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#3DAA74', color: 'white', borderRadius: 100, padding: '3px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Selected ✓
              </div>
            )}
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: winner ? 'white' : '#141414' }}>{name}</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: winner ? 'rgba(255,255,255,0.65)' : '#888' }}>{desc}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Weighted Decision Matrix</h3>
      <Card style={{ marginBottom: 28 }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Criteria</th><th>Weight</th><th>Energy Ave</th><th>Ocean Cleanup</th><th>Waste Mgmt</th><th>Trash Dash</th></tr>
            </thead>
            <tbody>
              {[
                ['Functionality',3,0,0,0,0],
                ['Usability',4,0,0,-1,0],
                ['Desirability',2,0,-1,0,-1],
                ['Feasibility',4,0,-1,0,1],
                ['Ecological Sustainability',1,0,0,1,-1],
              ].map(([c,w,...vals]) => (
                <tr key={c}>
                  <td style={{ fontWeight: 500, fontSize: 14 }}>{c}</td>
                  <td style={{ color: '#888', fontSize: 14 }}>{w}</td>
                  {vals.map((v,i) => (
                    <td key={i} style={{ color: v > 0 ? '#3DAA74' : v < 0 ? '#E07D2E' : '#999', fontWeight: v !== 0 ? 700 : 400, fontSize: 14 }}>
                      {v > 0 ? `+${v}` : v === 0 ? '0' : v}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan="2" style={{ fontWeight: 700, fontSize: 14 }}>Weighted Total</td>
                <td style={{ color: '#3DAA74', fontWeight: 700 }}>0</td>
                <td style={{ color: '#E07D2E', fontWeight: 700 }}>−6</td>
                <td style={{ color: '#E07D2E', fontWeight: 700 }}>−3</td>
                <td style={{ color: '#3DAA74', fontWeight: 700 }}>+1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      <QuoteBlock
        text="Trash Dash scored higher on feasibility, but stakeholder feedback consistently favored the life-sim approach. Immersive household environments create better real-world behavioral transfer than timed sorting games. Energy Ave was the most balanced choice across every dimension that mattered to our client and target users."
        author="Team Rationale"
      />
    </Container>
  </SectionWrap>
);

Object.assign(window, { CompetitiveAnalysisSection, StakeholderSection, ConceptSelectionSection });
