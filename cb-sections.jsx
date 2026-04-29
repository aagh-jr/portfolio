// cb-sections.jsx — Cabrillo National Monument case study sections

const CBHeroSection = () =>
<SectionWrap id="hero" style={{ padding: '120px 0 80px' }}>
    <Container noBorder>
      <h1 style={{
        fontSize: 'clamp(52px, 8vw, 80px)', fontWeight: 500, lineHeight: 1.05,
        letterSpacing: '-0.03em', color: '#111', marginBottom: 16,
        fontFamily: 'Lora, Georgia, serif', maxWidth: 740,
      }}>
        Cabrillo National Monument.
      </h1>

      <div style={{ fontSize: 13, color: '#aaa', fontWeight: 500, letterSpacing: '0.01em', marginBottom: 32, whiteSpace: 'nowrap' }}>
        Visual Design &nbsp;·&nbsp; Print &nbsp;·&nbsp; Public Engagement &nbsp;·&nbsp; National Park Service
      </div>

      <p style={{ fontSize: 18, lineHeight: 1.75, color: '#777', maxWidth: 580, marginBottom: 56, fontWeight: 400 }}>
        Two terms designing visitor-facing materials for a real National Monument — an activity booklet and explorer passport for Open Tower Day, plus an educational card game on California food webs.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 0,
        width: 'fit-content', marginBottom: 64,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        {[['Role', 'Design Intern'], ['Duration', '2 Terms'], ['Client', 'Cabrillo NM (NPS)'], ['Output', 'Printed Materials']].map(([l, v], i) =>
          <div key={l} style={{
            padding: '16px 32px 16px', paddingLeft: i === 0 ? 0 : 32,
            borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{v}</div>
          </div>
        )}
      </div>

      <Placeholder label="Hero image — printed materials at a live event" height={480} note="Drop a photo here: activity booklets fanned out, or kids using them at Open Tower Day, or the Eco-Web cards in play" />
    </Container>
  </SectionWrap>;


const CBOverviewSection = () =>
<SectionWrap id="overview" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={1} title="The Context" subtitle="Designing for visitors who don't know they're a user." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Setting</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            Cabrillo National Monument sits at the tip of Point Loma in San Diego — a National Park Service site with two distinct ecosystems (coastal scrub on the bluffs, an intertidal zone below) and a historic lighthouse. Visitors arrive across all ages and prior knowledge levels, often with limited time and no formal guide.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Brief</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            Across two terms I produced two distinct deliverables: a set of materials for Open Tower Day (a recurring public event at the lighthouse) and an educational card game (Eco-Web) covering the park's two ecosystems. Both had to engage a wide audience, work in print, and survive deployment without a facilitator on hand.
          </p>
        </Card>
      </div>
      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px', marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>DESIGN CHALLENGE</div>
        <p style={{ fontSize: 21, lineHeight: 1.6, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760 }}>
          "How do you make printed visitor materials that engage a 7-year-old and a 70-year-old, work without staff to explain them, and still feel worth keeping after the visit ends?"
        </p>
      </div>
    </Container>
  </SectionWrap>;


const CBRoleSection = () =>
<SectionWrap id="role">
    <Container>
      <SectionHeader num={2} title="My Role" subtitle="Solo on the design craft. Embedded in a team for coordination, feedback, and approval." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I Owned</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            <li>Concept and layout for both deliverables</li>
            <li>Illustration, typography, and visual system</li>
            <li>Print-ready file production</li>
            <li>Activity selection and content scoping</li>
          </ul>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I Coordinated</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            <li>Subject-matter review with NPS rangers and educators</li>
            <li>Stakeholder approval cycles before printing</li>
            <li>Alignment with park branding and tone guidelines</li>
            <li>Logistics around event timing and quantities</li>
          </ul>
        </Card>
      </div>
      <div style={{ marginTop: 28, fontSize: 13, color: '#888', lineHeight: 1.7, maxWidth: 720 }}>
        The work itself was solo, but it didn't happen in a vacuum. Designing for a federal agency means building in time for review, learning the institutional voice, and translating ranger feedback into design changes. Most of my craft decisions were filtered through that loop.
      </div>
    </Container>
  </SectionWrap>;


const CBOpenTowerSection = () =>
<SectionWrap id="opentower" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={3} title="Project 01 — Open Tower Day" subtitle="An activity booklet and Historical Explorer passport for a recurring event at the Old Point Loma Lighthouse." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Audience</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Open Tower Day brings the public into the lighthouse for a one-day event. Visitors range widely in age and prior knowledge. Materials had to work for a 7-year-old completing a bingo card and a 70-year-old paging through park history.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Constraints</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Print only — no app, no QR, no facilitator. Files had to ship before the event and there'd be no patching them after. Distribution had to work at-scale: hand it to a visitor, walk away.
          </p>
        </Card>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: '#141414' }}>Two formats, two audiences</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>Activity Booklet (single page)</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#555', margin: '0 0 12px' }}>
            Designed for kids and family groups. A completion-arc structure (finish the booklet, win a prize) gives visitors a reason to stay engaged across the whole event.
          </p>
          <div style={{ fontSize: 12, color: '#888', lineHeight: 1.7 }}>
            Activities: word hunt, drawing prompt (Old Point Loma Lighthouse), stamp collection (Old + New lighthouses), staff fact interview, event participation, and a bingo card with park-specific items (Sea Dahlia, Shaw's Agave, Cabrillo Statue, CA Towhee).
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>Historical Explorer Passport (multi-page)</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#555', margin: '0 0 12px' }}>
            Designed as a collectible — something a visitor takes home and keeps. Mirrors the format of real National Park passports, with stamp pages for "Lighthouse Explorer" and "Historical Explorer" branches.
          </p>
          <div style={{ fontSize: 12, color: '#888', lineHeight: 1.7 }}>
            Multi-page format gives older visitors and history-minded guests something denser to engage with, without watering down the booklet for kids.
          </div>
        </Card>
      </div>

      <Placeholder label="Photos / scans of the printed activity booklet + passport" height={420} note="Best to drop in an actual scan or photo here — both items side by side, or the booklet open showing activities" />

      <div style={{ marginTop: 28, padding: '22px 26px', background: '#FAFAF8', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Bingo as wayfinding</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
          The bingo card doubles as a scavenger hunt. Items chosen — Sea Dahlia, Shaw's Agave, CA Towhee, Cabrillo Statue — exist at specific locations around the park, encouraging visitors to slow down and look at things they'd otherwise walk past. The game structure does the interpretive work without an extra sign.
        </p>
      </div>
    </Container>
  </SectionWrap>;


const CBEcoWebSection = () =>
<SectionWrap id="ecoweb">
    <Container>
      <SectionHeader num={4} title="Project 02 — Eco-Web" subtitle="A two-set educational card game on California food webs, covering both ecosystems at the park." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Audience</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Students and park visitors in a guided activity setting. The game is facilitator-led: a ranger or teacher draws a scenario card, and players reason out what happens to the food web.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Pedagogical Frame</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Scenario prompts are open-ended — "What do you think will happen?" — so the game drives discussion and reasoning instead of testing recall. The right answer is the conversation, not a card flip.
          </p>
        </Card>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: '#141414' }}>The card system</h3>
      <Card style={{ padding: 0, marginBottom: 22 }}>
        <table>
          <thead>
            <tr>
              <th>Set</th>
              <th>Contents</th>
              <th>Function</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, fontSize: 14 }}>Animal Cards (double-sided)</td>
              <td style={{ color: '#555', fontSize: 13 }}>California native species across two ecosystems — coastal scrub (Bumble Bee, Prickly Pear, Black Phoebe, Cooper's Hawk, Grey Fox, Gopher Snake, Red-tailed Hawk, Crawford's Grey Shrew, Desert Cottontail) and intertidal/marine (Brown Algae, Bat Star, Blueband Hermit Crab, Garibaldi, Osprey, Common Dolphin)</td>
              <td style={{ color: '#777', fontSize: 13 }}>Establish the food web before scenarios begin</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, fontSize: 14 }}>Scenario Cards (single-sided)</td>
              <td style={{ color: '#555', fontSize: 13 }}>Disruption events — disease, new predator, drought, chemical spill, invasive species, ocean acidification, intertidal invader</td>
              <td style={{ color: '#777', fontSize: 13 }}>Trigger reasoning about cascading effects</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: '#141414' }}>Visual system</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 32 }}>
        {[
          ['Shared Icon Language', 'Sunlight, Water (H₂O), Nutrient (N/C) icons rendered as atomic diagrams. Same visual vocabulary across both ecosystems lets cards mix and combine.', '#EBF7F2', '#2A8A5C'],
          ['Trophic Hierarchy', 'Each card carries a prey-icon row (Mammals, Birds, Bugs, Fish, etc.). Players see what eats what at a glance — no text needed.', '#FAF7F2', '#666'],
          ['Common + Scientific', 'Every species shows both names. Keeps the game accurate enough for classroom use, accessible enough for a 7-year-old.', '#FDF0E6', '#B85C0D']
        ].map(([title, desc, bg, accent]) =>
          <div key={title} style={{ background: bg, borderRadius: 18, padding: '22px 20px', border: `1.5px solid ${accent}22` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: accent }}>{title}</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65 }}>{desc}</div>
          </div>
        )}
      </div>

      <Placeholder label="Photos of Eco-Web card sets" height={420} note="Drop in card scans or fanned-out arrangement: animal cards on one side, scenario cards on the other" />
    </Container>
  </SectionWrap>;


