// ea-sections-4-v2.jsx — Synthesis, Key Insights, Design Impact, Reflection

const AffinitySection = () => (
  <SectionWrap id="affinity" style={{ background: V2.white }}>
    <Container>
      <SectionHeader num={9} title="Synthesis & Affinity Themes" subtitle="Three patterns emerged across behavioral observation, survey data, and stakeholder input." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 8 }}>
        {[
          { color: V2.accent,    label: 'Interaction Clarity',  items: ['All participants reconstructed game logic without instruction', 'Flow was self-evident across all experience levels', 'Internal logic was intuitive (electric-only items)'] },
          { color: V2.warn,      label: 'Reward Satisfaction',  items: ['Emotional payoff of earning points was weak for many users', 'High completion ≠ high motivation — a critical gap', 'Feedback loop needed to be faster and more visible'] },
          { color: V2.neutral,   label: 'Aesthetic Resonance',  items: ['Unanimous praise for pixel-art visual direction', 'Audio design called out unprompted by all 7 participants', 'Comparisons to Stardew Valley, Unpacking, Barbie.com'] },
        ].map(({ color, label, items }) => (
          <Card key={label} style={{ borderTop: `4px solid ${color}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 14 }}>{label}</div>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span style={{ color, fontWeight: 800, fontSize: 13, lineHeight: 1.5, flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 13, lineHeight: 1.65, color: '#555' }}>{item}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </Container>
  </SectionWrap>
);

const InsightsSection = () => {
  const [visible, setVisible] = React.useState([false, false, false]);
  const rowRefs = React.useRef([]);

  React.useEffect(() => {
    const observers = rowRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(prev => { const next = [...prev]; next[i] = true; return next; });
          }, i * 180);
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  const insights = [
    { num: '1', color: V2.accent,
      title: 'The interaction model works. The reward model doesn\'t — yet.',
      body: 'Users played without instruction — the interaction design works. But the emotional payoff didn\'t land. Clear ≠ satisfying — different problems, different solutions.' },
    { num: '2', color: V2.accent,
      title: 'The aesthetic direction is a genuine competitive advantage.',
      body: 'Every participant praised the visuals and audio — unanimous in a category of sterile educational games. Worth protecting in every iteration.' },
    { num: '3', color: V2.warn,
      title: 'The target audience wasn\'t fully represented in testing.',
      body: 'Both rounds skewed to UCSD undergrads. Only Preesha, 13, was near the target demo. A round with 8–12 year olds would likely surface different friction.' },
  ];

  return (
  <SectionWrap id="insights">
    <Container>
      <SectionHeader num={10} title="Key Insights" subtitle="Three findings that shaped everything that came after." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {insights.map(({ num, color, title, body }, i) => (
          <div key={num} ref={el => rowRefs.current[i] = el} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24, alignItems: 'flex-start', overflow: 'hidden' }}>
            {/* Number slides out from behind the card */}
            <div style={{
              fontSize: 64, fontWeight: 700, color, lineHeight: 1, opacity: visible[i] ? 0.18 : 0,
              textAlign: 'right', paddingTop: 4,
              transform: visible[i] ? 'translateX(0)' : 'translateX(60px)',
              transition: visible[i] ? `transform 0.55s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s, opacity 0.4s ease ${i * 0.08}s` : 'none',
            }}>{num}</div>
            {/* Card fades in */}
            <Card style={{
              borderLeft: `4px solid ${color}`,
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? 'translateX(0)' : 'translateX(-8px)',
              transition: visible[i] ? `opacity 0.5s ease ${i * 0.08 + 0.1}s, transform 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.08 + 0.1}s` : 'none',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: V2.ink, lineHeight: 1.4 }}>{title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555', margin: 0 }}>{body}</p>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  </SectionWrap>
  );
};

const DesignImpactSection = () => (
  <SectionWrap id="impact" style={{ background: V2.white }}>
    <Container>
      <SectionHeader num={11} title="Impact on Design" subtitle="How research directly — and traceably — changed what got built." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { phase: 'Phase 1', label: 'Concept Selection', tag: 'Research → Decision',
            desc: 'Competitive analysis + stakeholder interviews ruled out three of four concepts. Without the weighted matrix, the team might have selected Trash Dash — higher feasibility, but lower on dimensions that mattered most.' },
          { phase: 'Phase 2', label: 'Wireframe to Build', tag: 'Research → Engineering',
            desc: 'Round 1 identified three elements needing stronger visual signals before development, saving significant rework. The cognitive walkthrough confirmed no tutorial was needed — a major scope reduction.' },
          { phase: 'Phase 3', label: 'Build to Ship', tag: 'Research → Iteration',
            desc: 'Five specific product changes mapped directly to Round 2 findings — each to a specific participant observation or survey response, not guesswork.' },
        ].map(({ phase, label, tag, desc }) => (
          <Card key={phase}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4a6aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>{phase}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{label}</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#555', marginBottom: 14 }}>{desc}</p>
            <Tag color="gray">{tag}</Tag>
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: V2.ink }}>5 Specific Changes From Testing</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Photo
          src="uploads/ea-pc-card.png"
          alt="Final hi-fi Personal Computer info card"
          caption="Final info card — point value made visible, energy bar shows running total."
        />
        <Photo
          src="uploads/ea-energy-bar.png"
          alt="Energy bar fill states from empty to full"
          caption="Energy bar progression — five fill states give cumulative feedback."
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 40 }}>
        {[
          ['Point Visibility',    'Point values made numerically visible on each interaction card'],
          ['Click Animation',     'Items flash visually on click — confirms the interaction registered'],
          ['Audio Feedback',      'Sound cues added to item interactions for tactile feel'],
          ['Energy Bar Fix',      'Energy bar updated to show running total, not just points just added'],
          ['Back Button Clarity', 'Back button behavior made more visually explicit in the UI'],
        ].map(([title, desc], i) => (
          <div key={i} style={{ display: 'flex', gap: 14, background: V2.accentBg, borderRadius: 14, padding: '16px 18px', alignItems: 'flex-start' }}>
            <div style={{ minWidth: 26, height: 26, background: V2.accent, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: V2.dark, flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 13, color: V2.muted, lineHeight: 1.55 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: V2.ink }}>Broader Outcomes</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { bg: V2.accentBg,  icon: '🎮', title: 'Game Shipped',      color: '#4a6aaa', desc: 'Fully playable in Construct3 by March 18, 2025 — all five pre-defined success metrics met or exceeded.' },
          { bg: V2.warnBg,    icon: '📱', title: 'Social Launch',     color: V2.warn,   desc: 'An Instagram account was created for launch outreach, generating early interest from the sustainability community.' },
          { bg: V2.neutralBg, icon: '🌍', title: 'Platform Interest', color: '#4a8a6a', desc: 'PlanetFlip expressed interest in integrating Energy Ave for partner climate orgs. SD Climate Collaborative flagged it for their curriculum.' },
        ].map(({ bg, icon, title, color, desc }) => (
          <div key={title} style={{ background: bg, borderRadius: 18, padding: '24px 22px' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color }}>{title}</div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>
    </Container>
  </SectionWrap>
);

const ReflectionSection = () => (
  <SectionWrap id="reflection">
    <Container>
      <SectionHeader num={12} title="Reflection" />
      <div style={{ marginBottom: 28 }}>
        <Photo
          src="uploads/ea-gameplay-irl.jpg"
          alt="Energy Ave being played on a laptop"
          caption="Energy Ave in the wild — a participant playing the final build."
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4a6aaa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>What Went Well</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: '#444', marginBottom: 12 }}>
            The two-round structure was the most valuable methodological choice. Splitting formative (wireframes) from summative (build) caught affordance problems before they were built in.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: '#444', margin: 0 }}>
            Mixed methods — observation + survey — gave a richer picture than either alone. The gap between completion and satisfaction was where the most interesting design work lived.
          </p>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: V2.warn, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>What I'd Do Differently</div>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: '#444', marginBottom: 12 }}>
            The biggest gap was participant representation — both rounds skewed to UCSD undergrads. A round with 8–12 year olds would've surfaced different friction: reading level, attention span, comprehension.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.85, color: '#444', margin: 0 }}>
            I'd also push for a longitudinal component — a follow-up 1–2 weeks post-play to measure whether energy-saving behaviors stuck at home. The more important, still-unanswered question.
          </p>
        </Card>
      </div>
    </Container>
  </SectionWrap>
);

Object.assign(window, { AffinitySection, InsightsSection, DesignImpactSection, ReflectionSection });
