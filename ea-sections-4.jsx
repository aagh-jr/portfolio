// ea-sections-4.jsx — Key Insights, Design Impact, Reflection

const AffinitySection = () =>
<SectionWrap id="affinity" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={9} title="Synthesis & Affinity Themes" subtitle="After both rounds, three patterns emerged across all data." />
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 40 }}>
        <MethodIcon type="affinity" size={40} />
        <p style={{ fontSize: 16, lineHeight: 1.75, color: '#555', maxWidth: 700, paddingTop: 6 }}>
          Combining behavioral observation, attitudinal survey data, and stakeholder input, we mapped findings into three overarching themes that shaped all subsequent design decisions.
        </p>
      </div>
      <Placeholder label="Affinity map — clustered research themes" height={280} note="Post-it clusters: Interaction Clarity / Reward Satisfaction / Aesthetic Response / Discoverability / Audience Fit" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 32 }}>
        {[
      { color: '#3DAA74', label: 'Interaction Clarity', items: ['All participants reconstructed game logic without instruction', 'Flow was self-evident across all experience levels', 'Internal game logic was intuitive (electric-only items)'] },
      { color: '#E07D2E', label: 'Reward Satisfaction', items: ['Emotional payoff of earning points was weak for many users', 'High completion ≠ high motivation — a critical gap', 'Feedback loop needed to be faster and more visible'] },
      { color: '#3A52B0', label: 'Aesthetic Resonance', items: ['Unanimous praise for pixel-art visual direction', 'Audio design called out unprompted by all 7 participants', 'Comparisons to Stardew Valley, Unpacking, Barbie.com'] }].
      map(({ color, label, items }) =>
      <Card key={label} style={{ borderTop: `4px solid ${color}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 16 }}>{label}</div>
            {items.map((item, i) =>
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span style={{ color, fontWeight: 800, fontSize: 13, lineHeight: 1.5, flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 13, lineHeight: 1.65, color: '#555' }}>{item}</span>
              </div>
        )}
          </Card>
      )}
      </div>
    </Container>
  </SectionWrap>;


const InsightsSection = () =>
<SectionWrap id="insights">
    <Container>
      <SectionHeader num={10} title="Key Insights" subtitle="Three findings that shaped everything that came after." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {[
      { num: '01', color: '#3DAA74',
        title: 'The interaction model works. The reward model doesn\'t — yet.',
        body: 'Users consistently understood how to play without instruction — a clear validation of the core interaction design. But the emotional payoff of earning points wasn\'t strong enough for many users. The game was clear; it wasn\'t satisfying. These are different problems with different solutions, and recognizing that distinction was the most important analytical step of the project.' },
      { num: '02', color: '#3DAA74',
        title: 'The aesthetic direction is a genuine competitive advantage.',
        body: 'Every single participant responded positively to the visual and audio design — a unanimous signal in a category where educational games are often visually sterile. Energy Ave\'s pixel-art indie aesthetic was a meaningful differentiator worth protecting. Adding challenge and depth in future iterations shouldn\'t come at the cost of the relaxed, exploratory tone.' },
      { num: '03', color: '#E07D2E',
        title: 'The target audience wasn\'t fully represented in testing.',
        body: 'Both rounds skewed toward college-aged UCSD students. Only one participant — Preesha, 13 — came close to the actual target demographic. A dedicated round of testing with 8–12 year olds in a classroom setting would likely surface fundamentally different friction points: reading level on info cards, attention span across rooms, and comprehension of the energy concepts themselves.' }].
      map(({ num, color, title, body }) =>
      <div key={num} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 28, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 72, fontWeight: 700, color, lineHeight: 1, opacity: 0.15, textAlign: 'right', paddingTop: 4 }}>{num}</div>
            <Card style={{ borderLeft: `4px solid ${color}` }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: '#141414', lineHeight: 1.4 }}>{title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#555', margin: 0 }}>{body}</p>
            </Card>
          </div>
      )}
      </div>
    </Container>
  </SectionWrap>;


const DesignImpactSection = () =>
<SectionWrap id="impact" style={{ background: '#fff' }}>
    <Container>
      <SectionHeader num={11} title="Impact on Design" subtitle="How research directly — and traceably — changed what got built." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
        {[
      { phase: 'Phase 1', label: 'Concept Selection', tag: 'Research → Decision',
        desc: 'Competitive analysis + stakeholder interviews ruled out three of four concepts. Without the weighted decision matrix and stakeholder feedback, the team might have selected Trash Dash — higher feasibility score, but lower on the dimensions that mattered most.' },
      { phase: 'Phase 2', label: 'Wireframe to Build', tag: 'Research → Engineering',
        desc: 'Round 1 identified three elements needing stronger visual signals before development began, saving significant rework. The cognitive walkthrough confirmed no tutorial was needed — a major scope reduction.' },
      { phase: 'Phase 3', label: 'Build to Ship', tag: 'Research → Iteration',
        desc: 'Five specific product changes mapped directly to Round 2 findings. Each change corresponded to a specific participant observation or survey response — not guesswork.' }].
      map(({ phase, label, tag, desc }) =>
      <Card key={phase}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 6 }}>{phase}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{label}</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#555', marginBottom: 16 }}>{desc}</p>
            <Tag color="gray">{tag}</Tag>
          </Card>
      )}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>5 Specific Changes Made From Testing</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 48 }}>
        {[
      ['Point Visibility', 'Point values made numerically visible on each interaction card'],
      ['Click Animation', 'Items flash visually on click — confirms the interaction registered'],
      ['Audio Feedback', 'Sound cues added to item interactions for tactile feel'],
      ['Energy Bar Fix', 'Energy bar updated to show running total, not just the points just added'],
      ['Back Button Clarity', 'Back button behavior made more visually explicit in the UI']].
      map(([title, desc], i) =>
      <div key={i} style={{ display: 'flex', gap: 14, background: '#F5F2EC', borderRadius: 16, padding: '16px 20px', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 28, height: 28, background: '#3DAA74', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.55 }}>{desc}</div>
            </div>
          </div>
      )}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Broader Outcomes</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
      { bg: '#EBF7F2', accent: '#3DAA74', icon: '🎮', title: 'Game Shipped', desc: 'Fully playable in Construct3 by March 18, 2025 — meeting the primary SMART objective. All five pre-defined success metrics met or exceeded.' },
      { bg: '#EBF0FF', accent: '#3A52B0', icon: '📱', title: 'Social Launch', desc: 'An Instagram account was created for launch outreach, generating early interest from the sustainability community.' },
      { bg: '#FDF0E6', accent: '#E07D2E', icon: '🌍', title: 'Platform Interest', desc: 'PlanetFlip expressed interest in integrating Energy Ave for use by partner climate organizations. SD Climate Collaborative flagged it for their sustainability curriculum.' }].
      map(({ bg, accent, icon, title, desc }) =>
      <div key={title} style={{ background: bg, borderRadius: 20, padding: '28px 24px' }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: accent }}>{title}</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65 }}>{desc}</div>
          </div>
      )}
      </div>
    </Container>
  </SectionWrap>;


const ReflectionSection = () =>
<SectionWrap id="reflection">
    <Container>
      <SectionHeader num={12} title="Reflection" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 16 }}>What Went Well</div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#444', marginBottom: 14 }}>
            The two-round testing structure was the most valuable methodological decision. Separating formative (wireframes) from summative (working build) testing let us catch affordance problems before they were built in — and validate the interaction model before committing engineering time.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#444', margin: 0 }}>
            The mixed-methods approach — behavioral observation combined with attitudinal survey data — gave us a richer picture than either alone. Observation told us users could complete tasks. The survey told us how they felt doing it. The gap between those two things was where the most interesting design work lived.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E07D2E', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 16 }}>What I'd Do Differently</div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#444', marginBottom: 14 }}>
            The biggest gap was participant representation. Both rounds skewed toward college-aged UCSD students. A dedicated round with 8–12 year olds in a classroom setting would have surfaced different friction points — reading level on info cards, attention span across rooms, comprehension of energy concepts.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#444', margin: 0 }}>
            I'd also push for a longitudinal component — a follow-up survey 1–2 weeks after play to measure whether any energy-saving behaviors were actually adopted at home. Our testing measured knowledge improvement at the moment of play. Whether the game actually changed behavior is the more important, and currently unanswered, question.
          </p>
        </Card>
      </div>
      <div style={{ background: '#141414', borderRadius: 24, padding: '44px 52px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3DAA74', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>
</div>
        <p style={{ fontSize: 24, lineHeight: 1.6, fontWeight: 300, color: 'white', maxWidth: 740, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', maxWidth: 680, margin: 0 }}>

      </p>
      </div>
    </Container>
  </SectionWrap>;

Object.assign(window, { AffinitySection, InsightsSection, DesignImpactSection, ReflectionSection });