// ea-sections-3-v2.jsx — Round 1 Formative Testing, Round 2 Summative Testing

const Round1Section = () => (
  <SectionWrap id="round1" style={{ background: V2.white }}>
    <Container>
      <SectionHeader num={7} title="Round 1 — Formative Testing" subtitle="Affordance test + cognitive walkthrough — before a single line of code was written." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a6aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Method</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            A <strong>clickability/affordance test</strong> (what looks interactive?) plus a <strong>cognitive walkthrough</strong> of static wireframes (can users reconstruct the logic unaided?).
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a6aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Why At Wireframe Stage</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Catching affordance problems pre-build is far cheaper than post-build. We validated the core interaction model before committing engineering time.
          </p>
        </Card>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: V2.ink }}>Participants</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
        {[
          { name: 'Cody Trinh',    age: 21, bg: 'UCSD 4th Year, Human Biology',          gaming: 'Experienced gamer', note: null },
          { name: 'Paul Manchala', age: 21, bg: 'UCSD 4th Year, Aerospace Engineering',  gaming: 'Casual gamer',      note: null },
          { name: 'Preesha Shah',  age: 13, bg: '8th Grader',                             gaming: 'Casual gamer',      note: 'Closest to target demographic' },
        ].map(({ name, age, bg, gaming, note }) => (
          <Card key={name} style={{ padding: '20px 22px' }}>
            {note && <div style={{ background: V2.accentBg, color: '#4a6aaa', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700, display: 'inline-block', marginBottom: 12 }}>{note}</div>}
            <div style={{ fontSize: 15, fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 13, color: V2.muted, margin: '4px 0 10px' }}>Age {age} · {bg}</div>
            <Tag color="gray">{gaming}</Tag>
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: V2.ink }}>Part 1 — Affordance Test Results</div>
      <p style={{ fontSize: 14, color: V2.muted, marginBottom: 18, lineHeight: 1.6 }}>Participants circled elements they believed were interactive. Coded as hit, miss, or false positive.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
        {[
          { room: '🛏 Bedroom', rows: [
            ['PC / Laptop',  true,  'hit',  'hit'],
            ['Lamp',         true,  'hit',  'hit'],
            ['Light switch', true,  'hit',  'hit'],
            ['Thermostat',   true,  'miss', 'hit'],
            ['Window',       true,  'miss', 'miss'],
            ['Bed',          false, 'fp',   'fp'],
          ]},
          { room: '🚿 Bathroom', rows: [
            ['Blow dryer',   true,  'hit',  'hit'],
            ['Light switch', true,  'hit',  'hit'],
            ['Outlet',       true,  'hit',  'hit'],
            ['Shower faucet',true,  'hit',  null],
            ['Sink',         true,  'miss', 'hit'],
            ['Toilet',       false, 'fp',   null],
          ]},
        ].map(({ room, rows }) => (
          <Card key={room}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{room}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Element', 'Interactive?', 'Cody', 'Paul'].map(h => (
                    <th key={h} style={{ background: V2.accentBg, color: '#4a6aaa', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 10px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([el, inter, cody, paul]) => (
                  <tr key={el}>
                    <td style={{ fontSize: 13, padding: '8px 10px', borderBottom: `1px solid ${V2.border}` }}>{el}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${V2.border}` }}>{inter ? <Tag color="green">Yes</Tag> : <Tag color="gray">No</Tag>}</td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${V2.border}` }}><HitMiss v={cody} /></td>
                    <td style={{ padding: '8px 10px', borderBottom: `1px solid ${V2.border}` }}><HitMiss v={paul} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: V2.ink }}>Part 2 — Cognitive Walkthrough</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { name: 'Cody',    summary: 'Quickly reconstructed game logic. Could articulate what triggered each screen transition without prompting.' },
          { name: 'Paul',    summary: '"Aha moment" — initially flagged the bed as interactive, then self-corrected: only electricity-conducting items should be clickable. Validated the game\'s internal logic.' },
          { name: 'Preesha', summary: 'Perceived it as a "storyline through a household." Correctly predicted pop-ups on click. Called it "super cute" — specifically praised the 8-bit aesthetics.' },
        ].map(({ name, summary }) => (
          <Card key={name} style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{name}</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: '#555' }}>{summary}</div>
          </Card>
        ))}
      </div>

      <div style={{ background: V2.warnBg, borderRadius: 18, padding: '24px 28px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: V2.warn, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Key Fixes Flagged</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            'Increase visual affordance for thermostat & window — add glow or animation cue',
            'Reduce visual weight of the bed — consistently selected as interactive despite being passive',
            'Fix energy bar update logic (Preesha flagged it was not updating correctly)',
            'Implement the timer — pause button appeared non-functional to participants',
          ].map((fix, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: V2.warn, fontWeight: 800, flexShrink: 0, lineHeight: 1.5 }}>!</span>
              <span style={{ fontSize: 14, lineHeight: 1.65, color: '#555' }}>{fix}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </SectionWrap>
);

