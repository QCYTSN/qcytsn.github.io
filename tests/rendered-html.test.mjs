import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function renderHome() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders development preview metadata", async () => {
  const response = await renderHome();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("serves hardened browser and crawler response headers", async () => {
  const response = await renderHome();

  assert.match(response.headers.get("content-security-policy") ?? "", /default-src 'self'/);
  assert.equal(response.headers.get("strict-transport-security"), "max-age=63072000; includeSubDomains; preload");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("permissions-policy") ?? "", /camera=\(\)/);
  assert.equal(response.headers.get("x-robots-tag"), "index, follow");
});

test("renders the portfolio identity, papers, verified links, and section anchors", async () => {
  const response = await renderHome();
  const html = await response.text();

  assert.match(html, /Fengkai Gao/);
  assert.match(html, /Researcher/);
  assert.doesNotMatch(html, /AI Student/);
  assert.match(html, /Detecting Semantic Manipulation in Structured Academic Figures/);
  assert.match(html, /Training-Free Concept Disentanglement/);
  assert.match(html, /Revisiting FreeU/);
  assert.match(html, /t330034007@mail\.bnbu\.edu\.cn/);
  assert.match(html, /https:\/\/github\.com\/QCYTSN/);
  assert.match(html, /href=["']#home["']/);
  assert.match(html, /href=["']#projects["']/);
  assert.match(html, /href=["']#research["']/);
  assert.match(html, /href=["']#profile["']/);
  assert.match(html, /School/);
  assert.match(html, /Major/);
  assert.match(html, /Selected coursework/);
  assert.match(html, /中文/);
  assert.match(html, /semantic-figure-manipulation\.(?:png|webp)/);
  assert.match(html, /detection-guided-attention\.(?:png|webp)/);
  assert.match(html, /dynamic-freeu\.(?:png|webp)/);
  assert.doesNotMatch(html, /AutoDraftman|In progress|GPA|3\.01|17784321536/i);
});
