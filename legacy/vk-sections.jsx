// vk-sections.jsx — Val's Kitchen case study sections

const VKHeroSection = () =>
<SectionWrap id="hero" style={{ padding: '120px 0 80px' }}>
    <Container noBorder>
      <h1 style={{
        fontSize: 'clamp(52px, 8vw, 80px)', fontWeight: 500, lineHeight: 1.05,
        letterSpacing: '-0.03em', color: '#111', marginBottom: 16,
        fontFamily: 'Lora, Georgia, serif', maxWidth: 740,
      }}>
        Val's Kitchen.
      </h1>

      <div style={{ fontSize: 13, color: '#aaa', fontWeight: 500, letterSpacing: '0.01em', marginBottom: 32, whiteSpace: 'nowrap' }}>
        UX Research &nbsp;·&nbsp; Product Design &nbsp;·&nbsp; B2B Tools &nbsp;·&nbsp; Usability Testing
      </div>

      <p style={{ fontSize: 18, lineHeight: 1.75, color: '#777', maxWidth: 560, marginBottom: 56, fontWeight: 400 }}>
        Designing a kitchen inventory app for a real restaurant client — from paper sheets to a Figma prototype refined by scenario-based usability testing.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 0,
        width: 'fit-content', marginBottom: 64,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        {[['Role', 'Researcher & Designer'], ['Course', 'COGS 187A'], ['Client', "Val's Kitchen"], ['Output', 'Figma Lo-Fi → Hi-Fi']].map(([l, v], i) =>
          <div key={l} style={{
            padding: '16px 32px 16px', paddingLeft: i === 0 ? 0 : 32,
            borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{v}</div>
          </div>
        )}
      </div>

      <Placeholder label="Hero screenshot — Val's Kitchen hi-fi home screen" height={480} note="Drop Figma frame here — category-first home screen with Red Stock & Green Updates buttons" />
    </Container>
  </SectionWrap>;


const VKOverviewSection = () =>
<SectionWrap id="overview" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={1} title="The Problem" subtitle="A fast-paced kitchen running on paper sheets and memory." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Challenge</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            Val's Kitchen had no digital inventory system. Stock counts, freshness, and storage locations all lived on physical sheets — fine for a slow morning, brittle during a rush. Multiple roles (shift leads, cooks, inventory managers) needed to see the same data through different lenses, in seconds, while service was happening.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Our Approach</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', margin: 0 }}>
            Working from the restaurant's real inventory list, we built a category-organized app and tested it against four role-grounded scenarios. Findings were coded against Nielsen's heuristics, then translated explicitly into design directions before the hi-fi pass.
          </p>
        </Card>
      </div>
      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px', marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>DESIGN CHALLENGE</div>
        <p style={{ fontSize: 21, lineHeight: 1.6, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760 }}>
          "How do we move a busy kitchen from paper to a digital tool that's fast enough to use during service, flexible enough to fit multiple roles, and simple enough to learn without training?"
        </p>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 18, color: '#141414' }}>What is the Val's Kitchen app?</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {[
      ['Category-First', 'Tap a category (Faux Meats, Faux Cheeses, Produce…) to drill into items in that group — no scrolling through everything at once.', '#EBF7F2', '#2A8A5C'],
      ['Freshness at a Glance', 'Each item card shows a green / blue / red freshness tag. A shift lead can scan a category in seconds.', '#FAF7F2', '#666'],
      ['Triage Buttons', 'Red Stock and Green Updates buttons live on the home screen — instant visibility into urgency without navigating.', '#FDF0E6', '#B85C0D']].
      map(([title, desc, bg, accent]) =>
      <div key={title} style={{ background: bg, borderRadius: 18, padding: '24px 22px', border: `1.5px solid ${accent}22` }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: accent }}>{title}</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.65 }}>{desc}</div>
          </div>
      )}
      </div>
    </Container>
  </SectionWrap>;


