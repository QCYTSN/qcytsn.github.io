# FG Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default platform grid icon with the selected ivory, black-border, serif `FG` identity across browser and device icon surfaces.

**Architecture:** Keep a crisp SVG as the canonical favicon and derive raster PNG/ICO assets for clients that do not reliably use SVG. Reference every format through Next.js metadata and verify both the rendered HTML and static GitHub Pages build.

**Tech Stack:** Next.js metadata, SVG, PNG, ICO, Node test runner.

## Global Constraints

- Use a square ivory background, thin near-black border, and centered near-black serif `FG`.
- Keep square corners, no gradients, shadows, technology motifs, or decoration.
- Preserve the existing site layout and GitHub Pages build behavior.

---

### Task 1: Favicon assets and metadata

**Files:**
- Modify: `public/favicon.svg`
- Create: `public/favicon-32x32.png`
- Create: `public/apple-touch-icon.png`
- Create: `public/favicon.ico`
- Modify: `app/layout.tsx`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: Next.js `Metadata.icons` configuration.
- Produces: favicon links and static assets at the site root.

- [x] Add rendered-HTML assertions for SVG, ICO, PNG, and Apple touch icon links.
- [x] Run the focused test and confirm it fails against the old metadata.
- [x] Replace the SVG and create raster derivatives.
- [x] Update `Metadata.icons` with all icon formats.
- [x] Run tests, lint, and both production build modes.
- [x] Package the verified project without dependency or build directories.
