# Research Demo Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three concise, visually rich, interactive research-direction subpages without duplicating the paper showcase.

**Architecture:** Extend the existing hash-driven single-page navigation with nested research routes and an `activeResearch` state. Keep demo behavior local and deterministic in three focused React components collected in `ResearchDemos.tsx`; no model API, uploads, or persistence are required.

**Tech Stack:** React, TypeScript, CSS/SVG, Vinext, Node test runner.

## Global Constraints

- Preserve the current editorial visual system and persistent navigation.
- Research details use `#research/<slug>` hashes and support browser back/forward.
- Demo pages remain concise and do not map to the paper cards.
- Label every experience as an interactive conceptual demo.
- Avoid paid APIs and backend inference.
- Respect reduced-motion preferences and keyboard accessibility.

---

### Task 1: Nested research navigation

- [ ] Add failing assertions for three research slugs, detail state, back navigation, and route parsing.
- [ ] Add bilingual research-detail copy.
- [ ] Implement nested research selection and history behavior.
- [ ] Verify focused tests pass.

### Task 2: Three interactive demos

- [ ] Add failing assertions for the evidence scanner, robustness controls, and latent control sliders.
- [ ] Implement `VisualEvidenceDemo`, `VlmRobustnessDemo`, and `GenerativeControlDemo`.
- [ ] Add accessible labels and deterministic state transitions.
- [ ] Verify type checking and focused tests pass.

### Task 3: Visual refinement and publication

- [ ] Style the research index as a true entry surface and each detail page as a distinct experience.
- [ ] Validate responsive behavior and reduced motion.
- [ ] Run build, lint, and the complete test suite.
- [ ] Publish and verify the public `peanut-ai.dev` deployment.