const VKRoleSection = () =>
<SectionWrap id="role">
    <Container>
      <SectionHeader num={2} title="My Role" subtitle="Researcher and designer on a group project — owning scenario design, moderation, and key parts of the redesign." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Research</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            <li>Co-wrote the four scenario protocols</li>
            <li>Moderated a usability session and observed others</li>
            <li>Coded findings against Nielsen's heuristics</li>
            <li>Synthesized findings into the redesign brief</li>
          </ul>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Design</div>
          <ul style={{ paddingLeft: 18, fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            <li>Contributed to the lo-fi visual key and information architecture</li>
            <li>Drove the category-first home screen redesign</li>
            <li>Designed the freshness color-tag system</li>
            <li>Helped specify the inline edit popup behavior</li>
          </ul>
        </Card>
      </div>
    </Container>
  </SectionWrap>;


const VKMethodologySection = () =>
<SectionWrap id="methodology" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={3} title="Methodology" subtitle="Scenario-based usability testing with the heuristic coding protocol set up before sessions, not after." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
      { icon: 'usability', phase: '01', label: 'Scenario Design', desc: 'Four scenarios mapped to real kitchen roles. Tasks were embedded in believable context, not abstract instructions.' },
      { icon: 'interview', phase: '02', label: 'Moderated Sessions', desc: 'Each team member moderated one session using a consistent protocol: orient, observe, probe, debrief.' },
      { icon: 'affinity', phase: '03', label: 'Heuristic Coding', desc: "Findings tagged against Nielsen's heuristics during synthesis — protocol agreed upfront to reduce post-hoc fitting." }].
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
      <div style={{ background: '#FAFAF8', borderRadius: 16, padding: '24px 28px', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Why scenario-based</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
          Abstract tasks ("find a way to update stock") wouldn't surface the real friction. We needed tasks framed inside the cognitive context of an actual shift — a customer just ordered a fish sandwich, the inventory manager is on vacation, the head chef needs to verify dairy isn't expired. That framing was the whole point.
        </p>
      </div>
    </Container>
  </SectionWrap>;


const VKParticipantsSection = () =>
<SectionWrap id="participants">
    <Container>
      <SectionHeader num={4} title="Participants & Scenarios" subtitle="Four users, four scenarios. Each tested a different part of the interface under a different cognitive load." />
      <Card style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Role</th>
              <th>Task</th>
              <th>What it tested</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700, color: '#3DAA74' }}>01</td>
              <td style={{ fontWeight: 500 }}>Opening shift lead</td>
              <td style={{ color: '#555' }}>Locate the color-code key and identify what each color represents</td>
              <td style={{ color: '#777', fontSize: 13 }}>First-time onboarding to the system</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: '#3DAA74' }}>02</td>
              <td style={{ fontWeight: 500 }}>Cook</td>
              <td style={{ color: '#555' }}>Locate battered fish and cheddar slices for an incoming order</td>
              <td style={{ color: '#777', fontSize: 13 }}>Search under time pressure</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: '#3DAA74' }}>03</td>
              <td style={{ fontWeight: 500 }}>Closing shift lead</td>
              <td style={{ color: '#555' }}>Identify all items running below their target stock</td>
              <td style={{ color: '#777', fontSize: 13 }}>System-wide status scan</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: '#3DAA74' }}>04</td>
              <td style={{ fontWeight: 500 }}>Inventory manager</td>
              <td style={{ color: '#555' }}>Walk the entire inventory and flag everything needing reorder</td>
              <td style={{ color: '#777', fontSize: 13 }}>Full audit and navigation</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <div style={{ marginTop: 28, fontSize: 13, color: '#888', lineHeight: 1.7 }}>
        Each scenario was assigned to one participant. The four roles were chosen because they cover the full range of read/write patterns the app would see during a real service shift — and each stresses a different navigation primitive.
      </div>
    </Container>
  </SectionWrap>;


