// ld-sections.jsx — UCSD Laundry App case study sections

const LDHeroSection = () =>
<SectionWrap id="hero" style={{ padding: '120px 0 80px' }}>
    <Container noBorder>
      <h1 style={{
        fontSize: 'clamp(52px, 8vw, 80px)', fontWeight: 500, lineHeight: 1.05,
        letterSpacing: '-0.03em', color: '#111', marginBottom: 16,
        fontFamily: 'Lora, Georgia, serif', maxWidth: 740,
      }}>
        UCSD Laundry App.
      </h1>

      <div style={{ fontSize: 13, color: '#aaa', fontWeight: 500, letterSpacing: '0.01em', marginBottom: 32, whiteSpace: 'nowrap' }}>
        UX Design &nbsp;·&nbsp; Participatory Design &nbsp;·&nbsp; Community Tools &nbsp;·&nbsp; Campus
      </div>

      <p style={{ fontSize: 18, lineHeight: 1.75, color: '#777', maxWidth: 580, marginBottom: 56, fontWeight: 400 }}>
        Designing a campus laundry app through the lens of participatory design — where the question isn't just "what's usable" but "who does this serve, and at whose expense?"
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 0,
        width: 'fit-content', marginBottom: 64,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        {[['Role', 'Designer'], ['Course', 'COMM 124A'], ['Team', '6 People'], ['Output', 'Lo-Fi → Hi-Fi Figma']].map(([l, v], i) =>
          <div key={l} style={{
            padding: '16px 32px 16px', paddingLeft: i === 0 ? 0 : 32,
            borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{v}</div>
          </div>
        )}
      </div>

      <Placeholder label="Hero screenshot — Laundry app hi-fi home screen" height={480} note="Drop a key Figma frame here — machine status view or the home dashboard" />
    </Container>
  </SectionWrap>;


const LDOverviewSection = () =>
<SectionWrap id="overview" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={1} title="The Context" subtitle="UCSD laundry rooms have visibility, accountability, and lost-and-found problems that students live with daily." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Problem Space</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            On-campus laundry rooms are shared spaces. There's no real-time visibility into machine availability, no system for reporting broken machines, and a chronic lost-and-found problem. Students work around all of this with timing guesses and informal messaging.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Course Frame</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            COMM 124A (Prof. Irani) reframes design as a political and participatory practice — not a neutral activity. The course pushes you to ask whose interests a system serves before asking how to improve it. That framing changed the whole project.
          </p>
        </Card>
      </div>
      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px', marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>DESIGN QUESTION</div>
        <p style={{ fontSize: 21, lineHeight: 1.6, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760 }}>
          "How do we redesign a shared utility space — laundry — in a way that addresses what students actually need, instead of just smoothing over the visible friction?"
        </p>
      </div>
    </Container>
  </SectionWrap>;


const LDRoleSection = () =>
<SectionWrap id="role">
    <Container>
      <SectionHeader num={2} title="My Role" subtitle="Primary designer on a 6-person team. Contributed to research where the lines blurred." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Design</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            <li>Lo-fi screen layouts and information architecture</li>
            <li>Hi-fi visual design and component decisions</li>
            <li>Feature flow design for lost-and-found and reporting</li>
            <li>Mood board contribution and visual tone alignment</li>
          </ul>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Research</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            <li>Helped shape interview questions</li>
            <li>Participated in user interviews and synthesis</li>
            <li>Contributed to the laundry-space spatial brainstorm</li>
            <li>Translated research notes into feature priorities</li>
          </ul>
        </Card>
      </div>
    </Container>
  </SectionWrap>;


const LDResearchSection = () =>
<SectionWrap id="research" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={3} title="Research Phase" subtitle="Interviews, observation, and a spatial brainstorm — before any wireframes." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { icon: 'interview', phase: '01', label: 'User Interviews', desc: 'Structured interviews with students about their current laundry behavior, pain points, and informal workarounds. [CONFIRM: total interview count]' },
          { icon: 'usability', phase: '02', label: 'Spatial Mapping', desc: "Bird's-eye-view sketches of the laundry room — how students actually move through the space and where friction shows up physically, not just in the app." },
          { icon: 'affinity', phase: '03', label: 'Synthesis', desc: 'Notes grouped into themes: visibility, accountability, lost-and-found, reporting. The themes drove which features made it into scope.' }
        ].map(({ icon, phase, label, desc }) =>
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

      <div style={{ background: '#FAFAF8', borderRadius: 16, padding: '24px 28px', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Why the spatial brainstorm mattered</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
          Laundry isn't a single-screen task — it's a room. Students walk in, scan for open machines, decide whether to wait, leave, come back, deal with a forgotten load. Mapping the physical space made it obvious that the most-needed information (machine availability) had to be the first thing the app showed. Everything else was secondary.
        </p>
      </div>
    </Container>
  </SectionWrap>;


const LDFeaturesSection = () =>
<SectionWrap id="features">
    <Container>
      <SectionHeader num={4} title="Features That Made the Cut" subtitle="What research surfaced as need, scoped against what the team could actually ship." />

      <Card style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Why it shipped</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, fontSize: 14 }}>Machine Availability</td>
              <td style={{ color: '#555', fontSize: 13, lineHeight: 1.65 }}>
                Showed up first in nearly every interview. The fundamental question students walk in asking: "is anything open?"
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, fontSize: 14 }}>Lost & Found</td>
              <td style={{ color: '#555', fontSize: 13, lineHeight: 1.65 }}>
                A persistent pain point with no current solution. We designed it as a photo-and-description reporting flow — quick to submit, browsable by anyone in the building.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, fontSize: 14 }}>Problem Reporting</td>
              <td style={{ color: '#555', fontSize: 13, lineHeight: 1.65 }}>
                A lightweight form for flagging broken machines. Routed to building staff so reports actually go somewhere instead of being submitted to a void.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, fontSize: 14, color: '#888' }}>Additional features</td>
              <td style={{ color: '#888', fontSize: 13, lineHeight: 1.65, fontStyle: 'italic' }}>
                [CONFIRM: a few more features made it in beyond the three above — pending detail]
              </td>
            </tr>
          </tbody>
        </table>
      </Card>

      <div style={{ marginTop: 28, padding: '22px 26px', background: '#FAFAF8', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>What we deferred</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
          Laundry scheduling, payment integration, and machine reservations all came up as ideas. None made it into scope — too complex for the timeline, and not validated by the research as actual student needs. Easier features got cut so the harder ones could be designed properly.
        </p>
      </div>
    </Container>
  </SectionWrap>;


const LDDesignSection = () =>
<SectionWrap id="design" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={5} title="Design Decisions" subtitle="Mood board first, lo-fi second, hi-fi last — and the discipline to not skip steps." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 36 }}>
        {[
          {
            title: 'Mood board before any screens',
            desc: 'The team built a mood board to land on a tone — campus utility, low visual noise, trustworthy. Not a polished consumer aesthetic. This filtered out a lot of bad design directions before we drew a single wireframe.'
          },
          {
            title: 'Machine availability as the home screen',
            desc: 'The first information a student needs when they walk in. Putting anything else as the default home would have been designing for the app, not for the user.'
          },
          {
            title: 'Lost & Found as photo-first',
            desc: "Submitting an item is faster with a photo than with text. We built the flow around 'snap, describe in two lines, submit' — under a minute."
          },
          {
            title: 'Reporting routes to a real recipient',
            desc: "Submissions had to feel like they went somewhere. We designed the flow around routing reports to building staff, with a status the user could check, so 'I reported it' didn't feel like 'I sent it into a void.'"
          }
        ].map((d, i) =>
          <Card key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 18, padding: '22px 26px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', letterSpacing: '0.12em', textTransform: 'uppercase', paddingTop: 4 }}>
              0{i + 1}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 6 }}>{d.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>{d.desc}</p>
            </div>
          </Card>
        )}
      </div>

      <Placeholder label="Lo-fi → hi-fi comparison frames" height={420} note="Side-by-side showing how a screen evolved — machine status, lost-and-found, or reporting flow" />
    </Container>
  </SectionWrap>;