const CBConstraintsSection = () =>
<SectionWrap id="constraints" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={5} title="Designing for Print + Public" subtitle="Three constraints that shaped every craft decision." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {[
          {
            title: 'No facilitator',
            desc: "The Open Tower Day materials had to be self-explanatory. A visitor picks one up at the entrance and can use it without instruction. That meant every activity had to be readable in under 10 seconds and obvious in what it asks for."
          },
          {
            title: 'No second print run',
            desc: 'Print is unforgiving. There\'s no "push an update" after a printing error. Every typo, every alignment mistake, every color the printer mangled — that\'s what visitors get. Files were proof-read against print samples before sign-off.'
          },
          {
            title: 'No assumed prior knowledge',
            desc: "Designing for the public, not for design audiences. The Eco-Web icons had to be readable without a legend explaining them. The bingo plants had to be findable without a botanical guide. The lighthouse drawing prompt had to work for a kid who's never drawn a building before."
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
    </Container>
  </SectionWrap>;


const CBOutcomeSection = () =>
<SectionWrap id="outcome">
    <Container>
      <SectionHeader num={6} title="Outcome" subtitle="Real materials, distributed at real events, used by real visitors." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Open Tower Day</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            The activity booklet and Historical Explorer passport were printed and distributed across multiple Open Tower Day events at Cabrillo National Monument. Visitors completed them on-site; the prize incentive drove kids and families through the full event arc.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Eco-Web</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            The card game was produced for use in guided educational sessions, supporting facilitators in walking groups through both ecosystems and disruption scenarios.
          </p>
        </Card>
      </div>

      <Placeholder label="Photo from Open Tower Day — visitors using the materials" height={300} note="If you have any event photos showing the booklets in the wild, that's the highest-impact visual you could put here" />
    </Container>
  </SectionWrap>;


const CBReflectionSection = () =>
<SectionWrap id="reflection" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={7} title="Reflection" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I Learned</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Print discipline. Designing for a fixed event with a real deadline and real visitors is a different muscle from iterative digital work. There's no fallback. Every design decision either works for someone walking up cold or it doesn't, and you find out the day of.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I'd Bring Forward</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            The constraints from print — no tooltips, no error states, no second chances — are the same constraints that make any design better. Anything that needs hover text to explain itself is one design layer away from breaking.
          </p>
        </Card>
      </div>

      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>WHAT THIS TAUGHT ME</div>
        <p style={{ fontSize: 19, lineHeight: 1.65, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760, fontFamily: 'Lora, Georgia, serif' }}>
          Print is the cleanest test of whether a design works. If a 7-year-old can use it without help, you've designed something good. If they need an explanation, you've designed a wireframe.
        </p>
      </div>
    </Container>
  </SectionWrap>;


Object.assign(window, {
  CBHeroSection, CBOverviewSection, CBRoleSection, CBOpenTowerSection,
  CBEcoWebSection, CBConstraintsSection, CBOutcomeSection, CBReflectionSection
});
