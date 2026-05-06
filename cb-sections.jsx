// cb-sections.jsx — Cabrillo National Monument Interpretation Program case study

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
        Program Management &nbsp;·&nbsp; Public Engagement &nbsp;·&nbsp; Stakeholder Coordination &nbsp;·&nbsp; National Park Service
      </div>

      <p style={{ fontSize: 18, lineHeight: 1.75, color: '#777', maxWidth: 620, marginBottom: 56, fontWeight: 400 }}>
        Two terms as an Associate in the park's Interpretation program — designing, running, measuring, and documenting public engagement programs end-to-end so they survived past my tenure.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 0,
        width: 'fit-content', marginBottom: 64,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        {[['Role', 'Interpretation Associate'], ['Duration', '2 Terms (multi-season)'], ['Client', 'Cabrillo NM (NPS)'], ['Output', 'Programs, SOPs, materials']].map(([l, v], i) =>
          <div key={l} style={{
            padding: '16px 32px 16px', paddingLeft: i === 0 ? 0 : 32,
            borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{v}</div>
          </div>
        )}
      </div>

      <div style={{ borderRadius: 22, overflow: 'hidden', background: '#FAFAF8' }}>
        <img src="screenshots/cabrillo/hero-altar.jpg" alt="Día de los Muertos altar at the Cabrillo Visitor Center" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    </Container>
  </SectionWrap>;


const CBOverviewSection = () =>
<SectionWrap id="overview" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={1} title="The Program" subtitle="Public engagement at a federal park, against a fixed audience and a fixed calendar." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Setting</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            Cabrillo National Monument sits at the tip of Point Loma in San Diego — coastal scrub on the bluffs, an intertidal zone below, and the Old Point Loma Lighthouse on top. Visitors arrive across all ages, languages, and prior knowledge levels, often for an hour at most.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Role</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            I worked as an Associate in the park's Interpretation program — the team responsible for the educational and cultural programming visitors actually engage with. My remit covered scoping, designing, facilitating, measuring, and writing the SOPs that let the next person run each program without me.
          </p>
        </Card>
      </div>
      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px', marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>PROGRAM CHALLENGE</div>
        <p style={{ fontSize: 21, lineHeight: 1.6, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760 }}>
          "How do you run public-engagement programs that scale across staff turnover, multiple seasons, and a 7-to-70 audience — when your only signal is whether someone walks up?"
        </p>
      </div>
    </Container>
  </SectionWrap>;


const CBPlaybookSection = () =>
<SectionWrap id="playbook">
    <Container>
      <SectionHeader num={2} title="The Playbook" subtitle="A repeatable model I wrote down so the next intern wouldn't start from scratch." />

      <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', maxWidth: 720, marginBottom: 32 }}>
        Most of the work was running events. The most useful artifact I produced was the <em>process</em> behind them: a written guide called <strong>"A Mini Guide on Pop-Up Programs"</strong> that codified the 7-step model below. Future associates inherit a system, not just a folder of files.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          ['01', 'Theme', 'Pick the message and the educational anchor first. Activities follow.'],
          ['02', 'Interpretive Question', 'What question do we want a visitor to walk away asking? Drives engagement, not recall.'],
          ['03', 'Research', 'The most time-consuming step. Done in a shared workspace so the next person can fact-check.'],
          ['04', 'Materials', 'Designed in Canva/Adobe; resourceful with what the office already has. Print-ready.'],
          ['05', 'Location', 'Picked for visitor flow + proximity to the resource being interpreted (e.g., whale overlook for whales).'],
          ['06', 'Activity & Promotion', 'Built for a wide age range. Promoted via partner social channels in advance.'],
          ['07', 'Measurement', 'Clicker counts of meaningful interactions, worksheet completions, prizes given out — logged for end-of-year reporting.'],
        ].map(([n, title, desc]) =>
          <Card key={n} style={{ padding: '22px 22px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', letterSpacing: '0.12em', marginBottom: 10 }}>STEP {n}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: '#555' }}>{desc}</div>
          </Card>
        )}
      </div>

      <div style={{ padding: '22px 26px', background: '#FAFAF8', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Why this mattered</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
          The Interpretation program runs on rotating interns and seasonal staff. Without documented process, every new associate reinvents the wheel and the program loses institutional memory. Writing the playbook was a deliberate PM move — one document that compounds across every future event.
        </p>
      </div>
    </Container>
  </SectionWrap>;


const CBWhaleWatchingSection = () =>
<SectionWrap id="whalewatching" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={3} title="Initiative 01 — Guided Whale Watching" subtitle="A multi-week program run two seasons in a row, with a documented handoff for the third." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Opportunity</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Gray whales migrate past Point Loma every December–February. Cabrillo was historically a pioneer in land-based whale watching, but the program had lapsed. I designed and ran a multi-week pop-up to revive it — first in 2024, then expanded for 2025.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I Owned</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Program scoping, partnership with subject experts, activity workbook, on-site facilitation, social promotion across two seasons, weekly tuning based on attendance, and the SOP that let the program run again in 2025 without me re-spec'ing it.
          </p>
        </Card>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: '#141414' }}>Program shape</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          ['Cadence', '4 Saturdays per season, 10:30am–12:30pm, at Kelp Forest & Whale Watch Overlook.'],
          ['Materials', 'Borrowed binoculars, fact sheets, and a Gray Whale Activity Book (anatomy match, migration map, observation centerfold, final report) I designed in Canva.'],
          ['Promotion', 'IG posts on partner accounts in the weeks leading up — flyer art, dated week-by-week schedule. Eye-catching > information-dense.'],
          ['Facilitation', 'Walk visitors from the Visitor Center to the overlook, hand out binoculars, guide what to look for (flukes, spouts, boat trails), answer the standard 4 questions.'],
        ].map(([t, d]) =>
          <Card key={t} style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: '#555' }}>{d}</div>
          </Card>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {[
          ['whale-ig-1.png', 'Guided Whale Watching IG flyer (2025 season)'],
          ['whale-ig-2.png', 'Calendar IG post listing the four Saturdays'],
          ['whale-photo.jpg', 'Whale tail photographed from a Cabrillo overlook'],
          ['whale-activity-book.png', 'Gray Whale Activity Book — front and back pages'],
        ].map(([file, alt]) =>
          <div key={file} style={{ borderRadius: 14, overflow: 'hidden', background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
            <img src={`screenshots/cabrillo/${file}`} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1 / 1', display: 'block' }} />
          </div>
        )}
      </div>

      <div style={{ marginTop: 28, padding: '22px 26px', background: '#FAFAF8', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Cross-functional</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
          I partnered with Park Ranger Amanda, who had run earlier versions, to absorb institutional knowledge before launch. Then I wrote a public Canva for the activity book and a Grey Whale Watching SOP — both editable so future facilitators can extend the program rather than rebuild it.
        </p>
      </div>
    </Container>
  </SectionWrap>;


const CBEcoWebSection = () =>
<SectionWrap id="ecoweb">
    <Container>
      <SectionHeader num={4} title="Initiative 02 — Eco-Web" subtitle="A two-deck educational card game on California food webs, designed against explicit user-research requirements." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Brief</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            A reusable activity for outreach events and classrooms that explains how disruptions cascade through an ecosystem — without a science background and without losing a 10-year-old halfway through.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>The Frame</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Facilitator-led: a ranger or teacher draws a scenario card and players reason out cascading effects. The right answer is the conversation, not a card flip.
          </p>
        </Card>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: '#141414' }}>User-centered requirements (from the SOP)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          ['Cognitive Load', 'Has to be quick and digestible. A long, dense activity loses participants mid-way. Each card carries one idea.', '#EBF7F2', '#2A8A5C'],
          ['Accessibility', 'Plain language for scientific terms. Designed for ESL learners, K–12 students, and adults across knowledge levels.', '#FAF7F2', '#666'],
          ['Learning Outcome', 'Players walk away knowing X, Y, Z — but more importantly, motivated to repeat what they learned. Conversation over correctness.', '#FDF0E6', '#B85C0D'],
        ].map(([title, desc, bg, accent]) =>
          <div key={title} style={{ background: bg, borderRadius: 18, padding: '22px 20px', border: `1.5px solid ${accent}22` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: accent }}>{title}</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65 }}>{desc}</div>
          </div>
        )}
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
              <td style={{ fontWeight: 600, fontSize: 14 }}>Animal Cards</td>
              <td style={{ color: '#555', fontSize: 13 }}>California natives across two ecosystems — coastal scrub (Bumble Bee, Prickly Pear, Black Phoebe, Cooper's Hawk, Grey Fox, Gopher Snake, Red-tailed Hawk, Crawford's Grey Shrew, Desert Cottontail) and intertidal/marine (Brown Algae, Bat Star, Blueband Hermit Crab, Garibaldi, Osprey, Common Dolphin)</td>
              <td style={{ color: '#777', fontSize: 13 }}>Build the food web before scenarios begin</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, fontSize: 14 }}>Scenario Cards</td>
              <td style={{ color: '#555', fontSize: 13 }}>Disruption events — disease, new predator, drought, chemical spill, invasive species, ocean acidification, intertidal invader</td>
              <td style={{ color: '#777', fontSize: 13 }}>Trigger reasoning about cascading effects</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, fontSize: 14 }}>Resource Icons</td>
              <td style={{ color: '#555', fontSize: 13 }}>Sunlight, Water (H₂O), Nutrient (N/C) atomic-style icons used as a shared visual vocabulary across both decks</td>
              <td style={{ color: '#777', fontSize: 13 }}>Same language across ecosystems → cards mix and combine</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, color: '#141414' }}>The full deck</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#666', maxWidth: 720, marginBottom: 24 }}>
        15 species across two decks — coastal scrub on top, intertidal/marine on the bottom row. Each card carries a photograph, common + scientific name, and the prey-icon row that drives the food-web reasoning.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, padding: 14, background: '#F4F4F1', borderRadius: 18 }}>
        {[
          ['card-black-phoebe', 'Black Phoebe'],
          ['card-coopers-hawk', "Cooper's Hawk"],
          ['card-red-tailed-hawk', 'Red-tailed Hawk'],
          ['card-grey-shrew', "Crawford's Grey Shrew"],
          ['card-grey-fox', 'Grey Fox'],
          ['card-gopher-snake', 'Gopher Snake'],
          ['card-desert-cottontail', 'Desert Cottontail'],
          ['card-bumble-bee', 'California Bumble Bee'],
          ['card-prickly-pear', 'Coastal Prickly Pear'],
          ['card-bat-star', 'Bat Star'],
          ['card-blueband-hermit', 'Blueband Hermit Crab'],
          ['card-brown-algae', 'Brown Algae'],
          ['card-garibaldi', 'Garibaldi'],
          ['card-osprey', 'Osprey'],
          ['card-common-dolphin', 'Common Dolphin'],
        ].map(([file, alt]) =>
          <div key={file} style={{ aspectRatio: '0.515 / 1', overflow: 'hidden', borderRadius: 6 }}>
            <img src={`screenshots/cabrillo/${file}.png`} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
      </div>

      <div style={{ marginTop: 28, padding: '22px 26px', background: '#FAFAF8', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Built to be extended</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
          The SOP I wrote includes a "Future Refinements" section — a 4-step process (research → wireframe the new relationships → design new cards → user-test before merging) so future staff can extend the deck without breaking the visual or pedagogical system.
        </p>
      </div>
    </Container>
  </SectionWrap>;


const CBFlowerHuntSection = () =>
<SectionWrap id="flowerhunt" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={5} title="Initiative 03 — Junior Botanist (Spring Flower Hunt)" subtitle="A native-plant scavenger hunt — and the only program where I got to A/B test the launch." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What it was</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Visitors got a foldable scavenger hunt at the Visitor Center, walked the park's grassland and coastal trails to find five native plants, photographed their favorite, and returned to redeem a prize. An accompanying info table — with live plants from the park greenhouse — caught visitors who didn't want to walk.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Cross-functional</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Coordinated with Patricia, the park's Vegetation Specialist, to request a crate of in-bloom plants from the greenhouse for the table. Live plants ended up being the centerpiece — a reminder that the right ask to the right partner beats anything I could've designed alone.
          </p>
        </Card>
      </div>

      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px', marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>THE DATA POINT I CARE ABOUT</div>
        <p style={{ fontSize: 24, lineHeight: 1.5, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: '0 0 18px', maxWidth: 760, fontFamily: 'Lora, Georgia, serif' }}>
          The first run was a quiet test. The second run — same activity, same location, same staff — went out with full social-media advertisement.
        </p>
        <p style={{ fontSize: 24, lineHeight: 1.5, fontWeight: 500, color: '#3DAA74', margin: 0, maxWidth: 760, fontFamily: 'Lora, Georgia, serif' }}>
          It pulled <span style={{ fontWeight: 700 }}>10× the participants.</span>
        </p>
      </div>

      <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', maxWidth: 720, marginBottom: 24 }}>
        That gap is the whole reason I take program-level promotion seriously. The activity wasn't the lever — the activity was already good. The lever was making sure people knew it existed before they showed up at the park. Every program I ran after that got a real promotion plan baked into the timeline, not bolted on at the end.
      </p>

      <div style={{ borderRadius: 18, overflow: 'hidden', background: '#FAFAF8', border: '1px solid rgba(0,0,0,0.06)' }}>
        <img src="screenshots/cabrillo/flower-hunt.png" alt="Junior Botanist scavenger hunt — foldable book and native plant identification grid" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    </Container>
  </SectionWrap>;


const CBOtherInitiativesSection = () =>
<SectionWrap id="other">
    <Container>
      <SectionHeader num={6} title="Program Breadth" subtitle="Smaller initiatives that filled out the program calendar — each treated as a real launch." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
        {[
          {
            title: 'Open Tower Day',
            desc: 'Activity booklet + Historical Explorer passport for the lighthouse open-tower event. Bingo card doubles as a scavenger hunt — items like Sea Dahlia, Shaw\'s Agave, and the Cabrillo Statue exist at specific locations and pull visitors through the full park.',
          },
          {
            title: 'Cabrillo Birthday Pop-Up',
            desc: 'Visitors made birthday cards for the park\'s anniversary — sharing memories and what they enjoy. Coloring-friendly, designed to hand to a kid with no instruction.',
          },
          {
            title: 'Día de los Muertos',
            desc: 'Cultural program celebrating Día de los Muertos — promotional poster and on-site altar activity. Brought a tradition into the park calendar that hadn\'t been programmed before.',
          },
          {
            title: 'Gratitude Season',
            desc: 'Community gratitude tree — visitors wrote what they\'re thankful for on a leaf and stuck it on a shared tree near the Visitor Center. Asynchronous, low-touch, high participation.',
          },
          {
            title: 'Nature Journal',
            desc: 'A two-page observational worksheet (date, weather, location, "I feel / I wonder / I notice" + sketch space) used across multiple programs. Reusable across seasons rather than one-off.',
          },
        ].map(t =>
          <Card key={t.title} style={{ padding: '22px 22px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>{t.title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: '#555' }}>{t.desc}</div>
          </Card>
        )}
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {[
          ['birthday-card.png', 'Cabrillo Birthday Pop-Up flyer', '#FFF'],
          ['gratitude-season.png', 'Gratitude Season tree activity flyer', '#FFF'],
          ['dia-de-muertos-poster.png', 'Día de los Muertos altar poster', '#FFF'],
          ['nature-journal.png', 'Nature Journal observational worksheet', '#FFF'],
          ['open-tower-book.png', 'Open Tower Day activity booklet (folded layout)', '#F4F4F1'],
        ].map(([file, alt, bg]) =>
          <div key={file} style={{ borderRadius: 14, overflow: 'hidden', background: bg, border: '1px solid rgba(0,0,0,0.06)' }}>
            <img src={`screenshots/cabrillo/${file}`} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '4 / 5', display: 'block' }} />
          </div>
        )}
      </div>
    </Container>
  </SectionWrap>;


const CBMeasurementSection = () =>
<SectionWrap id="measurement" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={7} title="Measurement & Iteration" subtitle="What I tracked, why, and how the numbers changed how I ran the next program." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {[
          {
            n: '01',
            title: 'Interpretive contacts',
            desc: 'Clicker counts of meaningful interactions — required for end-of-year reporting at the park level. The same number tells you whether your pop-up is working and gives leadership a quantifiable program impact at the end of the season.',
          },
          {
            n: '02',
            title: 'Worksheet completion rate',
            desc: 'For programs that used activity books, I tracked how many were handed out vs. completed. That ratio tells you whether the activity is the draw or whether people are just collecting collateral.',
          },
          {
            n: '03',
            title: 'Promotion lift',
            desc: 'The 10× participation gap between the test and advertised runs of Junior Botanist. After that data point, every program got a real promotion plan baked into the timeline — not bolted on at the end.',
          },
          {
            n: '04',
            title: 'Multi-week tuning',
            desc: 'Whale Watching ran four Saturdays. If attendance dropped or visitors weren\'t engaging with the workbook, I had three more weekends to adjust the pitch, the materials, or the location. Each weekend was an iteration.',
          },
        ].map(d =>
          <Card key={d.n} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 18, padding: '22px 26px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', letterSpacing: '0.12em', textTransform: 'uppercase', paddingTop: 4 }}>
              {d.n}
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


const CBHandoffSection = () =>
<SectionWrap id="handoff">
    <Container>
      <SectionHeader num={8} title="Coordination & Handoff" subtitle="The people I worked through, and the documents I left behind." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Stakeholders</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.85, color: '#444', margin: 0 }}>
            <li><strong>Park Rangers</strong> — subject experts for whale watching, lighthouse history, marine ecology</li>
            <li><strong>Vegetation Specialist (Patricia)</strong> — live native plants from the park greenhouse</li>
            <li><strong>Supervisors</strong> — content and timing approval before printing or promoting</li>
            <li><strong>Park social media</strong> — partner accounts on Instagram for promotion reach</li>
            <li><strong>Volunteer interpretive staff</strong> — facilitators on event days when programs ran multi-station</li>
          </ul>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I left for the next associate</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.85, color: '#444', margin: 0 }}>
            <li><strong>"A Mini Guide on Pop-Up Programs"</strong> — the 7-step playbook</li>
            <li><strong>Grey Whale Watching SOP</strong> — multi-week program runbook</li>
            <li><strong>Eco-Web Mini SOP</strong> — facilitator script + future-refinement guide</li>
            <li><strong>Public Canva files</strong> — for the activity books and flyers, editable by future staff</li>
            <li><strong>Promotion templates</strong> — IG post layouts dated and reusable season-to-season</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 28, fontSize: 13, color: '#888', lineHeight: 1.7, maxWidth: 760 }}>
        The Interpretation program runs on rotating staff. The deliverable that mattered most wasn't any one event — it was making sure the next person didn't have to start from scratch.
      </div>
    </Container>
  </SectionWrap>;