const Round2Section = () => (
  <SectionWrap id="round2">
    <Container>
      <SectionHeader num={8} title="Round 2 — Summative Testing" subtitle="Full gameplay + post-task survey. Did the finished product meet our success metrics?" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a6aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Method</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>Participants played the full game, then took a 7-question post-task survey. Behavioral data + self-reported experience.</p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a6aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Why This Method</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>Observation shows what users <em>do</em>. Surveys show how they <em>feel</em>. For a voluntary, intrinsically motivated product, both matter.</p>
        </Card>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: V2.ink }}>Participants (n=7)</div>
      <Card style={{ marginBottom: 36 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Participant', 'Background', 'Gaming Experience'].map(h => (
                <th key={h} style={{ background: V2.accentBg, color: '#4a6aaa', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 14px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Ron Kagan',          'PlanetFlip Founder',               '—'],
              ['Navaeh Gutierrez',   'UCSD 4th Year, Biochemistry',      'Little to none'],
              ['Litzy Perea',        'UCSD, Linguistics & Cognition',    'Little'],
              ['Holda Ashmina',      'UCSD, Psychology',                 'Little'],
              ['Amina',              'UCSD, Cognitive Science',          'Average'],
              ['Daniel',             'UCSD, Computer Science',           'Above average'],
              ['Alessandra',         'UCSD, Pre-Dental',                 'Above average'],
            ].map(([name, bg, gaming]) => (
              <tr key={name}>
                <td style={{ fontWeight: 600, fontSize: 13, padding: '10px 14px', borderBottom: `1px solid ${V2.border}` }}>{name}</td>
                <td style={{ fontSize: 13, color: V2.muted, padding: '10px 14px', borderBottom: `1px solid ${V2.border}` }}>{bg}</td>
                <td style={{ padding: '10px 14px', borderBottom: `1px solid ${V2.border}` }}><Tag color="gray">{gaming}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: V2.ink }}>Results vs. Success Metrics</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
        <Stat value="90%" label="Task Success Rate" sub="Target: 85%" accent={V2.accent} />
        <Stat value="80%" label="Knowledge Improvement" sub="Target: 75%" accent={V2.accent} />
        <Stat value="100%" label="Said goal was clear" accent={V2.accent} />
        <Stat value="100%" label="Praised visuals & music" accent={V2.accent} />
        <div style={{ gridColumn: '1 / -1' }}>
          <Stat value="12 min" label="Avg. Session Length" sub="Target: 10 min" accent={V2.accent} />
        </div>
      </div>

      <Placeholder label="Survey results chart — Q1 through Q7 responses" height={180} note="Bar chart: 7 questions × 7 participants. Overlay target thresholds." />

      <div style={{ fontSize: 13, fontWeight: 600, margin: '36px 0 16px', color: V2.ink }}>Qualitative Themes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { theme: 'Aesthetics & Atmosphere', color: '#4a8a6a', label: '✓ Unanimous Positive',
            body: 'All seven praised the visuals and audio. Descriptors: "cute," "chill," "relaxing," "immersive." Unprompted comparisons to early-2000s browser games and indie titles — a real differentiator in a sterile category.' },
          { theme: 'Challenge & Reward', color: V2.warn, label: '⚠ Primary Pain Point',
            body: 'The clearest criticism: lack of challenge. Interactables were too easy to spot; Ron Kagan noted it felt aimed at elementary schoolers. The pattern was strong enough to require iteration.' },
          { theme: 'Point Visibility', color: V2.warn, label: '⚠ Actionable UX Gap',
            body: 'Kagan flagged that points should be numerically visible and items should flash on click. Alessandra noted the energy bar should reflect cumulative value. The most actionable feedback of the round.' },
          { theme: 'Discoverability', color: V2.warn, label: '⚠ UI Gap',
            body: 'Not immediately clear the back button was what added points to the score — needed explicit UI surfacing.' },
        ].map(({ theme, color, label, body }) => (
          <Card key={theme} style={{ borderLeft: `4px solid ${color}`, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{theme}</span>
              <span style={{ background: color + '18', color, borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>{label}</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#555', margin: 0 }}>{body}</p>
          </Card>
        ))}
      </div>
    </Container>
  </SectionWrap>
);

Object.assign(window, { Round1Section, Round2Section });
