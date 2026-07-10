# GitHub Pages Dual Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and automatically deploy a static copy of the portfolio at `https://qcytsn.github.io/` without breaking the existing Sites deployment.

**Architecture:** Add an environment-gated Next static-export target and derive all canonical/crawler URLs from one build-time site-origin module. Deploy `out/` from the public `qcytsn.github.io` repository through the official GitHub Pages Actions workflow.

**Tech Stack:** Next 16 static export, React 19, TypeScript, GitHub Actions, GitHub Pages, Node test runner.

## Global Constraints

- Keep the current Sites build, Worker headers, visual design, bilingual content, PDFs, and research interactions unchanged.
- Use Node 22 and `npm ci` in GitHub Actions.
- Use the exact Pages URL `https://qcytsn.github.io` with no base path.
- Do not publish until both static-export and existing Sites test suites pass.

---

### Task 1: Conditional origin and static export

**Files:**
- Create: `app/site-origin.ts`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Modify: `app/layout.tsx`
- Modify: `next.config.ts`
- Modify: `package.json`
- Delete: `public/robots.txt`
- Delete: `public/sitemap.xml`
- Create: `public/.nojekyll`
- Modify: `tests/portfolio-content.test.mjs`

**Interfaces:**
- Produces: `SITE_ORIGIN: string`, selected from `GITHUB_PAGES`.
- Produces: `npm run build:pages` and the static `out/` artifact.

- [ ] **Step 1: Write failing tests**

Require conditional origin selection, metadata routes, `output: "export"`, the Pages build script, `.nojekyll`, and absence of hardcoded crawler files.

- [ ] **Step 2: Verify red state**

Run: `node --test tests/portfolio-content.test.mjs`

Expected: FAIL because the dual-target configuration is absent.

- [ ] **Step 3: Implement the conditional export**

Create `SITE_ORIGIN`, derive metadata/crawler routes from it, gate export settings on `GITHUB_PAGES === "true"`, and add `build:pages`.

- [ ] **Step 4: Verify static export**

Run: `npm run build:pages`

Expected: `out/index.html`, `out/robots.txt`, `out/sitemap.xml`, `out/.nojekyll`, all WebP covers, and all project PDFs exist.

### Task 2: GitHub Pages workflow and dual-build regression tests

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `tests/portfolio-content.test.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: `npm run build:pages` and `out/`.
- Produces: GitHub Pages deployment on every `main` push.

- [ ] **Step 1: Write failing workflow tests**

Require `pages: write`, `id-token: write`, Node 22, `npm ci`, `npm run build:pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.

- [ ] **Step 2: Verify red state**

Run: `node --test tests/portfolio-content.test.mjs`

Expected: FAIL because the workflow is absent.

- [ ] **Step 3: Implement workflow and documentation**

Add the official Pages workflow and document both production URLs plus the two build commands.

- [ ] **Step 4: Run all gates**

Run: `npm run build:pages && npm test && npm run lint && npm audit --omit=dev --audit-level=moderate`

Expected: static export succeeds, existing Sites build succeeds, all tests/lint pass, and audit reports zero vulnerabilities.

- [ ] **Step 5: Commit verified changes**

Commit only the dual-deployment source, workflow, tests, docs, and generated lock/build metadata changes required by validation. Do not commit `out/`.

### Task 3: Create and publish the GitHub repository

**Files:**
- No additional source changes unless deployment validation identifies a defect.

**Interfaces:**
- Produces: public repository `QCYTSN/qcytsn.github.io` and live Pages URL.

- [ ] **Step 1: Ask for the minimal user action**

Because `gh` is unavailable and the connector cannot create repositories, ask the user to create an empty public repository named exactly `qcytsn.github.io` without README, `.gitignore`, or license.

- [ ] **Step 2: Confirm connector visibility**

Search for `QCYTSN/qcytsn.github.io`. If the connector can write repository contents, push the verified tree through Git/GitHub capabilities; otherwise ask the user for GitHub CLI authentication as the next narrow requirement.

- [ ] **Step 3: Enable and monitor Pages**

Set GitHub Actions as the Pages source, monitor the deployment run, and inspect failures if any.

- [ ] **Step 4: Verify the public URL**

Confirm `https://qcytsn.github.io/` returns the exported portfolio and report both live addresses.
