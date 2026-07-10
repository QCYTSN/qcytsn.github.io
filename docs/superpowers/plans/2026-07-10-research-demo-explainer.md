# Research Demo Explainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Emphasize the research-index return action and add a compact bilingual disclosure that explains every conceptual demo.

**Architecture:** Keep explanation copy in the existing bilingual content model and render one reusable native `details` component after `ResearchDemo`. Extend the existing editorial CSS system for the outlined return pill, disclosure states, three-column explanation layout, and mobile stacking.

**Tech Stack:** React 19, TypeScript, native HTML disclosure semantics, CSS, Node test runner.

## Global Constraints

- The explanation is collapsed by default.
- Each demo explanation contains `What to observe`, `Try this`, and `Why it happens` in English and Chinese.
- Use native `<details>` and `<summary>` without adding a JavaScript state dependency.
- Preserve hash navigation, current research demos, bilingual switching, reduced-motion behavior, and the existing editorial visual language.
- Publish to the existing public Site after all checks pass.

---

### Task 1: Bilingual explanation content and disclosure structure

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `app/content.ts`
- Modify: `app/PortfolioExperience.tsx`

**Interfaces:**
- Consumes: each research interest selected by `activeResearch` and `selectedResearch`.
- Produces: `demoGuideLabel`, `demoGuideHeadings`, and `interest.guide`, rendered by `.demo-explainer`.

- [ ] **Step 1: Write the failing test**

Add assertions requiring both bilingual labels, three explanation fields per interest, `<details className="demo-explainer">`, `<summary>`, and placement after `<ResearchDemo>`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/portfolio-content.test.mjs`

Expected: FAIL because `demoGuideLabel` and `.demo-explainer` do not exist.

- [ ] **Step 3: Write minimal implementation**

Add bilingual copy to `content.ts`. Render:

```tsx
<details className="demo-explainer">
  <summary><span>{content.demoGuideLabel}</span><i aria-hidden="true" /></summary>
  <div className="demo-explainer-content">
    {content.demoGuideHeadings.map((heading, index) => (
      <section key={heading}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h3>{heading}</h3>
        <p>{selectedResearch.guide[index]}</p>
      </section>
    ))}
  </div>
</details>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/portfolio-content.test.mjs`

Expected: all content tests PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/portfolio-content.test.mjs app/content.ts app/PortfolioExperience.tsx
git commit -m "Add bilingual research demo explanations"
```

### Task 2: Return control and disclosure styling

**Files:**
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `.research-back`, `.demo-explainer`, native `[open]` state.
- Produces: emphasized return pill, rotating chevron, animated disclosure content, responsive three-to-one-column explanation layout.

- [ ] **Step 1: Write the failing style test**

Require `.research-back` to have a border and background treatment, and require `.demo-explainer`, `.demo-explainer[open]`, `.demo-explainer-content`, and a mobile override.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/portfolio-content.test.mjs`

Expected: FAIL because explainer CSS is absent.

- [ ] **Step 3: Write minimal styles**

Style the return link as a cobalt-outlined pill with a pale cobalt background and 10px monospace label. Style the disclosure as a bordered strip separated from the demo by 26px, rotate its CSS chevron on `[open]`, use three equal content columns on desktop, and stack them below 820px.

- [ ] **Step 4: Verify focused and full checks**

Run: `node --test tests/portfolio-content.test.mjs && npm test && npm run lint`

Expected: all tests, build, typecheck, and lint PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/portfolio-content.test.mjs app/globals.css
git commit -m "Style research navigation and demo explainers"
```

### Task 3: Publish the verified update

**Files:**
- No source changes.

**Interfaces:**
- Consumes: passing production build and the existing Sites project identity.
- Produces: one immutable public checkpoint available at `peanut-ai.dev`.

- [ ] **Step 1: Create a checkpoint deployment**

Run the Sites checkpoint command with message `Add collapsible research demo explanations` and reuse the user's approval to publish this existing public Site.

- [ ] **Step 2: Monitor immutable deployment IDs**

Use exactly one deployment monitor until the checkpoint reaches `succeeded` or `failed`.

- [ ] **Step 3: Verify in the main conversation**

Call deployment status directly with the same project, version, and deployment IDs. Report `https://peanut-ai.dev` only after authoritative success.

