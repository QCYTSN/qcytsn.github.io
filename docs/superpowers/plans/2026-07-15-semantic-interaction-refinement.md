# Semantic Interaction Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add purposeful research-direction interaction, clearer demo feedback, sharper project visuals, and restrained responsive polish without changing the portfolio's academic editorial identity or opening loader.

**Architecture:** Keep `PortfolioExperience` as the route and language owner, make `NeuralField` a controlled research selector, and keep each research demo locally stateful with explicit derived presentation states. Centralize motion timing and interaction colors in CSS custom properties, preserve the existing hash routes, and verify behavior with the repository's Node tests plus Playwright-driven visual and interaction checks before a Sites deployment.

**Tech Stack:** React 19, TypeScript 5.9, Vinext/Next-compatible components, CSS custom properties and animations, Node test runner, Playwright with system Chrome for QA, OpenAI Sites.

## Global Constraints

- Preserve the current opening loader and its overall visual design.
- Preserve the paper-toned editorial layout, Georgia display typography, cobalt technical graphics, rust accent, indexed navigation, and bilingual content.
- Preserve the conceptual style of all three research demos and preserve the cat in the controllable-generation demo.
- Keep demos independent from individual paper projects.
- Do not add custom cursors, infinite marquees, scroll hijacking, kinetic typography, large scroll parallax, or unrelated decorative animation.
- Normal view transitions must complete within 500–600ms; reduced-motion transitions must be effectively immediate.
- Keep the existing hashes: `#home`, `#projects`, `#research`, `#profile`, and `#research/<research-id>`.
- Maintain English and Simplified Chinese behavior.
- Mobile functional targets must have an effective size of at least 44px.
- Use existing project assets or PDF renders at 300–400 DPI; never stretch a low-resolution crop.
- Preserve the current public Sites project ID from `.openai/hosting.json` and preserve its access policy.

---

## File Structure

- Modify `app/PortfolioExperience.tsx`: route timing, direction metadata passed to `NeuralField`, document visibility state, and active navigation marker.
- Modify `app/NeuralField.tsx`: semantic direction buttons, active-node state, pointer proximity, keyboard behavior, mobile two-step selection, and direction-specific signal path/readout.
- Modify `app/ResearchDemos.tsx`: deliberate evidence dragging, VLM phases/reset/live status, and stronger independent generative-control mappings.
- Modify `app/content.ts`: bilingual short direction descriptors and project visual paths.
- Modify `app/globals.css`: shared motion tokens, navigation marker, Neural Field states, demo feedback, project figure proportions, Profile spacing, typography, contrast, target sizes, and animation pausing.
- Modify `tests/portfolio-content.test.mjs`: source-level contracts for every new interaction and visual rule.
- Modify `tests/rendered-html.test.mjs`: server-rendered identity, route, image, and accessible-control presence where available before hydration.
- Create `docs/superpowers/plans/2026-07-15-semantic-interaction-refinement.md`: this execution plan only.

---

### Task 1: Shared Motion System and Faster View Transitions

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `app/PortfolioExperience.tsx:9-80`
- Modify: `app/globals.css:3-18,69-73,115-137`

**Interfaces:**
- Consumes: existing `ViewId`, `activeView`, `showRoute`, and `.view-transition` structure.
- Produces: `VIEW_COVER_MS`, `VIEW_RELEASE_MS`, `--motion-fast`, `--motion-state`, `--motion-view`, and `.nav-active-marker` used by later visual QA.

- [ ] **Step 1: Add failing motion-contract tests**

Append this test to `tests/portfolio-content.test.mjs`:

```js
test("view navigation uses one restrained motion system", () => {
  assert.match(experience, /const VIEW_COVER_MS = 180/);
  assert.match(experience, /const VIEW_RELEASE_MS = 40/);
  assert.match(experience, /className="nav-active-marker"/);
  assert.match(experience, /--nav-index/);
  assert.match(css, /--motion-fast:\s*180ms/);
  assert.match(css, /--motion-state:\s*320ms/);
  assert.match(css, /--motion-view:\s*360ms/);
  assert.match(css, /\.view-panel\.is-active[^}]*var\(--motion-view\)/s);
  assert.match(css, /\.nav-active-marker[^}]*transition:/s);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
node --test --test-name-pattern="view navigation uses one restrained motion system" tests/portfolio-content.test.mjs
```

Expected: FAIL because `VIEW_COVER_MS`, the motion tokens, and `.nav-active-marker` do not exist.

- [ ] **Step 3: Add exact route timing constants and marker markup**

In `app/PortfolioExperience.tsx`, place these constants after `researchHashes`:

```tsx
const VIEW_COVER_MS = 180;
const VIEW_RELEASE_MS = 40;
```

Replace the hard-coded transition delays inside `showRoute`:

```tsx
window.setTimeout(() => {
  setActiveView(next);
  setActiveResearch(next === "research" ? research : null);
  if (updateHistory) {
    window.history.pushState(null, "", research ? researchHashes[research] : `#${next}`);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  window.setTimeout(() => setTransitioning(false), VIEW_RELEASE_MS);
}, VIEW_COVER_MS);
```

Inside `.view-navigation > div`, before mapping the navigation items, add:

```tsx
<i
  className="nav-active-marker"
  aria-hidden="true"
  style={{ "--nav-index": viewIds.indexOf(activeView) } as React.CSSProperties}
/>
```

- [ ] **Step 4: Define shared timings and continuous marker CSS**

Add to `:root` in `app/globals.css`:

```css
--motion-fast: 180ms;
--motion-state: 320ms;
--motion-view: 360ms;
--ease-state: cubic-bezier(.4, 0, .2, 1);
```

Update transition rules:

```css
.view-transition span {
  background: var(--cobalt);
  transform: scaleX(0);
  transition: transform var(--motion-fast) cubic-bezier(.75,0,.25,1);
}

.view-panel.is-active {
  display: block;
  animation: view-enter var(--motion-view) var(--ease-out) both;
}

@keyframes view-enter {
  from { opacity: 0; transform: translateY(14px); clip-path: inset(0 0 4% 0); }
  to { opacity: 1; transform: none; clip-path: inset(0); }
}