const VKFindingsSection = () =>
<SectionWrap id="findings" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={5} title="Findings by Heuristic" subtitle={"Each finding mapped to one of Nielsen's heuristics. Direct evidence under each."} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Tag color="green">SUCCESS</Tag>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#141414' }}>Hierarchy</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>
            The opening shift lead found the color key without instruction. The icon was placed where new users naturally look first — top-of-screen, inside the orientation flow.
          </p>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Tag color="green">SUCCESS</Tag>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#141414' }}>Match Between System & Real World</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>
            The color code mapped directly to the kitchen's existing mental model for restock urgency. Users described what colors meant correctly on their first look.
          </p>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Tag color="green">SUCCESS</Tag>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#141414' }}>Minimalist Design</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>
            The key itself was simple enough that users understood the legend instantly. But the same minimalism didn't extend to the home screen, which surfaced as a pain point below.
          </p>
        </Card>
        <Card style={{ borderColor: 'rgba(224,125,46,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Tag color="amber">PROBLEM</Tag>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#141414' }}>Flexibility & Efficiency of Use</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>
            Scroll fatigue. The cook scenario surfaced this fastest — finding battered fish + cheddar required scrolling past dozens of unrelated items. In a real rush this is a hard fail.
          </p>
        </Card>
        <Card style={{ borderColor: 'rgba(224,125,46,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Tag color="amber">PROBLEM</Tag>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#141414' }}>Visibility of System Status</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>
            Users lost track of which category they were inside while scrolling. Without a sticky header or breadcrumb, the flat list erased context — they couldn't tell if a result belonged to the section they were searching.
          </p>
        </Card>
        <Card style={{ borderColor: 'rgba(224,125,46,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Tag color="amber">PROBLEM</Tag>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#141414' }}>Aesthetic & Signal Density</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>
            Icon sizes too small to scan. One participant pointed out that the home screen was "hard to read because there was so much information being presented at once" — too dense for service-time use.
          </p>
        </Card>
      </div>

      <QuoteBlock
        text="The interface was a bit hard to read because there was so much information being presented at once on the homescreen."
        author="Cook scenario participant"
      />
    </Container>
  </SectionWrap>;


