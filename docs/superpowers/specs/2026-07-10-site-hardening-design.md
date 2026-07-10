# Portfolio Security, SEO, and Performance Hardening Design

## Goal

Strengthen the existing public portfolio without changing its editorial appearance, single-page navigation model, research demos, or bilingual content structure.

## Scope

This balanced hardening pass includes:

- explicit index/follow metadata and removal or override of the current `noindex, nofollow` response where the hosting layer permits it;
- canonical, Open Graph, and Twitter metadata for `https://peanut-ai.dev`;
- public `robots.txt` and `sitemap.xml` files;
- browser security headers applied to HTML and static responses;
- conversion of the three project-cover PNG files to smaller WebP assets;
- synchronization of the root document `lang` attribute with the English/Chinese switch;
- remediation of the audited nested PostCSS dependency if an exact patched override passes the full build;
- automated tests for metadata, headers, language behavior, image assets, and dependency state.

The research hash routes remain unchanged. Converting them into independent server routes is deliberately excluded from this pass.

## Security response policy

The Worker wraps application responses and adds:

- `Content-Security-Policy` with same-origin defaults, no objects, no forms, no framing, and only the inline script/style allowances required by the current React/Vinext runtime;
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` disabling camera, microphone, geolocation, payment, and USB;
- `X-Robots-Tag: index, follow` for document responses.

The policy is intentionally compatible with the existing local CSS, React hydration, PDFs, images, and same-origin assets. It does not introduce third-party analytics or scripts.

## Search and sharing metadata

Root metadata declares:

- canonical URL `https://peanut-ai.dev`;
- explicit `index: true` and `follow: true` robots directives;
- bilingual-relevant title and description already used by the site;
- Open Graph website title, description, URL, site name, and locale;
- a Twitter summary card.

`public/robots.txt` permits crawling and references `https://peanut-ai.dev/sitemap.xml`. The sitemap includes the canonical homepage because hash fragments are not separate crawlable documents.

The hosting platform may append its own `X-Robots-Tag` after the Worker response. Publication verification must inspect the live custom domain; if the platform overwrites the source-level header, the remaining limitation is reported rather than hidden.

## Performance

The three project covers are converted to WebP while preserving their current dimensions and visual appearance. Content references switch to the WebP files. Existing PDFs are unchanged and remain user-triggered downloads.

No speculative code splitting or route rewrite is included because the current client bundle and asset sizes are reasonable for a small portfolio, and those changes would introduce disproportionate regression risk.

## Language and accessibility

The static document defaults to English. When the language toggle changes, the client updates `document.documentElement.lang` to `en` or `zh-CN`. This preserves the current content state while giving assistive technology the correct active language.

## Dependency handling

The audited PostCSS advisory affects versions below 8.5.10. Add an exact npm override for the nested dependency and regenerate the lockfile. Keep the override only if typecheck, production build, tests, and lint all pass. The site accepts no user-supplied CSS, so the practical exposure is already low, but the patched dependency removes the known advisory rather than relying on that assumption.

## Verification

Tests must prove:

- the Worker adds the defined security headers and preserves application responses;
- the rendered document declares index/follow metadata and the canonical origin;
- `robots.txt` and `sitemap.xml` contain the custom domain;
- all three project covers use existing WebP files;
- the language toggle updates the root `lang` attribute;
- `npm audit --omit=dev --audit-level=moderate` exits successfully;
- the full production build, test suite, and lint pass.

After deployment, inspect the live custom domain headers to verify HTTPS, security headers, and the effective robots directive.