.view-navigation > div { position: relative; }
.nav-active-marker {
  width: 6px;
  height: 6px;
  position: absolute;
  right: 7px;
  top: calc((var(--nav-index) + .5) * 25% - 3px);
  z-index: 2;
  border-radius: 50%;
  background: var(--cobalt);
  transition: top var(--motion-state) var(--ease-out);
  pointer-events: none;
}
.view-navigation a > i { opacity: 0; }
```

Inside `@media (max-width: 820px)`, add `.nav-active-marker { display: none; }` and retain the current text-only mobile active state.

- [ ] **Step 5: Run the focused and complete source tests**

Run:

```bash
node --test --test-name-pattern="view navigation uses one restrained motion system" tests/portfolio-content.test.mjs
node --test tests/portfolio-content.test.mjs
```

Expected: both commands PASS with zero failures.

- [ ] **Step 6: Commit Task 1**

```bash
git add app/PortfolioExperience.tsx app/globals.css tests/portfolio-content.test.mjs
git commit -m "feat: refine portfolio motion timing"
```

---

### Task 2: Semantic Neural Field Research Navigation

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `app/content.ts`
- Modify: `app/NeuralField.tsx`
- Modify: `app/PortfolioExperience.tsx:140-153`
- Modify: `app/globals.css:167-228,468-507`

**Interfaces:**
- Consumes: `ResearchId`, `content.interests`, and `showRoute("research", id, true)`.
- Produces: `NeuralDirection`, `NeuralFieldProps`, three semantic node controls, `activeDirection`, and `onSelectResearch(id: ResearchId)`.

- [ ] **Step 1: Add failing Neural Field interaction tests**

Append:

```js
test("the Neural Field exposes three semantic research destinations", () => {
  assert.match(neuralField, /export type NeuralDirection/);
  assert.match(neuralField, /directions:\s*readonly NeuralDirection\[\]/);
  assert.match(neuralField, /onSelectResearch:\s*\(id:\s*ResearchId\)\s*=>\s*void/);
  assert.match(neuralField, /className="neural-direction"/);
  assert.match(neuralField, /aria-pressed=/);
  assert.match(neuralField, /activeDirection/);
  assert.match(neuralField, /matchMedia\("\(hover: none\)"\)/);
  assert.match(neuralField, /event\.pointerType === "touch"/);
  assert.doesNotMatch(neuralField, /className={`neural-field[^>]*aria-hidden="true"/);
  assert.doesNotMatch(neuralField, /onKeyDown=/);
  assert.match(experience, /<NeuralField[\s\S]*?directions=/);
  assert.match(experience, /onSelectResearch=/);
  assert.match(css, /\.neural-direction/);
  assert.match(css, /\.neural-field\.has-active-direction/);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
node --test --test-name-pattern="Neural Field exposes three semantic" tests/portfolio-content.test.mjs
```

Expected: FAIL because the existing field has no direction props or semantic controls.

- [ ] **Step 3: Add bilingual short direction descriptors**

In each `content.interests` item in `app/content.ts`, add a `heroLabel` suitable for the compact Neural Field readout:

```ts
heroLabel: "Visual evidence → structured reasoning",
heroLabel: "Controlled corruption → model failure",
heroLabel: "Attention → controllable generation",
```

Use these Chinese equivalents in the same order:

```ts
heroLabel: "视觉证据 → 结构化推理",
heroLabel: "可控扰动 → 模型失效",
heroLabel: "注意力 → 可控生成",
```

- [ ] **Step 4: Define the Neural Field controlled interface and anchors**

In `app/NeuralField.tsx`, import `useState` and `ResearchId`, then add:

```tsx
import { useRef, useState, type PointerEvent } from "react";
import type { ResearchId } from "./ResearchDemos";

export type NeuralDirection = {
  id: ResearchId;
  label: string;
  summary: string;
};

type NeuralFieldProps = {
  directions: readonly NeuralDirection[];
  onSelectResearch: (id: ResearchId) => void;
};

const directionAnchors = [
  { x: 39, y: 34, path: "M92 92L178 58L234 184L192 304" },
  { x: 56, y: 42, path: "M178 58L270 108L338 226L398 318" },
  { x: 48, y: 67, path: "M124 212L234 184L286 360L360 468" },
] as const;
```

Change the component signature and state:

```tsx
export function NeuralField({ directions, onSelectResearch }: NeuralFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [activeDirection, setActiveDirection] = useState<number | null>(null);
```

- [ ] **Step 5: Implement proximity, focus, keyboard, and touch behavior**

Extend `onPointerMove` after setting the pointer custom properties:

```tsx
if (event.pointerType === "touch") return;
const px = ((event.clientX - bounds.left) / bounds.width) * 100;
const py = ((event.clientY - bounds.top) / bounds.height) * 100;
const nearest = directionAnchors
  .map((anchor, index) => ({ index, distance: Math.hypot(px - anchor.x, py - anchor.y) }))
  .sort((a, b) => a.distance - b.distance)[0];
setActiveDirection(nearest.distance <= 13 ? nearest.index : null);
```

Add this helper. Because each target is a native `button`, Enter and Space already dispatch its click behavior; do not add a second keyboard handler that would navigate twice.

```tsx
const activateDirection = (index: number) => {
  const touchOnly = window.matchMedia("(hover: none)").matches;
  if (touchOnly && activeDirection !== index) {
    setActiveDirection(index);
    return;
  }
  onSelectResearch(directions[index].id);
};

```

Update `resetPointer` so pointer departure resets depth but keeps a keyboard-focused or touch-selected node:

```tsx
const resetPointer = () => {
  fieldRef.current?.style.setProperty("--pointer-x", "0");
  fieldRef.current?.style.setProperty("--pointer-y", "0");
  const focusInside = fieldRef.current?.contains(document.activeElement);
  if (!focusInside && !window.matchMedia("(hover: none)").matches) setActiveDirection(null);
};
```

- [ ] **Step 6: Render direction-specific signal and semantic controls**

Use the selected path inside `.signal-path`:

```tsx
<path d={directionAnchors[activeDirection ?? 1].path} />
<circle r="4">
  <animateMotion
    dur="4.2s"
    repeatCount="indefinite"
    path={directionAnchors[activeDirection ?? 1].path}
  />
</circle>
```

Before `.neural-axis`, render:

```tsx
<div className="neural-directions">
  {directions.map((direction, index) => (
    <button
      key={direction.id}
      className="neural-direction"
      type="button"
      aria-pressed={activeDirection === index}
      style={{ left: `${directionAnchors[index].x}%`, top: `${directionAnchors[index].y}%` }}
      onPointerEnter={() => setActiveDirection(index)}
      onFocus={() => setActiveDirection(index)}
      onClick={() => activateDirection(index)}
    >
      <i aria-hidden="true" />
      <span>{direction.label}</span>
    </button>
  ))}
</div>
```

Change the root class and readout:

```tsx
className={`neural-field ${activeDirection !== null ? "has-active-direction" : ""}`}
```

Remove the current root `aria-hidden="true"`; the root now contains semantic controls. Keep purely decorative SVG and ambient layers non-interactive and unnamed.

```tsx
<div className="neural-readout" aria-live="polite">
  <span>{activeDirection === null ? "MODEL STATE" : directions[activeDirection].summary}</span>
  <strong>{activeDirection === null ? "ACTIVE" : directions[activeDirection].label}</strong>
  <i />
</div>
```

- [ ] **Step 7: Connect `PortfolioExperience` to research routing**

Replace `<NeuralField />` with:

```tsx
<NeuralField
  directions={content.interests.map((interest) => ({
    id: interest.slug,
    label: interest.title,
    summary: interest.heroLabel,
  }))}
  onSelectResearch={(id) => showRoute("research", id, true)}
/>
```

- [ ] **Step 8: Add restrained node styling and reduced depth**

In `app/globals.css`, reduce front-layer rotation to `7deg`, network rotation to `6deg`, and back-layer rotation to `4deg`. Add:

```css
.neural-directions { position: absolute; inset: 0; z-index: 14; pointer-events: none; }
.neural-direction {
  width: 30px;
  height: 30px;
  position: absolute;
  transform: translate(-50%,-50%);
  display: grid;
  place-items: center;
  color: #fff;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
}
.neural-direction > i {
  width: 10px;
  height: 10px;
  border: 1px solid rgba(255,255,255,.8);
  border-radius: 50%;
  background: rgba(40,80,216,.55);
  transition: transform var(--motion-state) var(--ease-out), background var(--motion-fast) ease;
}
.neural-direction > span {
  min-width: 150px;
  position: absolute;
  left: 20px;
  opacity: 0;
  transform: translateX(-6px);
  font: 9px/1.35 "Courier New", monospace;
  text-align: left;
  transition: opacity var(--motion-fast) ease, transform var(--motion-state) var(--ease-out);
  pointer-events: none;
}
.neural-direction[aria-pressed="true"] > i,
.neural-direction:hover > i,
.neural-direction:focus-visible > i { transform: scale(1.55); background: #fff; }
.neural-direction[aria-pressed="true"] > span,
.neural-direction:hover > span,
.neural-direction:focus-visible > span { opacity: 1; transform: none; }
.neural-field.has-active-direction .network-edges { opacity: .45; }
.neural-direction:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
```

Inside `@media (max-width: 560px)`, add the explicit touch layout:

```css
.hero-visual,
.neural-field { height: 430px; }
.neural-directions {
  inset: auto 14px 44px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}
.neural-direction {
  width: auto;
  min-width: 0;
  min-height: 44px;
  position: relative;
  inset: auto !important;
  transform: none;
  border: 1px solid rgba(255,255,255,.28);
}
.neural-direction > span {
  min-width: 0;
  position: static;
  opacity: 1;
  transform: none;
  text-align: center;
}
.neural-direction > i { display: none; }
```

- [ ] **Step 9: Run tests and typecheck**

```bash
node --test --test-name-pattern="Neural Field exposes three semantic" tests/portfolio-content.test.mjs
npm run typecheck
```

Expected: the focused test and TypeScript check PASS.

- [ ] **Step 10: Commit Task 2**

```bash
git add app/NeuralField.tsx app/PortfolioExperience.tsx app/content.ts app/globals.css tests/portfolio-content.test.mjs
git commit -m "feat: make neural field a research navigator"
```

---

### Task 3: Clearer Research Demo Feedback

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `app/ResearchDemos.tsx`
- Modify: `app/globals.css:302-390,424-507`

**Interfaces:**
- Consumes: existing demo-local states and bilingual `copy` object.
- Produces: deliberate evidence dragging, `VlmPhase`, reset and live region behavior, and independently visible generative channels.

- [ ] **Step 1: Add failing demo behavior tests**

Append:

```js
test("research demos use deliberate controls and readable derived states", () => {
  assert.match(researchDemos, /const \[dragging, setDragging\] = useState\(false\)/);
  assert.match(researchDemos, /setPointerCapture/);
  assert.match(researchDemos, /type VlmPhase = "stable" \| "uncertain" \| "failed"/);
  assert.match(researchDemos, /aria-live="polite"/);
  assert.match(researchDemos, /resetVlm/);
  assert.match(researchDemos, /uncertain: "Evidence is weakening"/);
  assert.match(researchDemos, /reset: "Reset"/);
  assert.match(researchDemos, /className={`model-pane phase-\$\{phase\}`}/);
  assert.match(css, /\.phase-uncertain/);
  assert.match(css, /\.vlm-threshold/);
  assert.match(css, /--attribute-offset/);
  assert.match(css, /--edge-clarity/);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
node --test --test-name-pattern="research demos use deliberate controls" tests/portfolio-content.test.mjs
```

Expected: FAIL because the current demos do not expose dragging, phases, reset, or the new visual variables.

- [ ] **Step 3: Make the evidence scanner deliberate**

In `VisualEvidenceDemo`, add:

```tsx
const [dragging, setDragging] = useState(false);
const entityScan = [43, 52, 81] as const;

const updateScan = (event: PointerEvent<HTMLDivElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  setScan(Math.max(8, Math.min(92, ((event.clientX - bounds.left) / bounds.width) * 100)));
};
```

Remove the unrestricted `onPointerMove` from the `.demo-stage` root. Put these handlers on `.evidence-canvas` so toolbar and control interactions never start a drag:

```tsx
onPointerDown={(event) => {
  event.currentTarget.setPointerCapture(event.pointerId);
  setDragging(true);
  updateScan(event);
}}
onPointerMove={(event) => { if (dragging) updateScan(event); }}
onPointerUp={() => setDragging(false)}
onPointerCancel={() => setDragging(false)}
```

Update entity buttons:

```tsx
onClick={() => {
  setSelected(index);
  setScan(entityScan[index]);
}}
aria-pressed={selected === index}
```

Give the existing relation path `key={selected}` so its restrained draw animation restarts only when the selected entity changes:

```tsx
<path key={selected} d="M322 106C392 72 510 72 574 107M520 232C554 220 570 208 588 192" className="evidence-links" />
```

- [ ] **Step 4: Add VLM stable, uncertain, and failed phases**

Before `VlmRobustnessDemo`, add:

```tsx
type VlmPhase = "stable" | "uncertain" | "failed";
```

Inside the component, replace `failed` derivation with:

```tsx
const uncertainThreshold = failureThreshold - 18;
const phase: VlmPhase = severity >= failureThreshold
  ? "failed"
  : severity >= uncertainThreshold
    ? "uncertain"
    : "stable";
const failed = phase === "failed";
const resetVlm = () => {
  setSeverity(24);
  setCorruption(0);
};
```

Extend the existing bilingual `copy` object in the same file:

```tsx
// en
uncertain: "Evidence is weakening",
reset: "Reset",

// zh
uncertain: "视觉证据正在减弱",
reset: "重置",
```

Change the model pane and live output:

```tsx
<div className={`model-pane phase-${phase}`}>
  <div className="model-status" aria-live="polite">
    <span>MODEL RESPONSE</span>
    <strong>{failed ? labels.wrong : labels.correct}</strong>
  </div>
```

Close `.model-status` before the confidence meter. Change the diagnosis value to `phase === "failed" ? labels.failed : phase === "uncertain" ? labels.uncertain : labels.stable`, and add `aria-live="polite"` to the diagnosis card.

Wrap the range input in `.range-track` and add the mode-specific threshold marker:

```tsx
<span className="range-track">
  <input type="range" min="0" max="100" value={severity} onChange={(event) => setSeverity(Number(event.target.value))} />
  <i className="vlm-threshold" style={{ left: `${failureThreshold}%` }} aria-hidden="true" />
</span>
```

Add this reset button after the corruption selector:

```tsx
<button className="demo-reset" type="button" onClick={resetVlm}>{labels.reset}</button>
```

- [ ] **Step 5: Make generative controls visibly independent**

Extend the `.generative-demo` inline style:

```tsx
style={{
  "--denoise": denoising / 100,
  "--structure": structure / 100,
  "--texture": texture / 100,
  "--attribute-offset": `${(50 - structure) * .18}px`,
  "--edge-clarity": `${Math.max(0, 1.6 - texture * .016)}px`,
} as React.CSSProperties}
```

Update CSS so each channel has an obvious role:

```css
.generated-portrait {
  transform: translate(-50%,-47%) scale(calc(.9 + var(--structure) * .1));
  filter: saturate(calc(.72 + var(--texture) * .55)) blur(var(--edge-clarity));
  transition: transform var(--motion-state) var(--ease-out), filter var(--motion-state) var(--ease-state);
}
.attribute-shape { translate: var(--attribute-offset) calc(var(--attribute-offset) * -.6); }
.noise-field { opacity: calc(1 - var(--denoise)); transition: opacity var(--motion-state) ease; }
.spatial-box {
  width: calc(235px + var(--structure) * 35px);
  height: calc(205px + var(--structure) * 25px);
  opacity: calc(.45 + var(--structure) * .55);
  transition: width var(--motion-state) var(--ease-state), height var(--motion-state) var(--ease-state), opacity var(--motion-state) ease;
}
.attention-heat { opacity: calc(.08 + var(--structure) * .72); transition: opacity var(--motion-state) ease; }
.spectrum i { opacity: calc(.45 + var(--texture) * .55); transition: height var(--motion-state) var(--ease-state), opacity var(--motion-fast) ease; }
```

Keep the existing cat and token-specific attribute shapes.

- [ ] **Step 6: Style phases, threshold, reset, relation emphasis, and mobile targets**

Add:

```css
.vision-box { transition: opacity var(--motion-fast) ease, fill var(--motion-state) ease, stroke-width var(--motion-fast) ease; }
.evidence-scanner:has(.entity-selector button[aria-pressed="true"]) .vision-box:not(.is-selected) { opacity: .32; }
.evidence-links { stroke-dasharray: 5 5; animation: evidence-link-draw var(--motion-state) linear both; }
@keyframes evidence-link-draw { from { stroke-dashoffset: 28; opacity: .2; } }

.model-pane.phase-uncertain { background: color-mix(in srgb, var(--cobalt) 68%, var(--rust)); }
.model-pane.phase-failed { background: #8f3d2a; }
.range-track { position: relative; display: block; }
.vlm-threshold { width: 1px; height: 14px; position: absolute; top: 50%; background: var(--rust); transform: translate(-50%,-50%); pointer-events: none; }
.demo-reset { min-height: 32px; padding: 0 12px; border: 1px solid var(--line); background: transparent; font: 10px "Courier New", monospace; cursor: pointer; }
```

In `@media (max-width: 560px)`, enforce `min-height: 44px` for `.entity-selector button`, `.corruption-selector button`, `.prompt-panel button`, `.demo-reset`, and `.research-back`; give range inputs a `44px` effective height.

- [ ] **Step 7: Run the focused test, full source test, and typecheck**

```bash
node --test --test-name-pattern="research demos use deliberate controls" tests/portfolio-content.test.mjs
node --test tests/portfolio-content.test.mjs
npm run typecheck
```

Expected: all commands PASS.

- [ ] **Step 8: Commit Task 3**

```bash
git add app/ResearchDemos.tsx app/globals.css tests/portfolio-content.test.mjs
git commit -m "feat: strengthen research demo feedback"
```

---

### Task 4: Project Figure Quality and Editorial Profile Polish

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/content.ts`
- Modify: `app/globals.css:230-252,392-404,424-507`

**Interfaces:**
- Consumes: existing pipeline PNG assets and current `paper.cover` rendering.
- Produces: pipeline-first project visuals, shorter mobile figure frames, improved Profile spacing, functional type sizes, and AA-compliant rust text.

- [ ] **Step 1: Add failing visual-source and polish tests**

Append to `tests/portfolio-content.test.mjs`:

```js
test("project figures and mobile profile use the approved polished presentation", () => {
  for (const asset of [
    "semantic-figure-pipeline.png",
    "detection-guided-pipeline.png",
    "dynamic-freeu-pipeline.png",
  ]) assert.match(content, new RegExp(asset.replace(".", "\\.")));
  assert.match(css, /--rust:\s*#98472f/i);
  assert.match(css, /\.paper-image-frame[^}]*aspect-ratio:\s*4\s*\/\s*3/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.profile-view[^}]*padding-inline:\s*24px/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.profile-intro h2[^}]*font-size:\s*42px/s);
  assert.match(css, /\.profile-item a[^}]*min-height:\s*44px/s);
});
```

Update the rendered asset expectations in `tests/rendered-html.test.mjs`:

```js
assert.match(html, /semantic-figure-pipeline\.png/);
assert.match(html, /detection-guided-pipeline\.png/);
assert.match(html, /dynamic-freeu-pipeline\.png/);
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
node --test --test-name-pattern="project figures and mobile profile" tests/portfolio-content.test.mjs
```

Expected: FAIL because content still references the portrait cover WebPs and the polish rules do not exist.

- [ ] **Step 3: Switch project visuals to the existing sharp pipeline assets**

In `app/content.ts`, set the three `cover` fields in project order:

```ts
cover: "/images/papers/semantic-figure-pipeline.png",
cover: "/images/papers/detection-guided-pipeline.png",
cover: "/images/papers/dynamic-freeu-pipeline.png",
```

Do not delete the paper-cover PNG or WebP assets; they remain valid fallbacks and downloadable-paper previews.

- [ ] **Step 4: Use a shorter, consistent project figure frame**

Replace fixed tall frame heights with:

```css
.paper-image-frame {
  width: 100%;
  aspect-ratio: 4 / 3;
  height: auto;
  padding: clamp(14px,1.7vw,24px);
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--paper-bright);
}
.paper-image-frame img { object-fit: contain; }
```

Remove the `390px` and `430px` mobile overrides for `.paper-image-frame`. Keep a single-column mobile card.

- [ ] **Step 5: Apply Profile, typography, and contrast refinements**

Change the root rust token:

```css
--rust: #98472f;
```

Add or update:

```css
.paper-contribution,
.research-entry > strong,
.research-detail-heading li,
.research-detail-heading > div:last-child > span,
.entity-selector button,
.corruption-selector button,
.prompt-panel button,
.robustness-controls label,
.generation-controls label { font-size: 10px; }

