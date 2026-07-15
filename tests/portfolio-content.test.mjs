import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const pagePath = new URL("../app/page.tsx", import.meta.url);
const contentPath = new URL("../app/content.ts", import.meta.url);
const cssPath = new URL("../app/globals.css", import.meta.url);
const neuralFieldPath = new URL("../app/NeuralField.tsx", import.meta.url);
const experiencePath = new URL("../app/PortfolioExperience.tsx", import.meta.url);
const researchDemosPath = new URL("../app/ResearchDemos.tsx", import.meta.url);
const layoutPath = new URL("../app/layout.tsx", import.meta.url);
const workerPath = new URL("../worker/index.ts", import.meta.url);
const robotsPath = new URL("../public/robots.txt", import.meta.url);
const sitemapPath = new URL("../public/sitemap.xml", import.meta.url);
const siteOriginPath = new URL("../app/site-origin.ts", import.meta.url);
const robotsRoutePath = new URL("../app/robots.ts", import.meta.url);
const sitemapRoutePath = new URL("../app/sitemap.ts", import.meta.url);
const nextConfigPath = new URL("../next.config.ts", import.meta.url);
const packagePath = new URL("../package.json", import.meta.url);
const noJekyllPath = new URL("../public/.nojekyll", import.meta.url);
const faviconSvgPath = new URL("../public/favicon.svg", import.meta.url);
const faviconPngPath = new URL("../public/favicon-32x32.png", import.meta.url);
const faviconIcoPath = new URL("../public/favicon.ico", import.meta.url);
const appleTouchIconPath = new URL("../public/apple-touch-icon.png", import.meta.url);
const pagesWorkflowPath = new URL("../.github/workflows/deploy-pages.yml", import.meta.url);
const readmePath = new URL("../README.md", import.meta.url);
const page = readFileSync(pagePath, "utf8");
const content = existsSync(contentPath) ? readFileSync(contentPath, "utf8") : "";
const css = readFileSync(cssPath, "utf8");
const neuralField = existsSync(neuralFieldPath) ? readFileSync(neuralFieldPath, "utf8") : "";
const experience = existsSync(experiencePath) ? readFileSync(experiencePath, "utf8") : "";
const researchDemos = existsSync(researchDemosPath) ? readFileSync(researchDemosPath, "utf8") : "";
const layout = existsSync(layoutPath) ? readFileSync(layoutPath, "utf8") : "";
const worker = existsSync(workerPath) ? readFileSync(workerPath, "utf8") : "";
const siteOrigin = existsSync(siteOriginPath) ? readFileSync(siteOriginPath, "utf8") : "";
const robotsRoute = existsSync(robotsRoutePath) ? readFileSync(robotsRoutePath, "utf8") : "";
const sitemapRoute = existsSync(sitemapRoutePath) ? readFileSync(sitemapRoutePath, "utf8") : "";
const nextConfig = existsSync(nextConfigPath) ? readFileSync(nextConfigPath, "utf8") : "";
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const pagesWorkflow = existsSync(pagesWorkflowPath) ? readFileSync(pagesWorkflowPath, "utf8") : "";
const readme = readFileSync(readmePath, "utf8");