const VKSynthesisSection = () =>
<SectionWrap id="synthesis">
    <Container>
      <SectionHeader num={6} title="Synthesis → Design Directions" subtitle="Each design direction below ties back to a specific finding from §5. The point is the chain of reasoning, not just the output." />

      <Card style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Finding</th>
              <th>Design direction</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Scroll fatigue on flat list</div>
                <div style={{ fontSize: 12, color: '#888' }}>Flexibility & Efficiency</div>
              </td>
              <td style={{ color: '#444', fontSize: 14, lineHeight: 1.65 }}>
                Split the home screen into category tiles. One extra tap, but no scrolling past unrelated items.
              </td>
            </tr>
            <tr>
              <td style={{ verticalAlign: 'top' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Lost context mid-scroll</div>
                <div style={{ fontSize: 12, color: '#888' }}>Visibility of System Status</div>
              </td>
              <td style={{ color: '#444', fontSize: 14, lineHeight: 1.65 }}>
                Each category gets its own screen. The category name is the header — no breadcrumbs needed because there's nowhere to drift to.
              </td>
            </tr>
            <tr>
              <td style={{ verticalAlign: 'top' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>High-signal scanning at a glance</div>
                <div style={{ fontSize: 12, color: '#888' }}>Match with Real World</div>
              </td>
              <td style={{ color: '#444', fontSize: 14, lineHeight: 1.65 }}>
                Per-item freshness tags (green / blue / red) so a shift lead can scan a screen in seconds without reading numbers.
              </td>
            </tr>
            <tr>
              <td style={{ verticalAlign: 'top' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Urgency without navigation</div>
                <div style={{ fontSize: 12, color: '#888' }}>Visibility of System Status</div>
              </td>
              <td style={{ color: '#444', fontSize: 14, lineHeight: 1.65 }}>
                Two persistent home-screen buttons (Red Stock / Green Updates) with numerical badges. Triage signal lives on the entry screen.
              </td>
            </tr>
            <tr>
              <td style={{ verticalAlign: 'top' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Updates without losing place</div>
                <div style={{ fontSize: 12, color: '#888' }}>Flexibility & Efficiency</div>
              </td>
              <td style={{ color: '#444', fontSize: 14, lineHeight: 1.65 }}>
                Inline edit popup for stock and location changes. Updates happen in place, no navigation cost.
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </Container>
  </SectionWrap>;


const VKDecisionsSection = () =>
<SectionWrap id="decisions" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={7} title="Design Decisions" subtitle="Four structural calls that shaped the hi-fi." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {[
          {
            title: 'Category-first home screen',
            desc: "Tap a category (Faux Meats, Faux Cheeses, Produce, Seasonings, Beverages) to enter only that section's items. Adds one tap, removes the entire scroll-fatigue class of failures."
          },
          {
            title: 'Freshness color tags (green / blue / red)',
            desc: 'Per-item freshness state is encoded in color, not text. Green for fresh, blue for expiring soon, red for expired. Service-speed scanning.'
          },
          {
            title: 'Red Stock & Green Updates buttons',
            desc: 'Persistent home-screen buttons with numerical badges. Red surfaces low/critical/zero stock. Green surfaces qualitative updates (deliveries, manager notes, events). Higher number = more urgency, communicated without text.'
          },
          {
            title: 'Inline edit popup',
            desc: 'Tap any item card to edit stock, prep date, or location in place. Avoids the back-out-and-re-find pattern that breaks flow during service.'
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


const VKPrototypeSection = () =>
<SectionWrap id="prototype">
    <Container>
      <SectionHeader num={8} title="The Prototype" subtitle="Two task flows from the hi-fi Figma — designed to show the redesign under real shift conditions." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 10 }}>Task Flow 1</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>Inventory manager on vacation — check nugget stock</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>
            Home → Faux Meats → Nuggets card → inline edit popup → review stock and update quantity. Three taps, no scrolling, never leaves context.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 10 }}>Task Flow 2</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>Head chef expiry check — scan dairy</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#555', margin: 0 }}>
            Home → Faux Cheeses → scan freshness tags → tap a "blue" item → adjust prep date or mark discarded. Stock auto-updates on discard.
          </p>
        </Card>
      </div>

      <Placeholder label="Hi-fi Figma frames — Task Flow 1" height={420} note="Drop a screen sequence here: Home → Faux Meats → Nuggets edit popup" />

      <div style={{ height: 18 }} />

      <Placeholder label="Hi-fi Figma frames — Task Flow 2" height={420} note="Drop a screen sequence here: Home → Faux Cheeses → freshness scan → Half & Half popup" />

      <div style={{ marginTop: 32, padding: '20px 24px', background: '#FAFAF8', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', fontSize: 13, lineHeight: 1.7, color: '#666' }}>
        Live Figma file: <a href="https://www.figma.com/design/ZAZVgwhaIJzdqgCkwujQAu/Untitled?node-id=0-1" style={{ color: '#3DAA74', borderBottom: '1px solid rgba(61,170,116,0.4)' }} target="_blank" rel="noreferrer">view both fidelities →</a>
      </div>
    </Container>
  </SectionWrap>;


const VKReflectionSection = () =>
<SectionWrap id="reflection" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={9} title="Outcome & Reflection" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 36 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>Outcome</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            A lo-fi and hi-fi Figma prototype that addressed every major pain point surfaced in testing. Future direction documented for engineering: a live database with real-time updates from kitchen staff, managers, and suppliers.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 12 }}>What I'd Do Differently</div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#444', margin: 0 }}>
            Recruit actual restaurant staff rather than proxies. Our scenarios were grounded in real kitchen roles, but testers without a real shift's time pressure couldn't fully simulate the friction we'd see in service. That's the missing layer of evidence.
          </p>
        </Card>
      </div>

      <div style={{ background: '#141414', borderRadius: 22, padding: '36px 40px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>WHAT THIS TAUGHT ME</div>
        <p style={{ fontSize: 19, lineHeight: 1.65, fontStyle: 'italic', fontWeight: 300, color: 'white', margin: 0, maxWidth: 760, fontFamily: 'Lora, Georgia, serif' }}>
          Information density isn't a property of content — it's a property of context. The same screen that's fine on a desktop dashboard is unusable in a kitchen rush. Designing for the environment, not just the user, changed every layout decision.
        </p>
      </div>
    </Container>
  </SectionWrap>;


Object.assign(window, {
  VKHeroSection, VKOverviewSection, VKRoleSection, VKMethodologySection,
  VKParticipantsSection, VKFindingsSection, VKSynthesisSection,
  VKDecisionsSection, VKPrototypeSection, VKReflectionSection
});