.profile-item a { min-height: 44px; align-items: center; }
```

Inside `@media (max-width: 560px)`:

```css
.profile-view { padding-inline: 24px; }
.profile-intro h2 { font-size: 42px; }
.profile-intro > p:last-child { font-size: 16px; line-height: 1.65; }
.profile-item { min-height: 135px; padding: 22px; }
.profile-email a { overflow-wrap: anywhere; }
```

- [ ] **Step 6: Run source tests**

```bash
node --test --test-name-pattern="project figures and mobile profile" tests/portfolio-content.test.mjs
node --test tests/portfolio-content.test.mjs
```

Expected: both commands PASS.

- [ ] **Step 7: Build before running rendered tests**

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: build exits 0 and all rendered HTML tests PASS.

- [ ] **Step 8: Commit Task 4**

```bash
git add app/content.ts app/globals.css tests/portfolio-content.test.mjs tests/rendered-html.test.mjs
git commit -m "feat: polish project figures and profile"
```

---

### Task 5: Visibility Pausing, History, and Reduced-Motion Integrity

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `app/PortfolioExperience.tsx`
- Modify: `app/globals.css:40,509-515`

**Interfaces:**
- Consumes: `activeView`, existing hash routing, and global reduced-motion CSS.
- Produces: `pageVisible`, `data-page-visible`, paused inactive animations, and explicit `popstate` handling.

- [ ] **Step 1: Add failing lifecycle tests**

Append:

```js
test("motion pauses offscreen and history restores portfolio routes", () => {
  assert.match(experience, /const \[pageVisible, setPageVisible\] = useState/);
  assert.match(experience, /visibilitychange/);
  assert.match(experience, /popstate/);
  assert.match(experience, /historyFrame/);
  assert.match(experience, /data-page-visible=/);
  assert.match(css, /\[aria-hidden="true"\][^{]*\*/);
  assert.match(css, /\[data-page-visible="false"\]/);
  assert.match(css, /animation-play-state:\s*paused/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
node --test --test-name-pattern="motion pauses offscreen" tests/portfolio-content.test.mjs
```

Expected: FAIL because page visibility and popstate are not handled explicitly.

- [ ] **Step 3: Add page visibility state**

In `PortfolioExperience`:

```tsx
const [pageVisible, setPageVisible] = useState(true);

useEffect(() => {
  const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
  syncVisibility();
  document.addEventListener("visibilitychange", syncVisibility);
  return () => document.removeEventListener("visibilitychange", syncVisibility);
}, []);
```

Add `data-page-visible={pageVisible}` to the root `<main>`.

- [ ] **Step 4: Restore route state on Back and Forward**

Replace the single `hashchange` registration with one shared, frame-coalesced handler. Browsers may emit both `popstate` and `hashchange` for one Back/Forward action; coalescing prevents duplicate transitions:

```tsx
let historyFrame = 0;
const handleHistoryChange = () => {
  window.cancelAnimationFrame(historyFrame);
  historyFrame = window.requestAnimationFrame(() => {
    const route = routeFromHash(window.location.hash);
    showRoute(route.view, route.research, false);
  });
};
window.addEventListener("hashchange", handleHistoryChange);
window.addEventListener("popstate", handleHistoryChange);
return () => {
  window.cancelAnimationFrame(initialFrame);
  window.cancelAnimationFrame(historyFrame);
  window.removeEventListener("hashchange", handleHistoryChange);
  window.removeEventListener("popstate", handleHistoryChange);
};
```

- [ ] **Step 5: Pause hidden animation without removing functionality**

Add:

```css
.view-panel[aria-hidden="true"] *,
.portfolio-page[data-page-visible="false"] * {
  animation-play-state: paused !important;
}
```

Keep the current `@media (prefers-reduced-motion: reduce)` block, including the hidden loader and immediate transition durations. Extend it so `.neural-layer` has `transform: none !important`, `.signal-path circle` is hidden, and all new motion-bearing selectors (`.nav-active-marker`, `.neural-direction > i`, `.neural-direction > span`, `.evidence-links`, `.model-pane`, `.generated-portrait`, `.attribute-shape`, `.spatial-box`, `.attention-heat`, `.noise-field`, and `.spectrum i`) use `animation-duration: .01ms !important` and `transition-duration: .01ms !important`. Selection, readouts, reset, and navigation must remain functional.

- [ ] **Step 6: Run lifecycle test, full test, and typecheck**

```bash
node --test --test-name-pattern="motion pauses offscreen" tests/portfolio-content.test.mjs
node --test tests/portfolio-content.test.mjs
npm run typecheck
```

Expected: all commands PASS.

- [ ] **Step 7: Commit Task 5**

```bash
git add app/PortfolioExperience.tsx app/globals.css tests/portfolio-content.test.mjs
git commit -m "feat: pause hidden portfolio motion"
```

---

### Task 6: Full Visual QA, Production Verification, and Sites Deployment

**Files:**
- Modify only if QA reveals a scoped defect: files from Tasks 1–5 and their matching tests.
- Verify: `.openai/hosting.json`
- Verify: all accepted screenshots in an external audit/output folder, not the repository.

**Interfaces:**
- Consumes: complete implementation from Tasks 1–5 and the opaque `project_id` in `.openai/hosting.json`.
- Produces: a verified commit, saved Sites version, and production deployment preserving the current public access policy.

- [ ] **Step 1: Run the complete local verification suite**

```bash
npm test
npm run lint
npm run validate:artifact
git diff --check
git status --short
```

Expected: all commands exit 0; `git status --short` is empty.

- [ ] **Step 2: Start the local application for browser QA**

On Windows PowerShell:

```powershell
$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'
npx vite --host 127.0.0.1
```

Expected: Vite reports a local URL and remains running without a fatal error.

- [ ] **Step 3: Capture and inspect required viewports with Playwright and system Chrome**

Use Playwright with `C:\Program Files\Google\Chrome\Application\chrome.exe`. For each accepted screenshot, wait for `.site-loader[data-active="false"]`, save the exact screenshot, and inspect it before acceptance.

Required viewports:

- 1440×1000 desktop
- 1024×768 compact desktop/tablet
- 390×844 mobile
- 360×800 small mobile

Required states:

- Loader
- Home idle
- Each Neural Field direction focused and selected
- Projects
- Research index
- Each research detail default state
- Visual Evidence after dragging and entity selection
- VLM stable, uncertain, failed, and reset states
- Generative controls at 20%, 50%, and 80% for each independent slider
- Profile
- Chinese Home, one Chinese research demo, and Chinese Profile
- Reduced-motion Home and one research demo

Expected: no blank, loading, cropped, or wrong-state screenshots; no horizontal page overflow.

- [ ] **Step 4: Verify interaction behavior with Playwright**

Automate these assertions:

```js
await page.locator('.neural-direction').nth(1).focus();
await expect(page.locator('.neural-direction').nth(1)).toHaveAttribute('aria-pressed', 'true');
await page.keyboard.press('Enter');
await expect(page).toHaveURL(/#research\/vlm-evaluation$/);

await page.goBack();
await expect(page).toHaveURL(/#home$/);
await page.goForward();
await expect(page).toHaveURL(/#research\/vlm-evaluation$/);

await page.locator('.corruption-selector button').nth(2).click();
await page.locator('.robustness-controls input[type="range"]').fill('82');
await expect(page.locator('.model-pane')).toHaveClass(/phase-failed/);
await page.locator('.demo-reset').click();
await expect(page.locator('.robustness-controls input[type="range"]')).toHaveValue('24');
```

Also verify language switching, all three project links, PDF links, GitHub, email, keyboard focus order, effective mobile target sizes, and zero `pageerror`/console errors.

- [ ] **Step 5: Fix only observed scoped defects with a red-green test**

For each defect:

1. Add a focused failing assertion to `tests/portfolio-content.test.mjs` or `tests/rendered-html.test.mjs`.
2. Run only that test and confirm failure.
3. Apply the smallest fix in the owning component or CSS rule.
4. Run the focused test, then `npm test`.
5. Recapture the affected viewport and compare it with the prior rejected screenshot.

- [ ] **Step 6: Commit any QA fixes**

If Step 5 changed files:

```bash
git add app tests
git commit -m "fix: resolve portfolio interaction qa findings"
```

If no files changed, do not create an empty commit.

- [ ] **Step 7: Push the exact verified source state**

```bash
git status --short
git rev-parse HEAD
git push origin HEAD
```

Expected: clean status and a successful push. Retain the exact commit SHA returned by `git rev-parse HEAD`.

- [ ] **Step 8: Save a Sites version from the exact pushed commit**

Read `.openai/hosting.json` and copy its `project_id` exactly. Create the source archive from the verified commit, not from a dirty worktree. Call `mcp__codex_apps__sites_save_site_version` with that exact `project_id`, commit SHA, and archive. Retain the returned opaque version ID and report the user-facing version number.

Expected: Sites returns a saved version whose source commit matches Step 7.

- [ ] **Step 9: Deploy the saved version and verify production**

Deploy only the saved version from Step 8 with `mcp__codex_apps__sites_deploy_site_version`. Preserve the existing public access mode; do not call access-update tools. Poll `mcp__codex_apps__sites_get_deployment_status` until terminal.

Expected: deployment status is successful and the live URL remains `https://peanut-ai.dev`.

- [ ] **Step 10: Run a production smoke test**

Open `https://peanut-ai.dev` with Playwright, wait for the retained loader, then verify:

- Home renders.
- A Neural Field direction opens its matching research hash.
- VLM severity changes its phase.
- Chinese switching updates `document.documentElement.lang` to `zh-CN`.
- Mobile Profile has no horizontal overflow.
- No console or page errors occur.

Expected: every smoke assertion passes against production.

---

## Final Handoff Checklist

- [ ] Report the production URL first.
- [ ] Report the deployed Sites version number and exact commit SHA.
- [ ] Summarize Neural Field, demo, project, Profile, typography, and motion changes.
- [ ] State the verification commands and browser viewports that passed.
- [ ] Name any remaining visual or accessibility limitation without claiming full WCAG compliance.
