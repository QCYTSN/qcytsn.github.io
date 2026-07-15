# Semantic Interaction Refinement Design

**Date:** 2026-07-15

**Status:** Approved

**Product:** Fengkai Gao research portfolio

**Primary deployment:** `https://peanut-ai.dev`

## Goal

Refine the existing academic editorial portfolio so that its motion and interactions feel intentional, responsive, and premium without turning the site into a motion showcase or an interactive toy.

The approved direction is **semantic interaction enhancement supported by restrained visual polish**. Every new motion must explain hierarchy, confirm an action, or demonstrate a research concept.

## Confirmed Constraints

- Preserve the current paper-toned editorial layout, Georgia display typography, cobalt technical graphics, rust accent, indexed navigation, and bilingual content.
- Preserve the opening loader and its overall visual design.
- Preserve the conceptual visual style of all three research demos.
- Preserve the cat illustration in the controllable-generation demo.
- Do not bind the three research-direction demos to individual papers; they represent ongoing interests.
- Do not add custom cursors, infinite marquees, scroll hijacking, kinetic typography, large scroll parallax, or unrelated decorative animation.
- Shorten cross-view navigation transitions.
- Improve mobile Profile spacing and typography.
- Improve functional small type, accent contrast, and mobile target sizes.
- Improve project imagery only with sufficiently sharp, academically authentic material.

## Design Principles

1. **One action, one readable result.** A control must change a specific visual property that visitors can identify without reading instructions.
2. **One primary continuous animation per viewport.** Supporting loops remain subtle or pause when their section is not active.
3. **Motion communicates continuity.** Elements move between states instead of disappearing and restarting wherever practical.
4. **Research remains the subject.** Interaction demonstrates vision, evaluation, and generation concepts; it does not compete with the portfolio content.
5. **Desktop and mobile express the same idea differently.** Hover and spatial exploration become explicit tap targets on touch devices.

## Motion System

Use a small shared motion vocabulary rather than component-specific timing.

| Role | Duration | Intended use |
|---|---:|---|
| Immediate feedback | 160–200ms | Buttons, focus, active indicators, small color changes |
| Component state | 280–360ms | Demo outputs, cards, relation paths, controls |
| View transition | 500–600ms total | Cobalt mask, view replacement, content entrance |

Use the existing expressive ease-out curve for entrances. Use a simpler ease-in-out curve for reversible control changes. Avoid elastic or spring overshoot.

The current cross-view flow should retain the cobalt split mask but remove the perceived pause:

1. Mask closes in approximately 180ms.
2. Active view changes as soon as the mask covers the content.
3. Mask opens while the new view enters over approximately 300–360ms.
4. New content moves 12–16px, reduced from the current 22px.
5. The active navigation dot travels to the new row instead of independently fading in.

The opening loader is excluded from these timing changes and remains visually intact.

## Homepage Neural Field

### Purpose

Turn the Neural Field from a passive parallax illustration into a compact research map without adding a separate panel or making the hero feel like a game.

### Semantic nodes

Three existing core nodes represent:

- Computer Vision & Visual Reasoning
- Vision-Language Model Evaluation
- Controllable Generative Models

Each node has a stable hit target and a bilingual accessible label.

### Desktop interaction

1. Pointer proximity continues to produce restrained depth movement.
2. When the pointer enters a core node's influence region, that node brightens and grows slightly.
3. Only the path connected to the active node receives a sequential signal highlight; unrelated edges fade modestly.
4. The top-right readout changes from the generic model state to the research direction name and one short descriptor.
5. Clicking the active node opens the matching research detail route.
6. Keyboard focus produces the same state, and Enter or Space opens the route.

The front layer's maximum rotation decreases from roughly 11 degrees to 6–8 degrees. The moving signal and core-node pulse remain. Tensor-cell breathing and non-core halo motion become quieter so interaction is visually dominant.

### Mobile interaction

Hover proximity is replaced with three compact direction selectors aligned with the bottom readout. The first tap selects and previews a direction; tapping the selected direction opens its research detail. The Neural Field may be reduced to approximately 400–430px high and defaults to a calmer state.

### Accessibility and fallback

- Core-node controls must be real buttons or links, not pointer-only SVG regions.
- Focus styling must remain clearly visible against the cobalt field.
- With reduced motion, depth rotation and moving signals stop; node selection, readout changes, and navigation still work immediately.
- The existing decorative layers remain hidden from assistive technology while the semantic controls expose concise names.

## Research Demos

All three demos keep their existing visual identity, toolbar, borders, colors, and conceptual nature. Enhancements should replace weak feedback rather than add panels or metrics.

### Visual Reasoning Demo

Keep the scanner and Plot/Trend/Caption controls.

- Change free pointer-following into deliberate pointer drag on desktop and touch drag on mobile.
- Selecting an entity gently moves or snaps the scan boundary toward the relevant region.
- The selected evidence box gains emphasis; unrelated boxes decrease in opacity.
- Connected relation paths draw in sequence over 280–360ms.
- The bottom readout updates to a concise relationship such as `Trend → supports → Plot`.
- Do not add a new explanation card; the existing readout carries the result.

### VLM Evaluation Demo

Keep Blur, Compression, Occlusion, severity, answer, confidence, and diagnosis.

Replace the binary visual switch with three derived phases:

- **Stable:** answer grounded, cobalt response area.
- **Uncertain:** confidence is near the failure threshold; cobalt mixes subtly toward rust and the diagnosis signals weakening evidence.
- **Failed:** answer changes, rust response area, failed diagnosis.

Add a thin threshold mark to the range control and a compact Reset action. The threshold remains mode-specific. State changes should be continuous except for the intentional answer change at failure. Updated answer and diagnosis text use an `aria-live` region.

Do not add more charts, scores, or benchmark controls.

### Controllable Generative Models Demo

Keep the cat, prompt tokens, three sliders, spatial box, attention overlay, and spectrum.

Make each slider control one visually distinct channel:

- **Denoising progress:** noise density, silhouette clarity, and background stability.
- **Structure guidance:** spatial-box alignment and how accurately the selected attribute lands on the intended region.
- **Texture energy:** fur detail, local edge sharpness, highlight strength, and spectrum amplitude.

Prompt-token changes first concentrate the attention region, then settle the corresponding hat, scarf, or light attribute onto the cat over approximately 280ms. Avoid bounce, particle bursts, or additional overlays.

The visual difference between 20%, 50%, and 80% must be immediately recognizable while preserving a coherent illustration at every value.

## Project Cards and Image Quality

Retain the current three-project structure and cobalt card frames.

Prefer a clean method, architecture, or result figure as the default card image when it meets quality requirements. Existing pipeline images are suitable at the current desktop card width, but assets should be visually checked at 1x and 2x density.

If an existing raster is insufficient, render the relevant PDF page at 300–400 DPI and crop from that output. Do not use operating-system screenshots or stretch low-resolution crops.

The paper cover remains a valid fallback and may appear as a restrained hover/focus alternate when both images are available. Project cards must remain understandable without hover.

On mobile, avoid a 430px portrait document dominating the first viewport. Method/result imagery should use a shorter consistent aspect ratio. A cover fallback may use a reduced frame height while retaining `object-fit: contain`.

## Profile Refinement

Preserve the dark closing section and its information architecture.

- Increase mobile internal horizontal padding from 17px to approximately 24px.
- Use a 40–42px mobile Profile title with the existing tight editorial line height.
- Preserve 16px body copy with comfortable line height.
- Prevent awkward email and institution wrapping through grid sizing and controlled break opportunities.
- Give Email and GitHub links at least a 44px interactive height.
- Use only a restrained grid-line reveal and content fade; do not introduce a new background animation.

## Typography and Color

- Reserve 8px monospace text for decorative indexes and diagram annotations.
- Raise functional labels, demo controls, links, and instructions to 10–12px as space permits.
- Retain the current serif/sans/monospace roles.
- Darken the rust used for small functional text so it reaches at least 4.5:1 contrast against the paper background. The current `#b45b3c` may remain for large shapes or non-text accents.
- Keep cobalt as the sole primary interaction color.

## Component Boundaries

### `PortfolioExperience`

Continues to own language and active-route state. It supplies a route-selection callback to the Neural Field and uses the shortened shared view-transition timings.

### `NeuralField`

Owns pointer proximity, focused node, and visual depth. It receives bilingual direction metadata and an `onSelectResearch(id)` callback. Its semantic controls remain isolated from decorative layers.

### `ResearchDemos`

Each demo continues to own its local controls. Derived presentation state is calculated from those controls:

- Visual Evidence: `scan`, `selectedEntity`.
- VLM Evaluation: `corruption`, `severity`, derived `phase` and confidence.
- Generative Control: `token`, `denoising`, `structure`, `texture`.

Shared styling and motion tokens may be extracted, but the three demos should not be forced into one generic component.

## Performance and State Handling

- Pause continuous decorative animation when its view is inactive or the document is hidden.
- Pointer-driven visual updates should use direct CSS custom properties or animation-frame scheduling to avoid unnecessary React renders.
- Route changes must leave the final destination encoded in the existing hash structure.
- Browser Back and Forward must restore the correct main view or research detail.
- Language switching keeps the current logical view and selected demo state.
- Reduced-motion mode removes continuous movement and transitions without removing functionality.

## Verification and Acceptance Criteria

### Visual and interaction

- Opening loader remains visually unchanged.
- Full cross-view transition completes within 500–600ms under normal motion.
- Neural Field exposes three understandable, keyboard-accessible research targets.
- Each target previews the correct direction and opens the correct research route.
- Each demo control causes an obvious but restrained visual response.
- Generative controls produce clearly different 20%, 50%, and 80% states while keeping the cat.
- Mobile Profile has visibly more internal space and no awkward horizontal clipping.
- Project images remain sharp at desktop and mobile presentation sizes.

### Responsive and accessibility

- Verify at 1440×1000, 1024×768, 390×844, and 360×800.
- No horizontal page overflow.
- All mobile controls meet or exceed a 44px effective target size.
- Focus order and focus visibility remain logical across navigation, Neural Field, demos, and Profile links.
- English and Simplified Chinese remain complete, and the document language updates correctly.
- Reduced motion preserves every action with near-instant state changes.
- Verify keyboard, pointer, touch emulation, hash deep links, Back/Forward, and console cleanliness.

## Out of Scope

- Replacing or redesigning the opening loader.
- Replacing the generative-demo cat with paper imagery.
- Connecting demos to real model inference.
- Adding new routes, papers, biography content, analytics, or authentication.
- Rebuilding the site's design system or changing its core editorial identity.
- Adding MotionSites-style motion density, custom cursors, or decorative scroll effects.