const CBReflectionSection = () =>
<SectionWrap id="reflection" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={9} title="Reflection" subtitle="What program management at a federal park taught me, in PM terms." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Transferable skills</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.8, color: '#444', margin: 0 }}>
            <li>Scoping under hard constraints (fixed events, fixed audience, no rollback)</li>
            <li>Cross-functional coordination with subject experts</li>
            <li>Shipping to a real launch date with measurable outcomes</li>
            <li>Iterating based on quantitative + qualitative signal</li>
            <li>Writing documentation that survives staff turnover</li>
          </ul>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I'd bring forward</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Programs aren't projects. A project ends; a program has to be runnable next season by someone who wasn't there. That mindset — designing for handoff, measuring for the next iteration, writing things down before you forget them — is what I carry into every product role.
          </p>
        </Card>
      </div>

      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>WHAT THIS TAUGHT ME</div>
        <p style={{ fontSize: 19, lineHeight: 1.65, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760, fontFamily: 'Lora, Georgia, serif' }}>
          The best work I did at Cabrillo wasn't an event. It was the document that let the next person run the event without me — and the data point that told them whether to bother promoting it.
        </p>
      </div>
    </Container>
  </SectionWrap>;


Object.assign(window, {
  CBHeroSection, CBOverviewSection, CBPlaybookSection,
  CBWhaleWatchingSection, CBEcoWebSection, CBFlowerHuntSection,
  CBOtherInitiativesSection, CBMeasurementSection, CBHandoffSection,
  CBReflectionSection,
});
