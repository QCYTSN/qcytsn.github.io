# GitHub Pages Dual Deployment Design

## Goal

Publish the existing portfolio at `https://qcytsn.github.io/` while keeping `https://peanut-ai.dev` active, using one source tree and two compatible production build targets.

## Repository and URL

The GitHub repository is public and named exactly `qcytsn.github.io` under the `QCYTSN` account. GitHub Pages therefore serves it at the account-root URL `https://qcytsn.github.io/`, with no repository-name path prefix.

The current Sites remote remains untouched. A second GitHub remote is added only after the public repository exists. The same `main` branch is pushed to both remotes, but each platform uses its own build command.

## Static export

The application remains Next/Vinext source. `next.config.ts` reads `GITHUB_PAGES=true`:

- GitHub Pages builds use `output: "export"`, `images.unoptimized: true`, and `trailingSlash: true`;
- the existing Sites build keeps its current Vinext/Worker behavior;
- the user-site repository uses root-relative paths because its Pages URL has no subpath.

The Pages command is `npm run build:pages`, which produces an `out/` directory containing `index.html`, JavaScript, CSS, images, PDFs, `robots.txt`, sitemap, and `.nojekyll`.

No server APIs, databases, authentication, or Worker-only behavior are required by the portfolio. The unused `app/chatgpt-auth.ts` helper is not imported and does not enter the static route.

## Canonical metadata and crawler files

Build-time environment selects the origin:

- Sites: `https://peanut-ai.dev`
- GitHub Pages: `https://qcytsn.github.io`

The layout metadata, canonical URL, Open Graph URL, `robots.txt`, and `sitemap.xml` use that selected origin. Static metadata routes replace the currently hardcoded crawler files so each build advertises its own real origin.

During the parallel period, both sites may be indexable. When the paid domain is retired, GitHub Pages remains the permanent canonical address without source changes.

## GitHub Actions deployment

`.github/workflows/deploy-pages.yml`:

1. triggers on pushes to `main` and manual dispatch;
2. checks out the repository;
3. installs Node 22 dependencies with `npm ci`;
4. runs `npm run build:pages`;
5. uploads `out/` with the official Pages artifact action;
6. deploys with the official Pages deployment action and `pages: write` / `id-token: write` permissions.

Only one deployment job runs at a time; a newer queued deployment may cancel an older in-progress one.

## Security model

GitHub Pages is static hosting. It cannot reproduce the custom Worker response headers used by Sites. The exported site keeps safe React escaping, has no user input or persistence, loads first-party assets only, and uses HTTPS supplied by GitHub Pages. This remains a small attack surface suitable for a public personal portfolio.

## Verification

Before any GitHub write:

- the Pages export must complete locally;
- `out/index.html` must exist;
- all three research hash routes and bilingual content must appear in the exported application bundle;
- project PDFs and WebP covers must be present;
- canonical, robots, and sitemap values must use `https://qcytsn.github.io`;
- the existing Sites build and full tests must still pass.

After the repository is created and pushed:

- enable Pages with GitHub Actions as its source;
- monitor the deployment workflow;
- verify `https://qcytsn.github.io/` returns successfully and supports the main navigation, research demos, project downloads, and bilingual switch.

## User action boundary

The environment currently lacks the GitHub CLI and the installed GitHub connector cannot create repositories. Complete all local work first. At the repository-creation boundary, ask the user either to create the empty public repository in the GitHub web interface or install/authenticate GitHub CLI. Give the web-interface path as the default because it is faster and requires no local tooling.
