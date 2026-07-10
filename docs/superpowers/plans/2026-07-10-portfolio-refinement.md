# Portfolio Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Fengkai Gao's existing academic portfolio into a bilingual, full-screen, research-led experience with refined motion, complete profile information, and architecture-led paper cards.

**Architecture:** Keep the existing single-page Vinext application and its static paper assets. Move the interactive experience into one client component that owns language state, the entry loader, and intersection-based section reveals; keep all verified bilingual copy in a typed content module and preserve static PDF links.

**Tech Stack:** React, TypeScript, Vinext/Next-compatible components, CSS animations, Node test runner, Sites hosting.

## Global Constraints

- Replace “AI Student” with “Researcher”.
- Preserve the academic editorial foundation while making it less template-like.
- Hero fills the first viewport and includes navigation plus a contact button.
- Profile includes email, school, major, coursework, research interests, and GitHub.
- Show exactly three completed papers; exclude AutoDraftman, grades, and awards.
- Use paper methodology or architecture figures as project visuals.
- Support English and Simplified Chinese switching.
- Motion must feel natural and must respect `prefers-reduced-motion`.

---

### Task 1: Bilingual content contract

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `app/content.ts`

- [ ] Add failing assertions for bilingual navigation, Researcher positioning, complete profile labels, three completed papers, and architecture image paths.
- [ ] Run `npm test -- tests/portfolio-content.test.mjs` and confirm the new assertions fail.
- [ ] Replace the content object with verified English and Chinese variants while keeping shared URLs and assets stable.
- [ ] Run the content tests and confirm they pass.

### Task 2: Interactive full-screen experience

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Create: `app/PortfolioExperience.tsx`
- Modify: `app/page.tsx`

- [ ] Add failing assertions for the language control, contact CTA, loader, reveal system, and client experience component.
- [ ] Run the focused test and confirm failure for the missing UI.
- [ ] Implement language state, entry transition, section reveal observation, accessible navigation, and the complete page structure.
- [ ] Reduce `app/page.tsx` to the server entry that renders the client experience.
- [ ] Run focused tests and confirm they pass.

### Task 3: Architecture-led visual system

**Files:**
- Create: `public/images/papers/semantic-figure-pipeline.png`
- Create: `public/images/papers/detection-guided-pipeline.png`
- Create: `public/images/papers/dynamic-freeu-pipeline.png`
- Modify: `app/globals.css`

- [ ] Extract clean methodology figures from the supplied papers.
- [ ] Implement the full-height asymmetric hero, editorial typography, paper figure cards, refined profile grid, and responsive layouts.
- [ ] Add entry-mask, stagger, section reveal, figure hover, and anchor transition motion with reduced-motion fallbacks.
- [ ] Run the complete test suite.

### Task 4: Render and publish verification

**Files:**
- Modify: `tests/rendered-html.test.mjs`

- [ ] Add rendered-output assertions for both languages, contact information, paper links, and excluded content.
- [ ] Build the production artifact and run the complete test suite.
- [ ] Start an agent preview and verify desktop/mobile layout, language switching, navigation, motion, PDFs, and console cleanliness.
- [ ] Create and verify a new deployed checkpoint while preserving the existing access policy.

