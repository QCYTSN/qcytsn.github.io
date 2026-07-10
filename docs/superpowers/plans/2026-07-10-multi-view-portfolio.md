# Multi-view Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the long-scrolling portfolio into an accessible four-view single-page experience with higher-resolution paper covers, a dimensional AI hero visual, refined motion, and readable research interactions.

**Architecture:** Keep one URL and one React client entry. Store the active view in component state synchronized with the URL hash; render one view at a time inside a shared shell and persistent navigation rail. Implement the hero visual as a code-native layered neural field with pointer-driven CSS variables and reduced-motion fallbacks.

**Tech Stack:** React, TypeScript, CSS 3D transforms, SVG, Vinext, Node test runner.

## Global Constraints

- Use paper first-page images rather than cropped methodology figures.
- Use an AI-related hero visual with dimensional, pointer-responsive motion.
- Paper motion remains restrained.
- Views are Home, Projects, Research, and Profile without opening new pages.
- Research hover states must preserve strong text/background contrast.
- Preserve English/Chinese switching, PDF links, verified personal information, and owner-only access.

---

### Task 1: Navigation and view-state contract

- [ ] Add failing tests for the four view hashes, persistent navigation rail, active-view state, and hash-change handling.
- [ ] Implement the active-view controller and shared shell.
- [ ] Verify focused tests pass.

### Task 2: AI hero and page-level motion

- [ ] Add failing tests for the neural-field component, pointer variables, view transition layer, and reduced-motion support.
- [ ] Implement the layered neural field and page transition choreography.
- [ ] Verify type checking and focused tests pass.

### Task 3: Paper covers and research interaction

- [ ] Add failing tests for first-page cover assets and high-resolution image dimensions.
- [ ] Replace methodology crops with the original paper covers and restrained hover effects.
- [ ] Replace the research hover treatment with a high-contrast light accent state.
- [ ] Run build, lint, and the full test suite.

### Task 4: Publish and verify

- [ ] Inspect the agent preview when available, including all four views and language switching.
- [ ] Publish an owner-only checkpoint.
- [ ] Verify the deployment reaches succeeded.

