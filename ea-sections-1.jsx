// ea-sections-1.jsx — Hero, Overview, Research Goals, Methodology

const HeroSection = () =>
<SectionWrap id="hero" style={{ padding: '120px 0 80px', borderTop: 'none' }}>
    <Container>
      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        <Tag color="green">UX Research</Tag>
        <Tag color="gray">Game Design</Tag>
        <Tag color="gray">UCSD ENG 100D · Winter 2025</Tag>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(52px, 8vw, 80px)', fontWeight: 500, lineHeight: 1.05,
        letterSpacing: '-0.03em', color: '#111', marginBottom: 24,
        fontFamily: 'Lora, Georgia, serif', maxWidth: 740,
      }}>
        Energy Ave.
      </h1>

      {/* Subtitle */}
      <p style={{ fontSize: 18, lineHeight: 1.75, color: '#777', maxWidth: 560, marginBottom: 56, fontWeight: 400 }}>
        Designing a gamified energy conservation experience for PlanetFlip — research-backed, fully playable, and built in 10 weeks.
      </p>

      {/* Metadata row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 0,
        width: 'fit-content', marginBottom: 64,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        {[['Role', 'Researcher & Designer'], ['Team', '8 People'], ['Duration', '10 Weeks'], ['Client', 'PlanetFlip']].map(([l, v], i) =>
          <div key={l} style={{
            padding: '16px 32px 16px', paddingLeft: i === 0 ? 0 : 32,
            borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{v}</div>
          </div>
        )}
      </div>

      <Placeholder label="Hero screenshot — Energy Ave gameplay" height={480} note="Drop game screenshot / screen recording here — bedroom or bathroom scene" />
    </Container>
  </SectionWrap>;


const OverviewSection = () =>
<SectionWrap id="overview" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={1} title="The Problem" subtitle="The gap between awareness and action is climate's hardest challenge." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Challenge</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            Most sustainability education prioritizes information delivery over interactive engagement. People — especially younger users — already <em>know</em> energy conservation matters. What they lack is an accessible, engaging tool that turns awareness into habit-forming behavior.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Our Approach</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            PlanetFlip had existing game concepts that hadn't been implemented or validated. Our team designed a fully playable, research-backed game from scratch: educationally grounded, immediately usable without instruction, and engaging enough to sustain attention.
          </p>
        </Card>
      </div>
      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px', marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>RESEARCH QUESTION</div>
        <p style={{ fontSize: 21, lineHeight: 1.6, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760 }}>
          "How might we design a gamified experience that teaches energy conservation in a way that is engaging enough to complete, intuitive enough to use without instruction, and meaningful enough that players connect gameplay to real life?"
        </p>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 18, color: '#141414' }}>What is Energy Ave?</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {[
      ['Room by Room', 'Players navigate a virtual home — bedroom, bathroom, kitchen — clicking on items in each space.', '#EBF7F2', '#2A8A5C'],
      ['Spot & Fix', 'Tap household appliances and electronics to identify and correct energy-wasting behaviors.', '#FAF7F2', '#666'],
      ['Learn & Earn', 'Each interaction triggers a real-world energy fact card. Earn points, fill the meter, unlock the next room.', '#FDF0E6', '#B85C0D']].
      map(([title, desc, bg, accent]) =>
      <div key={title} style={{ background: bg, borderRadius: 18, padding: '24px 22px', border: `1.5px solid ${accent}22` }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: accent }}>{title}</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.65 }}>{desc}</div>
          </div>
      )}
      </div>
    </Container>
  </SectionWrap>;


const ResearchGoalsSection = () =>
<SectionWrap id="goals">
    <Container>
      <SectionHeader num={2} title="Research Goals & Questions" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: '#141414' }}>Research Goals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
          'Understand what makes existing sustainability games succeed or fail at engaging users',
          'Identify which concept best balances educational impact, usability, feasibility, and engagement',
          'Validate whether the interaction model is intuitive without explicit instruction',
          'Evaluate whether the game teaches, engages, and motivates real-world behavior change'].
          map((g, i) =>
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 26, height: 26, background: '#EBF7F2', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#3DAA74', marginTop: 1 }}>{i + 1}</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: 0 }}>{g}</p>
              </div>
          )}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: '#141414' }}>Research Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
          'What patterns in existing sustainability games drive or kill engagement?',
          'Which concept best meets the needs of our target users and client?',
          'Can users understand how to play without a tutorial?',
          'Does the game motivate players to apply energy-saving habits in real life?'].
          map((q, i) =>
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>RQ{i + 1}</div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#333', margin: 0 }}>{q}</p>
              </div>
          )}
          </div>
        </div>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: '#141414' }}>Success Metrics — Defined Upfront</h3>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Metric</th><th>Method</th><th>Target</th></tr>
            </thead>
            <tbody>
              {[
            ['User Engagement', 'Session Timing', '≥ 10 min/session'],
            ['Task Success Rate', 'Usability Testing', '≥ 85%'],
            ['Knowledge Improvement', 'Pre/Post Survey', '≥ 75% of users improve'],
            ['Development Feasibility', 'Timeline Tracking', '≤ 3 months'],
            ['Device Accessibility', 'Technical Testing', 'Mobile & desktop supported']].
            map(([m, method, t]) =>
            <tr key={m}>
                  <td style={{ fontWeight: 500, fontSize: 14 }}>{m}</td>
                  <td style={{ color: '#777', fontSize: 14 }}>{method}</td>
                  <td><Tag color="green">{t}</Tag></td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  </SectionWrap>;


const MethodologySection = () =>
<SectionWrap id="methodology" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={3} title="Methodology" subtitle="A mixed-methods approach across four research phases — behavioral and attitudinal." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
      { icon: 'competitive', phase: '01', label: 'Competitive Analysis', desc: 'Audited 4 gamified sustainability tools to map the landscape and identify the gap' },
      { icon: 'interview', phase: '02', label: 'Stakeholder Interviews', desc: 'PlanetFlip, SD Climate Collaborative & Cabrillo NPS — 3 orgs, 3 perspectives' },
      { icon: 'usability', phase: '03', label: 'Formative Testing', desc: 'Affordance test + cognitive walkthrough on static wireframes before any code was written' },
      { icon: 'survey', phase: '04', label: 'Summative Testing', desc: 'Full gameplay observation + 7-question post-task attitudinal survey' }].
      map(({ icon, phase, label, desc }) =>
      <Card key={phase} style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <MethodIcon type={icon} size={44} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 7 }}>{phase}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#141414' }}>{label}</div>
            <div style={{ fontSize: 13, color: '#777', lineHeight: 1.6 }}>{desc}</div>
          </Card>
      )}
      </div>
      <Placeholder label="Research timeline / process diagram" height={160} note="Visual flow: Competitive Analysis → Stakeholder Interviews → Concept Selection → Formative Testing (R1) → Build → Summative Testing (R2) → Ship" />
    </Container>
  </SectionWrap>;


Object.assign(window, { HeroSection, OverviewSection, ResearchGoalsSection, MethodologySection });