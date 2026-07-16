# Design QA

## Sources

- Selected reference: `/workspace/scratch/db66fdf7ccd0/library-reference/网页制作/学术主页研究方向展示(1).png`
- Implementation capture: `/workspace/scratch/portfolio-optimized-home-v15.jpg`
- Side-by-side comparison: `/workspace/scratch/portfolio-design-qa-comparison-v15.jpg`
- Compared state: English home view, desktop first viewport

## Visual comparison

- P0: none.
- P1: none.
- P2: none.
- P3: the implementation capture uses the available 1363 × 936 browser viewport while the selected concept is 1488 × 1056; the same hierarchy and proportions are retained, with slightly tighter vertical spacing.
- P3: the existing square FG mark and indexed navigation are intentionally preserved from production because the user explicitly excluded the top and left navigation from the redesign.
- The thesis statement, research statement, trajectory line, three direction columns, current citations, and Method / Period / Affiliation footer match the selected composition.
- The homepage thesis and academic display type use the locally bundled Newsreader family; compact black body copy uses the official OFL De Aetna Text cut, while blue system labels retain the existing monospaced treatment.
- The mid-size desktop layout uses shorter editorial line breaks and an 821–1450px safety breakpoint, preventing the thesis from entering the research statement column.
- Direction questions and citations use larger screen-reading sizes; four directions resolve to a 2 × 2 grid and five directions retain a 3 + 2 hierarchy rather than shrinking into narrow columns.
- Each scientific illustration is a standalone high-resolution asset rather than a crop of the page mockup.

## Interaction and accessibility checks

- The research index, profile action, and all three direction headings use real anchors and the existing route transition handlers.
- Each paper citation opens its corresponding primary paper page in a new tab.
- All scientific figures have localized alternative text; the trajectory exposes a concise accessible label.
- English and Chinese content are both present and preserve the same information hierarchy.
- Responsive layouts stack the introduction, directions, and footer without horizontal overflow at tablet and mobile breakpoints.
- The browser preview rendered the visual state successfully. Its restricted runtime blocked the client module used for live click hydration, so navigation behavior was verified through the production build and automated route tests instead.
- The current 1363 × 936 capture confirms that the thesis and statement columns retain clear separation with no overlap.
- The complete production build, artifact validator, typecheck, lint, and 39 automated product tests pass, including regression checks for inactive views, typography, responsive title safety, and future direction layouts.

## Outcome

final result: passed
