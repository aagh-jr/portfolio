// ea-sections-3.jsx — Round 1 Formative Testing, Round 2 Summative Testing

const Round1Section = () => (
  <SectionWrap id="round1" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={7} title="Round 1 — Formative Testing" subtitle="Affordance test + cognitive walkthrough. Before a single line of code was written." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        <Card>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <MethodIcon type="usability" size={40} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Method</div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
                A two-part protocol: a <strong>clickability/affordance test</strong> (what do users think is interactive?) and a <strong>cognitive walkthrough</strong> of static wireframe screens (can they reconstruct the game's logic without guidance?).
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Why At Wireframe Stage</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Identifying affordance problems before development is significantly cheaper than discovering them post-build. This stage let us validate the core interaction model without committing engineering time.
          </p>
        </Card>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Participants</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 44 }}>
        {[
          { name: 'Cody Trinh', age: 21, bg: 'UCSD 4th Year, Human Biology', gaming: 'Experienced gamer', note: null },
          { name: 'Paul Manchala', age: 21, bg: 'UCSD 4th Year, Aerospace Engineering', gaming: 'Casual gamer', note: null },
          { name: 'Preesha Shah', age: 13, bg: '8th Grader', gaming: 'Casual gamer', note: 'Closest to target demographic' },
        ].map(({ name, age, bg, gaming, note }) => (
          <Card key={name} style={{ padding: '20px 22px' }}>
            {note && <div style={{ background: '#EBF7F2', color: '#2A8A5C', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700, display: 'inline-block', marginBottom: 12 }}>{note}</div>}
            <div style={{ fontSize: 15, fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 13, color: '#888', margin: '4px 0 10px' }}>Age {age} · {bg}</div>
            <Tag color="gray">{gaming}</Tag>
          </Card>
        ))}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Part 1 — Affordance Test Results</h3>
      <p style={{ fontSize: 14, color: '#777', marginBottom: 20, lineHeight: 1.6 }}>Participants circled every element they believed was interactive. Coded as hit, miss, or false positive.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>🛏</span> Bedroom
          </div>
          <table>
            <thead><tr><th>Element</th><th>Interactive?</th><th>Cody</th><th>Paul</th></tr></thead>
            <tbody>
              {[
                ['PC / Laptop', true, 'hit', 'hit'],
                ['Lamp', true, 'hit', 'hit'],
                ['Light switch', true, 'hit', 'hit'],
                ['Thermostat', true, 'miss', 'hit'],
                ['Window', true, 'miss', 'miss'],
                ['Bed', false, 'fp', 'fp'],
              ].map(([el, inter, cody, paul]) => (
                <tr key={el}>
                  <td style={{ fontSize: 13 }}>{el}</td>
                  <td style={{ fontSize: 12 }}>{inter ? <Tag color="green">Yes</Tag> : <Tag color="gray">No</Tag>}</td>
                  <td><HitMiss v={cody} /></td>
                  <td><HitMiss v={paul} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>🚿</span> Bathroom
          </div>
          <table>
            <thead><tr><th>Element</th><th>Interactive?</th><th>Cody</th><th>Paul</th></tr></thead>
            <tbody>
              {[
                ['Blow dryer', true, 'hit', 'hit'],
                ['Light switch', true, 'hit', 'hit'],
                ['Outlet', true, 'hit', 'hit'],
                ['Shower faucet', true, 'hit', null],
                ['Sink', true, 'miss', 'hit'],
                ['Toilet', false, 'fp', null],
              ].map(([el, inter, cody, paul]) => (
                <tr key={el}>
                  <td style={{ fontSize: 13 }}>{el}</td>
                  <td style={{ fontSize: 12 }}>{inter ? <Tag color="green">Yes</Tag> : <Tag color="gray">No</Tag>}</td>
                  <td><HitMiss v={cody} /></td>
                  <td><HitMiss v={paul} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Part 2 — Cognitive Walkthrough</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        {[
          { name: 'Cody', summary: 'Quickly reconstructed the game\'s logic. Could articulate what triggered each screen transition without prompting.' },
          { name: 'Paul', summary: '"Aha moment" — initially flagged the bed as interactive, then self-corrected: only electricity-conducting items should be clickable. This unprompted correction validated the game\'s internal logic.' },
          { name: 'Preesha', summary: 'Perceived the game as a "storyline progression through a household." Correctly predicted clicking items would trigger pop-ups. Called it "super cute" — praised the 8-bit aesthetics specifically.' },
        ].map(({ name, summary }) => (
          <Card key={name} style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{name}</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: '#555' }}>{summary}</div>
          </Card>
        ))}
      </div>

      <div style={{ background: '#FDF0E6', borderRadius: 20, padding: '28px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#E07D2E', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 16 }}>Key Fixes Flagged</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            'Increase visual affordance for thermostat & window — add glow, animation, or visual cue',
            'Reduce visual weight of the bed — consistently selected as interactive despite being passive',
            'Fix energy bar update logic (Preesha flagged it was not updating correctly)',
            'Implement the timer — pause button appeared non-functional to participants',
          ].map((fix, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: '#E07D2E', fontWeight: 800, flexShrink: 0, lineHeight: 1.5 }}>!</span>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 44 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Method</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>Participants played the fully functional game, then completed a 7-question post-task attitudinal survey. Behavioral observation was combined with self-reported experience data.</p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Why This Method</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>Observation tells us what users <em>do</em>. Survey tells us how they <em>feel</em>. Both matter for a product whose success depends on voluntary, intrinsically motivated engagement.</p>
        </Card>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Participants (n=7)</h3>
      <Card style={{ marginBottom: 40 }}>
        <table>
          <thead><tr><th>Participant</th><th>Background</th><th>Gaming Experience</th></tr></thead>
          <tbody>
            {[
              ['Ron Kagan','PlanetFlip Founder','—'],
              ['Navaeh Gutierrez','UCSD 4th Year, Biochemistry','Little to none'],
              ['Litzy Perea','UCSD, Linguistics & Cognition','Little'],
              ['Holda Ashmina','UCSD, Psychology','Little'],
              ['Amina','UCSD, Cognitive Science','Average'],
              ['Daniel','UCSD, Computer Science','Above average'],
              ['Alessandra','UCSD, Pre-Dental','Above average'],
            ].map(([name, bg, gaming]) => (
              <tr key={name}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{name}</td>
                <td style={{ fontSize: 13, color: '#666' }}>{bg}</td>
                <td style={{ fontSize: 13 }}><Tag color="gray">{gaming}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Results vs. Success Metrics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 44 }}>
        <Stat value="90%" label="Task Success Rate" sub="Target: 85%" accent="#3DAA74" />
        <Stat value="80%" label="Knowledge Improvement" sub="Target: 75%" accent="#3DAA74" />
        <Stat value="12 min" label="Avg. Session Length" sub="Target: 10 min" accent="#3DAA74" />
        <Stat value="7/7" label="Said goal was clear" accent="#3DAA74" />
        <Stat value="7/7" label="Praised visuals & music" accent="#3DAA74" />
      </div>

      <Placeholder label="Survey results chart — Q1 through Q7 responses" height={200} note="Bar chart: 7 questions × 7 participants. Overlay target thresholds." />

      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '40px 0 20px' }}>Qualitative Themes</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { theme: 'Aesthetics & Atmosphere', color: '#3DAA74', label: '✓ Unanimous Positive', body: 'All seven participants praised the visual and audio design. Common descriptors: "cute," "chill," "relaxing," "immersive." Multiple made unprompted comparisons to early 2000s browser games (Barbie.com, girl2games) and indie titles. In a category of sterile educational software, this was a genuine differentiator.' },
          { theme: 'Challenge & Reward', color: '#E07D2E', label: '⚠ Primary Pain Point', body: 'The most consistent criticism: a lack of challenge. Interactable items were easy to spot; the game didn\'t push users. Ron Kagan noted it felt aimed at elementary schoolers. Not unanimous — Holda and Amina both reported genuine accomplishment — but the pattern was clear enough to require iteration.' },
          { theme: 'Point Visibility', color: '#E07D2E', label: '⚠ Actionable UX Gap', body: 'Kagan recommended earned points be displayed numerically and that items flash on click. Alessandra noted the energy bar on cards should reflect the cumulative value, not just points just added. The most specific and immediately actionable feedback from the entire round.' },
          { theme: 'Discoverability', color: '#E07D2E', label: '⚠ UI Gap', body: 'Kagan noted it was not immediately clear that the back button was what added points to the score — a discoverability issue that needed to be surfaced more explicitly in the interface.' },
        ].map(({ theme, color, label, body }) => (
          <Card key={theme} style={{ borderLeft: `4px solid ${color}`, padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
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
