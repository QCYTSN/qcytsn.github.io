# Research Demo Explainer Design

## Goal

Make the route back to the research index immediately discoverable and help visitors understand each conceptual demo without interrupting exploration.

## Navigation treatment

The existing `Research index` link becomes a compact outlined pill. It uses the site's cobalt accent, a slightly larger monospace label, and a restrained hover translation. It remains above the research-detail heading and keeps its current hash-navigation behavior.

## Demo explainer

Each research demo is followed by one native disclosure panel. The panel is collapsed by default and exposes a single bilingual prompt: `How to read this demo` / `如何理解这个演示`. A chevron points right while closed and rotates downward when open.

The expanded content contains three short fields:

1. **What to observe** — identifies the visual response worth watching.
2. **Try this** — explains which control or pointer action reveals the behavior.
3. **Why it happens** — gives a concise conceptual explanation of the mechanism.

The three directions receive distinct explanations:

- Visual reasoning: scanner position reveals the transition from pixels to structured entities and relations; selecting an entity changes the active evidence relation.
- VLM evaluation: increasing blur, compression, or occlusion reduces usable visual evidence; after a mode-specific threshold the simulated response and diagnosis fail.
- Controllable generation: denoising suppresses residual noise, structure guidance strengthens spatial adherence, texture energy changes high-frequency appearance, and prompt tokens redirect the controlled attribute.

## Interaction and accessibility

Use native `<details>` and `<summary>` elements so keyboard activation and expanded state work without additional JavaScript. The summary receives a visible focus style. Motion is limited to the chevron rotation and content reveal and respects the existing reduced-motion rule.

## Responsive behavior

On desktop, the three explanation fields form three columns. On smaller screens they stack vertically. The collapsed row remains one compact line at every width.

## Testing

Static content tests verify:

- bilingual explainer labels and all three explanation sets exist;
- the research detail renders the explainer directly after `ResearchDemo`;
- native disclosure semantics are used;
- CSS contains the emphasized return button and responsive explainer layout.