const LDParticipatorySection = () =>
<SectionWrap id="participatory">
    <Container>
      <SectionHeader num={6} title="The Participatory Frame" subtitle="What COMM 124A's framing changed about how we approached the work." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Standard UX Frame</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            "Students need better information about machine availability." Treat it as a usability problem. Build a clearer interface. Ship.
          </p>
        </Card>
        <Card style={{ borderColor: 'rgba(61,170,116,0.4)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Participatory Frame</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            "Why does this information gap exist, and who benefits from leaving it unaddressed?" Treat it as a question of who owns the laundry experience and who's been left out. Then design.
          </p>
        </Card>
      </div>

      <div style={{ background: '#141414', borderRadius: 22, padding: '32px 36px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>WHAT IT CHANGED</div>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: 'white', margin: 0, maxWidth: 760, fontWeight: 300 }}>
          The participatory frame shifted scope upstream. We didn't just design a "better laundry app" — we asked which problems students living in shared housing actually carry, and let that decide the feature set. Lost-and-found and reporting made the cut because students were already absorbing those costs invisibly. The redesign surfaces those costs and gives them somewhere to go.
        </p>
      </div>
    </Container>
  </SectionWrap>;


const LDOutcomeSection = () =>
<SectionWrap id="outcome" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={7} title="Outcome & Reflection" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Outcome</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            A lo-fi and hi-fi Figma prototype covering the core feature set — machine availability, lost-and-found, problem reporting, and additional flows from research. Final prototype was presented to Prof. Irani as the team's COMM 124A capstone.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I'd Do Differently</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            The participatory framing came from the course, not from the team's instinct. I'd want to bring that lens into design work earlier — to interview not just users but the people who maintain the system, and let that shape what counts as a real problem worth solving.
          </p>
        </Card>
      </div>

      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>WHAT THIS TAUGHT ME</div>
        <p style={{ fontSize: 19, lineHeight: 1.65, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760, fontFamily: 'Lora, Georgia, serif' }}>
          A better app isn't always the answer. Sometimes the right design move is to surface a problem that the system was hiding. The instinct to ask "who benefits from this not existing yet" produces requirements a usability lens never would.
        </p>
      </div>
    </Container>
  </SectionWrap>;


Object.assign(window, {
  LDHeroSection, LDOverviewSection, LDRoleSection, LDResearchSection,
  LDFeaturesSection, LDDesignSection, LDParticipatorySection, LDOutcomeSection
});
