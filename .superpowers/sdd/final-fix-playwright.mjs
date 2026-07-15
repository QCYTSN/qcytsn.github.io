import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "file:///C:/Users/peanut/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/node_modules/playwright-core/index.mjs";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:5174/";
const evidenceDir = process.env.EVIDENCE_DIR ?? ".superpowers/sdd/final-fix-browser-evidence";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const interactiveSelector = "a[href],button,input,select,textarea,summary,[role=button],[tabindex]:not([tabindex='-1'])";
const results = { assertions: 0, targetStates: [], screenshots: [], consoleErrors: [], pageErrors: [] };

await mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch({ executablePath: chrome, headless: true });

function check(value, message) {
  results.assertions += 1;
  assert.ok(value, message);
}

async function ready(page, hash = "") {
  await page.goto(`${baseUrl}${hash}`, { waitUntil: "networkidle" });
  await page.locator('.site-loader[data-active="false"]').waitFor({ state: "attached" });
  await page.waitForTimeout(900);
}

async function activeView(page, id) {
  await page.locator(`#${id}.is-active`).waitFor();
  check(await page.locator(`#${id}`).getAttribute("aria-hidden") === "false", `${id} should be the exposed active view`);
}

async function testRouteRaces(page) {
  await ready(page);
  const initialLength = await page.evaluate(() => history.length);
  await page.locator('.view-navigation a[href="#projects"]').dispatchEvent("click");
  await page.locator('.view-navigation a[href="#profile"]').dispatchEvent("click");
  await page.waitForTimeout(260);
  await activeView(page, "profile");
  check(await page.evaluate(() => location.hash) === "#profile", "rapid A to B should push only B");
  check(await page.evaluate(() => history.length) === initialLength + 1, "rapid A to B should add one history entry");

  await ready(page);
  const currentLength = await page.evaluate(() => history.length);
  await page.locator('.view-navigation a[href="#projects"]').dispatchEvent("click");
  await page.locator('.wordmark').dispatchEvent("click");
  await page.waitForTimeout(260);
  await activeView(page, "home");
  check(await page.evaluate(() => location.hash) === "", "requesting the committed route should cancel pending navigation");
  check(await page.evaluate(() => history.length) === currentLength, "cancel-to-current should not mutate history");

  await ready(page);
  await page.locator('.view-navigation a[href="#profile"]').dispatchEvent("click");
  await page.waitForTimeout(260);
  await page.locator('.view-navigation a[href="#projects"]').dispatchEvent("click");
  await page.goBack({ waitUntil: "commit" });
  await page.waitForTimeout(260);
  await activeView(page, "home");
  check(await page.evaluate(() => location.hash) === "", "Back during cover should cancel the stale request");

  await page.locator('.view-navigation a[href="#projects"]').dispatchEvent("click");
  await page.goForward({ waitUntil: "commit" });
  await page.waitForTimeout(260);
  await activeView(page, "profile");
  check(await page.evaluate(() => location.hash) === "#profile", "Forward during cover should cancel the stale request");
}

async function inspectTargets(page, label) {
  const targets = await page.locator(interactiveSelector).evaluateAll((elements) => elements.flatMap((element, index) => {
    if (element.closest('[aria-hidden="true"], [hidden], [inert]')) return [];
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (style.display === "none" || style.visibility === "hidden" || style.pointerEvents === "none" || Number(style.opacity) === 0 || rect.width === 0 || rect.height === 0) return [];
    return [{
      index,
      name: element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) || element.tagName,
      tag: element.tagName.toLowerCase(),
      className: typeof element.className === "string" ? element.className : "",
      x: rect.x,
      y: rect.y,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    }];
  }));
  const undersized = targets.filter((target) => target.width < 43.5 || target.height < 43.5);
  const overlaps = [];
  for (let first = 0; first < targets.length; first += 1) {
    for (let second = first + 1; second < targets.length; second += 1) {
      const a = targets[first];
      const b = targets[second];
      const overlapWidth = Math.min(a.right, b.right) - Math.max(a.x, b.x);
      const overlapHeight = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y);
      if (overlapWidth > 0.5 && overlapHeight > 0.5) overlaps.push({ a: a.name, b: b.name, overlapWidth, overlapHeight });
    }
  }
  results.targetStates.push({ label, count: targets.length, undersized, overlaps });
  check(undersized.length === 0, `${label} undersized targets: ${JSON.stringify(undersized)}`);
  check(overlaps.length === 0, `${label} overlapping targets: ${JSON.stringify(overlaps)}`);
}

async function testSelectionState(page) {
  await ready(page, "#research/vlm-evaluation");
  const corruptionGroup = page.getByRole("group", { name: /Visual corruption/ });
  check(await corruptionGroup.count() === 1, "corruption choices should keep a named group");
  const corruptionButtons = corruptionGroup.getByRole("button");
  check(await corruptionButtons.nth(0).getAttribute("aria-pressed") === "true", "initial corruption should be pressed");
  await corruptionButtons.nth(2).click();
  check(await corruptionButtons.nth(2).getAttribute("aria-pressed") === "true", "selected corruption should expose aria-pressed");
  check(await corruptionButtons.nth(0).getAttribute("aria-pressed") === "false", "previous corruption should clear aria-pressed");

  await ready(page, "#research/generative-models");
  const tokenGroup = page.getByRole("group", { name: /Prompt tokens/ });
  check(await tokenGroup.count() === 1, "prompt tokens should expose a named group");
  const tokenButtons = tokenGroup.getByRole("button");
  check(await tokenButtons.nth(0).getAttribute("aria-pressed") === "true", "initial prompt token should be pressed");
  await tokenButtons.nth(1).click();
  check(await tokenButtons.nth(1).getAttribute("aria-pressed") === "true", "selected prompt token should expose aria-pressed");
}

for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 800 }]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error") results.consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => results.pageErrors.push(error.message));

  if (viewport.width === 390) {
    await testRouteRaces(page);
    await testSelectionState(page);
  }

  for (const state of [
    { name: "home", hash: "" },
    { name: "projects", hash: "#projects" },
    { name: "research-vlm", hash: "#research/vlm-evaluation" },
    { name: "profile", hash: "#profile" },
  ]) {
    await ready(page, state.hash);
    await inspectTargets(page, `${viewport.width}x${viewport.height}-${state.name}`);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    const path = `${evidenceDir}/final-fix-${viewport.width}x${viewport.height}-${state.name}.png`;
    await page.screenshot({ path, fullPage: true });
    results.screenshots.push(path);
  }
  await context.close();
}

check(results.consoleErrors.length === 0, `console errors: ${results.consoleErrors.join(" | ")}`);
check(results.pageErrors.length === 0, `page errors: ${results.pageErrors.join(" | ")}`);
await browser.close();
await writeFile(`${evidenceDir}/final-fix-results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
