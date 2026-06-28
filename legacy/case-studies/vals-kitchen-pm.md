# Val's Kitchen Software — Product Management

**Summary:** Team member on a group that scoped, designed, tested, and iterated a kitchen inventory management app for a real restaurant client. COGS 187A, [CONFIRM: quarter/year].

---

## Context

Val's Kitchen needed a digital replacement for paper-based inventory tracking. The product had to serve multiple user types — shift leads, cooks, and inventory managers — each with different tasks and different levels of technical familiarity. Without direct client input on feature priorities, the team had to infer scope from the client's existing inventory sheets and what the user testing revealed.

## My Role

Contributed to scoping decisions, test design, and iteration prioritization. I was involved in the core tradeoff discussions around information density and helped shape the redesign after user testing findings came in.

## Approach

- **Working from existing artifacts:** The real restaurant inventory list gave us the data model. We used it to define categories (meats, cheeses, carbohydrates, seasonings, produce, beverages) as the primary navigation structure, which grounded the design in how the kitchen already organized its thinking.
- **Naming the hard tradeoffs early:** Two structural questions shaped the whole design. First: should multi-location items (e.g., meatballs stored in both the walk-in and kitchen freezer) be one entry or two? Second: how much supplementary information per item — table, collapsible list, or cards? We resolved both in favor of what reduced clicks during high-pressure service, not what was architecturally clean.
- **Prioritizing daily workflows over edge cases:** The hi-fi focused on three recurring tasks: checking stock status, scanning for expiring items, and making quick restock decisions. Manager-level reporting and customization were deferred to future directions.
- **Testing-informed redesign:** User testing revealed cognitive overload on the initial flat list. The key product decision was splitting the home screen into a category-select screen and a per-category item list. This added one tap but eliminated scroll fatigue and the disorientation users felt losing track of item type mid-scroll.
- **Two-button triage system:** Added a "Red Stock Button" (surfacing all low/critical/out-of-stock items) and "Green Updates Button" (qualitative updates: deliveries, events, manager notes) to the home screen. This gave users an at-a-glance urgency signal before they drilled into any category.

## Outcome

Delivered a low-fidelity and high-fidelity Figma prototype [CONFIRM: was prototype presented to Val's Kitchen directly?]. The redesigned hi-fi addressed all major usability pain points from testing. Future direction documented: handoff to engineers for a live database with real-time updates from users, managers, and suppliers.

## Reflection

The most valuable constraint was having real inventory data to work from rather than making up a fake product list. It kept the team honest about the actual complexity of the problem and prevented us from designing for an idealized kitchen that doesn't exist.
