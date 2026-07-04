# Val's Kitchen Software — UX Design

**Summary:** Co-designer on a Figma-prototyped inventory management app for a restaurant kitchen, iterated through two rounds of user testing. COGS 187A, [CONFIRM: quarter/year].

---

## Context

Restaurant kitchens operate under intense time pressure — a shift lead needs to find an ingredient, check its freshness, or flag a restock in seconds, not minutes. The design had to serve multiple roles (shift leads, cooks, inventory managers) from a single interface without requiring training time or adding cognitive load to an already demanding environment.

## My Role

Co-designer on the team. I contributed to the initial layout and visual key design, participated in the Figma lo-fi and hi-fi build, and drove several of the component-level redesign decisions after user testing.

## Approach

- **Category-first home screen:** The initial lo-fi used a flat, scrollable list of all items — which caused scroll fatigue and made it hard for users to hold their place. The redesigned home screen shows categories (Faux Meats, Faux Cheeses, Produce, Seasonings, etc.) as tappable tiles. Users select a category first, then see only the items in that category. One extra tap, meaningfully less cognitive load.
- **Freshness color tags:** Each item card shows a color-coded freshness indicator: green (fresh), blue (expiring soon), red (expired). This lets a shift lead scan the Faux Cheeses screen in a few seconds during service without opening individual items, and immediately spot what needs action.
- **Red Stock and Green Updates buttons:** Two persistent home-screen buttons give users a shortcut to urgency. Red shows all items at critical/low/zero stock. Green shows qualitative updates (deliveries, manager notes). The numerical badge on each button communicates urgency without requiring navigation.
- **Inline edit popup:** Tapping any item opens a popup with the full detail view plus editable fields — stock quantity, location, prep date. This allows updates without navigating away from the category screen, which matches the workflow of someone standing in the kitchen with a quick change to make.
- **Location flexibility:** The edit popup lets users add or modify storage locations per item (e.g., walk-in freezer, small fridge), resolving the multi-location problem that the original flat design couldn't accommodate cleanly.

## Outcome

A low-fidelity and high-fidelity Figma prototype that addressed the main usability problems found in testing: cognitive overload, scroll fatigue, unclear color-coded labels, and undersized icons. The color and icon language was simplified and made more consistent across the hi-fi. [CONFIRM: Figma link shareable for portfolio — link is in the writeup but verify access settings]

## Reflection

The biggest design lesson here was that information density is a function of context, not just content volume. The same amount of information that's fine on a desktop dashboard is genuinely unusable in a fast-paced kitchen. Designing for the environment, not just the user, changed every layout decision we made.
