# Final whole-branch fix report

## Status

PASS. All four final-review findings were fixed together from base `f5570ea5abc2bd3a8e602abc6274b0bdc11decab` with regression-first source coverage, a system-Chrome Playwright regression, full repository gates, and eight inspected mobile captures. The final commit SHA is reported in the task handoff because a commit cannot contain its own hash.

## Red evidence

- Added four focused source contracts before product edits and ran:
  `node --test --test-name-pattern "route transitions cancel|selectable research|pipeline figures|mobile interactive" tests/portfolio-content.test.mjs`.
- Result before fixes: 4 tests, 0 passed, 4 failed.
  - route regression failed at the missing `useRef`/timer/pending-route cancellation contract;
  - demo selection regression failed at missing `aria-pressed` and prompt-token grouping;
  - figure regression found 0 of 3 localized `figureAlt` records;
  - mobile regression failed first at the missing 44px wordmark contract (and covered text links, paper actions, and prompt tokens).
- The first full `npm test` after implementation exposed two test-contract issues, not product regressions: an older CSS assertion still named `.prompt-panel button`, and a rendered-home test incorrectly expected conditionally unmounted research-detail controls. Both assertions were corrected while retaining source and live accessibility coverage.
- The first screenshot attempt was rejected because captures occurred while the blue cover animation was still settling. The harness now waits for settled state and primes lazy images; only the eight final `final-fix-*` files were accepted.

## Fixes and files

- `app/PortfolioExperience.tsx`
  - tracks committed and pending destinations separately;
  - stores cover and release timers in refs;
  - clears stale callbacks before replacement requests and during unmount;
  - cancels a pending destination when the committed route is requested;
  - verifies callback ownership before commit/push;
  - uses a stable history subscription through `showRouteRef`;
  - uses localized project figure alternatives.
- `app/ResearchDemos.tsx`
  - exposes `aria-pressed` on corruption and prompt-token choices;
  - preserves the corruption group label and adds a named prompt-token group.
- `app/content.ts`
  - adds specific English and Chinese method/pipeline figure alternatives for all three projects.
- `app/globals.css`
  - provides restrained 44px mobile targets for the wordmark, text link, paper actions, and semantic prompt-token buttons;
  - reduces paper-action spacing to keep adjacent targets distinct.
- `tests/portfolio-content.test.mjs`, `tests/rendered-html.test.mjs`
  - add route cancellation, selection state, localized alt, mobile target, and rendered-alt contracts.
- `.superpowers/sdd/final-fix-playwright.mjs`
  - covers rapid A-to-B, pending-to-current cancellation, Back/Forward during cover, named/pressed selection state, exhaustive target enumeration, screenshots, and browser error capture.

## Green evidence

- Focused source regressions: PASS, 4/4.
- Final `npm test`: PASS, 36/36; includes typecheck, verified build, artifact validation, source tests, and rendered HTML tests.
- `npm run lint`: PASS, 0 errors and 0 warnings.
- `npm run validate:artifact`: PASS, ESM Worker `default.fetch` and hosting manifest present.
- `git diff --check`: PASS.
- Final Playwright run: PASS, 35 assertions, 0 console errors, 0 page errors.
- Route browser cases: rapid A-to-B commits/pushes only B; pending-to-current cancels without history mutation; Back and Forward during cover cancel the stale request.
- Selection browser cases: corruption and prompt-token groups have meaningful accessible names and update `aria-pressed` correctly.
- Mobile target enumeration: 75 visible interactive instances across Home, Projects, VLM research detail, and Profile at 390x844 and 360x800; 0 targets below 44x44 and 0 overlaps.

## Screenshot evidence and inspection

All new files are under `outputs/portfolio-refinement-qa` and were individually opened after the final settled-state capture:

- `final-fix-390x844-home.png`
- `final-fix-390x844-projects.png`
- `final-fix-390x844-research-vlm.png`
- `final-fix-390x844-profile.png`
- `final-fix-360x800-home.png`
- `final-fix-360x800-projects.png`
- `final-fix-360x800-research-vlm.png`
- `final-fix-360x800-profile.png`
- `final-fix-results.json`

Inspection result: correct route and viewport for every capture; no transition cover, blank lazy image, horizontal crop, overlap, or wrong-state capture accepted. Existing QA evidence was not modified.

## Self-review

- Route callbacks compare the exact pending object before committing, so a cleared/replaced timer cannot mutate view or history even if callback delivery races cancellation.
- The committed-route ref is initialized from the URL and updated atomically with state at commit.
- History listeners no longer depend on changing active route state or a changing `showRoute` callback.
- The mobile contract measures rendered geometry and overlap, rather than inferring compliance solely from CSS declarations.
- Localized alternatives describe each actual pipeline/method figure instead of calling it a report cover.
- Generated `tsconfig.tsbuildinfo` was restored before commit; ignored build/runtime directories were not added.

## Concerns

None blocking. The Playwright regression imports the bundled Codex runtime path and launches the authorized system Chrome path, so it is a local QA harness rather than a portable CI test. Screenshot evidence supports the scoped mobile target/layout review, not a claim of full WCAG conformance.