test("the site uses the selected FG identity across browser icon formats", () => {
  assert.match(layout, /favicon\.svg/);
  assert.match(layout, /favicon-32x32\.png/);
  assert.match(layout, /favicon\.ico/);
  assert.match(layout, /apple-touch-icon\.png/);

  for (const assetPath of [faviconSvgPath, faviconPngPath, faviconIcoPath, appleTouchIconPath]) {
    assert.equal(existsSync(assetPath), true, `${fileURLToPath(assetPath)} should exist`);
    assert.ok(statSync(assetPath).size > 0, `${fileURLToPath(assetPath)} should not be empty`);
  }

  const faviconSvg = readFileSync(faviconSvgPath, "utf8");
  assert.match(faviconSvg, />FG</);
  assert.match(faviconSvg, /#f4f0e4/i);
  assert.match(faviconSvg, /#111714/i);
});

test("the portfolio exposes four switchable views", () => {
  for (const view of ["home", "projects", "research", "profile"]) {
    assert.match(content, new RegExp(`href: [\\"']#${view}[\\"']`));
  }
  assert.match(experience, /type ViewId = "home" \| "projects" \| "research" \| "profile"/);
  assert.match(experience, /activeView/);
  assert.match(experience, /hashchange/);
  assert.match(experience, /className="view-navigation"/);
});

test("the hero communicates Fengkai's research positioning", () => {
  assert.match(content, /Fengkai Gao/);
  assert.match(content, /Researcher/);
  assert.doesNotMatch(content, /AI Student/);
  assert.match(content, /Computer Vision/);
  assert.match(content, /Vision-Language Models/);
  assert.match(content, /Generative Models/);
});

test("the portfolio provides complete English and Chinese content", () => {
  assert.match(content, /export const portfolioContent/);
  assert.match(content, /English/);
  assert.match(content, /中文/);
  assert.match(content, /研究者/);
  assert.match(content, /北京师范大学-香港浸会大学联合国际学院/);
  assert.match(content, /人工智能/);
});

test("the portfolio presents three project outcomes without publication claims", () => {
  assert.match(content, /Detecting Semantic Manipulation in Structured Academic Figures/);
  assert.match(content, /Training-Free Concept Disentanglement/);
  assert.match(content, /Revisiting FreeU/);
  assert.equal((content.match(/status: "Project outcome"/g) ?? []).length, 3);
  assert.equal((content.match(/cover: "\/images\/papers\//g) ?? []).length, 3);
  for (const cover of ["semantic-figure-pipeline", "detection-guided-pipeline", "dynamic-freeu-pipeline"]) {
    assert.match(content, new RegExp(`${cover}\\.png`));
  }
  assert.doesNotMatch(content, /Completed paper|TechRxiv|preprint|submitted|accepted|published/i);
  assert.doesNotMatch(content, /AutoDraftman|In progress/);
});

test("the profile uses verified contact and education details without excluded claims", () => {
  assert.match(content, /Beijing Normal-Hong Kong Baptist University/);
  assert.match(content, /Artificial Intelligence undergraduate/);
  assert.match(content, /t330034007@mail\.bnbu\.edu\.cn/);
  assert.match(content, /https:\/\/github\.com\/QCYTSN/);
  for (const course of ["Machine Learning", "Natural Language Processing", "Big Data", "Computer Vision", "Bayesian Networks"]) {
    assert.match(content, new RegExp(course));
  }
  assert.doesNotMatch(content, /GPA|3\.01|award|prize|17784321536/i);
});

test("primary navigation and calls to action use real view anchors", () => {
  assert.match(experience, /href=[\"']#projects/);
  assert.match(content, /href: [\"']#research[\"']/);
  assert.match(experience, /content\.navigation\.map/);
  assert.match(content, /href: [\"']#profile[\"']/);
});

test("the full-screen experience includes contact, language, loading, and view transition controls", () => {
  assert.match(page, /PortfolioExperience/);
  assert.match(experience, /className="site-loader"/);
  assert.match(experience, /className="language-toggle"/);
  assert.match(experience, /className="header-contact"/);
  assert.match(experience, /className="view-transition"/);
  assert.match(experience, /setTransitioning/);
  assert.match(css, /min-height:\s*100svh/);
  assert.match(css, /\.site-loader/);
  assert.match(css, /\.reveal-ready/);
});

test("the visual system preserves visible focus and reduced motion", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("the public portfolio declares canonical search and sharing metadata", () => {
  assert.match(siteOrigin, /https:\/\/peanut-ai\.dev/);
  assert.match(layout, /canonical:/);
  assert.match(layout, /index: true/);
  assert.match(layout, /follow: true/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);
  assert.match(robotsRoute, /allow: "\/"/);
  assert.match(robotsRoute, /sitemap:/);
  assert.match(sitemapRoute, /changeFrequency: "monthly"/);
});

test("the same source supports a root GitHub Pages static export", () => {
  assert.match(siteOrigin, /GITHUB_PAGES/);
  assert.match(siteOrigin, /https:\/\/qcytsn\.github\.io/);
  assert.match(siteOrigin, /https:\/\/peanut-ai\.dev/);
  assert.match(layout, /SITE_ORIGIN/);
  assert.match(robotsRoute, /MetadataRoute\.Robots/);
  assert.match(robotsRoute, /SITE_ORIGIN/);
  assert.match(robotsRoute, /dynamic\s*=\s*"force-static"/);
  assert.match(sitemapRoute, /MetadataRoute\.Sitemap/);
  assert.match(sitemapRoute, /SITE_ORIGIN/);
  assert.match(sitemapRoute, /dynamic\s*=\s*"force-static"/);
  assert.match(nextConfig, /output:\s*"export"/);
  assert.match(nextConfig, /unoptimized:\s*true/);
  assert.equal(packageJson.scripts["build:pages"], "GITHUB_PAGES=true next build");
  assert.equal(existsSync(noJekyllPath), true);
  assert.equal(existsSync(robotsPath), false);
  assert.equal(existsSync(sitemapPath), false);
});

test("GitHub Actions deploys the verified static export to Pages", () => {
  assert.match(pagesWorkflow, /pages:\s*write/);
  assert.match(pagesWorkflow, /id-token:\s*write/);
  assert.match(pagesWorkflow, /node-version:\s*["']?22/);
  assert.match(pagesWorkflow, /npm ci/);
  assert.match(pagesWorkflow, /npm run build:pages/);
  assert.match(pagesWorkflow, /actions\/upload-pages-artifact@/);
  assert.match(pagesWorkflow, /actions\/deploy-pages@/);
  assert.match(readme, /https:\/\/qcytsn\.github\.io/);
  assert.match(readme, /npm run build:pages/);
});

test("the worker defines a defense-in-depth response header policy", () => {
  for (const header of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "X-Robots-Tag"]) {
    assert.match(worker, new RegExp(header));
  }
  assert.match(worker, /withSecurityHeaders/);
});

test("each paper has a web-readable PDF and cover preview", () => {
  for (const stem of ["semantic-figure-manipulation", "detection-guided-attention", "dynamic-freeu"]) {
    assert.equal(existsSync(new URL(`../public/papers/${stem}.pdf`, import.meta.url)), true);
    assert.equal(existsSync(new URL(`../public/images/papers/${stem}.png`, import.meta.url)), true);
  }
});

test("paper covers load as static assets without the runtime image optimizer", () => {
  assert.match(experience, /<Image[\s\S]*?unoptimized/);
});

test("project covers preserve fallback WebPs, use pipeline assets, and update document language", () => {
  for (const stem of ["semantic-figure-manipulation", "detection-guided-attention", "dynamic-freeu"]) {
    const png = new URL(`../public/images/papers/${stem}.png`, import.meta.url);
    const webp = new URL(`../public/images/papers/${stem}.webp`, import.meta.url);
    assert.equal(existsSync(webp), true);
    assert.ok(statSync(webp).size < statSync(png).size);
  }
  for (const asset of ["semantic-figure-pipeline.png", "detection-guided-pipeline.png", "dynamic-freeu-pipeline.png"]) {
    assert.equal(existsSync(new URL(`../public/images/papers/${asset}`, import.meta.url)), true);
    assert.match(content, new RegExp(asset.replace(".", "\\.")));
  }
  assert.match(experience, /document\.documentElement\.lang/);
  assert.match(experience, /language === "zh" \? "zh-CN" : "en"/);
});

test("the hero uses a dimensional AI neural field instead of a rotating poster", () => {
  assert.match(experience, /import \{ NeuralField \} from "\.\/NeuralField"/);
  assert.match(experience, /<NeuralField/);
  assert.match(neuralField, /className=\{`neural-field/);
  assert.match(neuralField, /onPointerMove/);
  assert.match(neuralField, /--pointer-x/);
  assert.match(neuralField, /neural-layer/);
  assert.match(neuralField, /signal-path/);
  assert.match(css, /perspective:/);
  assert.doesNotMatch(experience, /FolioIllustration/);
});

test("research directions open three nested conceptual demo pages", () => {
  for (const slug of ["visual-reasoning", "vlm-evaluation", "generative-models"]) {
    assert.match(content, new RegExp(`slug: [\\"']${slug}[\\"']`));
    assert.match(experience, new RegExp(`#research/${slug}`));
  }
  assert.match(experience, /type ResearchId/);
  assert.match(experience, /activeResearch/);
  assert.match(experience, /setActiveResearch/);
  assert.match(experience, /research-back/);
  assert.match(experience, /ResearchDemo/);
  assert.match(content, /Interactive conceptual demo/);
  assert.match(content, /交互式概念演示/);
});

test("research demos provide evidence, robustness, and generation controls", () => {
  assert.match(researchDemos, /export function VisualEvidenceDemo/);
  assert.match(researchDemos, /evidence-scanner/);
  assert.match(researchDemos, /onPointerMove/);
  assert.match(researchDemos, /export function VlmRobustnessDemo/);
  assert.match(researchDemos, /type="range"/);
  assert.match(researchDemos, /corruption/);
  assert.match(researchDemos, /export function GenerativeControlDemo/);
  assert.match(researchDemos, /denoising/);
  assert.match(researchDemos, /structure/);
  assert.match(researchDemos, /texture/);
  assert.match(css, /\.research-detail/);
  assert.match(css, /\.demo-stage/);
});

test("research demos use deliberate controls and readable derived states", () => {
  assert.match(researchDemos, /const \[dragging, setDragging\] = useState\(false\)/);
  assert.match(researchDemos, /setPointerCapture/);
  assert.match(researchDemos, /type VlmPhase = "stable" \| "uncertain" \| "failed"/);
  assert.match(researchDemos, /aria-live="polite"/);
  assert.match(researchDemos, /resetVlm/);
  assert.match(researchDemos, /uncertain: "Evidence is weakening"/);
  assert.match(researchDemos, /reset: "Reset"/);
  assert.match(researchDemos, /className={`model-pane phase-\$\{phase\}`}/);
  assert.match(css, /\.phase-uncertain/);
  assert.match(css, /\.vlm-threshold/);
  assert.match(css, /--attribute-offset/);
  assert.match(css, /--edge-clarity/);
});

test("research demo refinements preserve readable copy, touch scrolling, and independent motion channels", () => {
  assert.match(researchDemos, /uncertain: "视觉证据正在减弱"/);
  assert.match(researchDemos, /reset: "重置"/);
  assert.match(css, /\.evidence-canvas\s*\{[^}]*touch-action:\s*pan-y/s);
  assert.match(researchDemos, /\{failed \? labels\.wrong : labels\.correct\}/);
  assert.match(researchDemos, /"--denoise": denoising \/ 100/);
  assert.match(researchDemos, /"--structure": structure \/ 100/);
  assert.match(researchDemos, /"--texture": texture \/ 100/);
  assert.match(researchDemos, /"--attribute-offset": `\$\{\(50 - structure\) \* \.18\}px`/);
  assert.match(researchDemos, /"--edge-clarity": `\$\{Math\.max\(0, 1\.6 - texture \* \.016\)\}px`/);
  assert.match(css, /\.noise-field\s*\{[^}]*opacity:\s*calc\(1 - var\(--denoise\)\)[^}]*transition:\s*opacity var\(--motion-state\) ease/s);
  assert.match(css, /\.spatial-box\s*\{[^}]*var\(--structure\)[^}]*transition:\s*width var\(--motion-state\) var\(--ease-state\)/s);
  assert.match(css, /\.attention-heat\s*\{[^}]*var\(--structure\)[^}]*transition:\s*opacity var\(--motion-state\) ease/s);
  assert.match(css, /\.generated-portrait\s*\{[^}]*var\(--edge-clarity\)[^}]*transition:\s*transform var\(--motion-state\) var\(--ease-out\), filter var\(--motion-state\) var\(--ease-state\)/s);
  assert.match(css, /\.spectrum i\s*\{[^}]*var\(--texture\)[^}]*transition:\s*height var\(--motion-state\) var\(--ease-state\), opacity var\(--motion-fast\) ease/s);
  assert.match(css, /\.attribute-shape\s*\{[^}]*transition:\s*translate var\(--motion-state\) var\(--ease-out\)/s);
  assert.doesNotMatch(css, /\.attribute-shape\s*\{[^}]*transition:\s*all/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.entity-selector button, \.corruption-selector button, \.prompt-panel button, \.demo-reset, \.research-back\s*\{\s*min-height:\s*44px;/);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.robustness-controls input, \.generation-controls input\s*\{\s*height:\s*44px;/);
});

test("each research demo has a collapsed bilingual explanation guide", () => {
  assert.match(content, /How to read this demo/);
  assert.match(content, /如何理解这个演示/);
  for (const heading of ["What to observe", "Try this", "Why it happens", "观察什么", "如何操作", "为什么会这样"]) {
    assert.match(content, new RegExp(heading));
  }
  assert.equal((content.match(/guide: \[/g) ?? []).length, 6);
  assert.match(experience, /<details className="demo-explainer">/);
  assert.match(experience, /<summary>/);
  assert.match(experience, /demo-explainer-content/);
  assert.match(experience, /<ResearchDemo[\s\S]*?<details className="demo-explainer">/);
});

test("research navigation and demo explanations have distinct responsive styling", () => {
  assert.match(css, /\.research-back\s*\{[^}]*border:/s);
  assert.match(css, /\.research-back\s*\{[^}]*background:/s);
  assert.match(css, /\.demo-explainer/);
  assert.match(css, /\.demo-explainer\[open\]/);
  assert.match(css, /\.demo-explainer-content/);
  assert.match(css, /@media \(max-width: 820px\)[\s\S]*?\.demo-explainer-content/s);
});

test("the public FreeU paper copy excludes student IDs and the coauthor email", () => {
  const pdfPath = fileURLToPath(new URL("../public/papers/dynamic-freeu.pdf", import.meta.url));
  const extracted = execFileSync("pdftotext", [pdfPath, "-"], { encoding: "utf8" });
  assert.doesNotMatch(extracted, /2330034007|2330034079|t330034007@uic\.edu\.cn|t330034079@uic\.edu\.cn/);
});

test("view navigation uses one restrained motion system", () => {
  assert.match(experience, /const VIEW_COVER_MS = 180/);
  assert.match(experience, /const VIEW_RELEASE_MS = 40/);
  assert.match(experience, /className="nav-active-marker"/);
  assert.match(experience, /--nav-index/);
  assert.match(css, /--motion-fast:\s*180ms/);
  assert.match(css, /--motion-state:\s*320ms/);
  assert.match(css, /--motion-view:\s*360ms/);
  assert.match(css, /\.view-panel\.is-active[^}]*var\(--motion-view\)/s);
  assert.match(css, /\.nav-active-marker[^}]*transition:/s);
});

test("the Neural Field exposes three semantic research destinations", () => {
  const activateDirection = neuralField.match(/const activateDirection = \(index: number\) => \{[\s\S]*?\n  \};/)?.[0] ?? "";
  assert.match(neuralField, /export type NeuralDirection/);
  assert.match(neuralField, /directions:\s*readonly NeuralDirection\[\]/);
  assert.match(neuralField, /onSelectResearch:\s*\(id:\s*ResearchId\)\s*=>\s*void/);
  assert.match(neuralField, /className="neural-direction"/);
  assert.match(neuralField, /aria-pressed=/);
  assert.match(neuralField, /activeDirection/);
  assert.match(neuralField, /matchMedia\("\(hover: none\)"\)/);
  assert.match(neuralField, /event\.pointerType === "touch"/);
  assert.match(neuralField, /touchPointerDirection\s*=\s*useRef<number \| null>\(null\)/);
  assert.match(neuralField, /onPointerEnter=\{\(event\) => \{[\s\S]*?event\.pointerType !== "touch"/);
  assert.match(neuralField, /onPointerDown=\{\(event\) => \{[\s\S]*?event\.pointerType === "touch"[\s\S]*?touchPointerDirection\.current = index/);
  assert.match(neuralField, /onFocus=\{\(\) => \{[\s\S]*?touchPointerDirection\.current !== index/);
  assert.match(neuralField, /onPointerCancel=\{\(\) => \{[\s\S]*?touchPointerDirection\.current = null/);
  assert.match(neuralField, /onClick=\{\(\) => \{[\s\S]*?activateDirection\(index\)[\s\S]*?touchPointerDirection\.current = null/);
  assert.match(neuralField, /const activateDirection = \(index: number\) => \{[\s\S]*?touchPointerDirection\.current === index/);
  assert.doesNotMatch(activateDirection, /matchMedia/);
  assert.doesNotMatch(neuralField, /className={`neural-field[^>]*aria-hidden="true"/);
  assert.doesNotMatch(neuralField, /onKeyDown=/);
  assert.match(experience, /<NeuralField[\s\S]*?directions=/);
  assert.match(experience, /onSelectResearch=/);
  assert.match(css, /\.neural-direction/);
  assert.match(css, /\.neural-field\.has-active-direction/);
});

test("project figures and mobile profile use the approved polished presentation", () => {
  for (const asset of [
    "semantic-figure-pipeline.png",
    "detection-guided-pipeline.png",
    "dynamic-freeu-pipeline.png",
  ]) assert.match(content, new RegExp(asset.replace(".", "\\.")));
  assert.match(css, /--rust:\s*#98472f/i);
  assert.match(css, /\.paper-image-frame[^}]*aspect-ratio:\s*4\s*\/\s*3/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.profile-view[^}]*padding-inline:\s*24px/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.profile-intro h2[^}]*font-size:\s*42px/s);
  assert.match(css, /\.profile-item a[^}]*min-height:\s*44px/s);
});
