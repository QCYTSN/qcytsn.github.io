"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { NeuralField } from "./NeuralField";
import { ResearchDemo, type ResearchId } from "./ResearchDemos";
import { portfolioContent, type Language } from "./content";

type ViewId = "home" | "projects" | "research" | "profile";
type PortfolioRoute = { view: ViewId; research: ResearchId | null };

const viewIds: ViewId[] = ["home", "projects", "research", "profile"];
const researchIds: ResearchId[] = ["visual-reasoning", "vlm-evaluation", "generative-models"];
const researchHashes: Record<ResearchId, string> = {
  "visual-reasoning": "#research/visual-reasoning",
  "vlm-evaluation": "#research/vlm-evaluation",
  "generative-models": "#research/generative-models",
};
const VIEW_COVER_MS = 180;
const VIEW_RELEASE_MS = 40;
const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;

function routeFromHash(hash: string): PortfolioRoute {
  const candidate = hash.replace("#", "");
  if (candidate.startsWith("research/")) {
    const research = candidate.split("/")[1] as ResearchId;
    if (researchIds.includes(research)) return { view: "research", research };
  }
  const view = candidate as ViewId;
  return { view: viewIds.includes(view) ? view : "home", research: null };
}

export function PortfolioExperience() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeView, setActiveView] = useState<ViewId>("home");
  const [activeResearch, setActiveResearch] = useState<ResearchId | null>(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const coverTimeoutRef = useRef<number | null>(null);
  const releaseTimeoutRef = useRef<number | null>(null);
  const committedRouteRef = useRef<PortfolioRoute>({ view: "home", research: null });
  const pendingRouteRef = useRef<PortfolioRoute | null>(null);
  const showRouteRef = useRef<(next: ViewId, research: ResearchId | null, updateHistory: boolean) => void>(() => {});
  const content = portfolioContent[language];
  const selectedResearch = content.interests.find((interest) => interest.slug === activeResearch) ?? null;

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 820);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  useEffect(() => {
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  const clearPendingTransition = useCallback(() => {
    if (coverTimeoutRef.current !== null) window.clearTimeout(coverTimeoutRef.current);
    if (releaseTimeoutRef.current !== null) window.clearTimeout(releaseTimeoutRef.current);
    coverTimeoutRef.current = null;
    releaseTimeoutRef.current = null;
    pendingRouteRef.current = null;
  }, []);

  const showRoute = useCallback((next: ViewId, research: ResearchId | null, updateHistory: boolean) => {
    const destination = { view: next, research: next === "research" ? research : null };
    const committed = committedRouteRef.current;
    const pending = pendingRouteRef.current;

    if (pending?.view === destination.view && pending.research === destination.research) return;
    clearPendingTransition();
    if (committed.view === destination.view && committed.research === destination.research) {
      setTransitioning(false);
      return;
    }

    pendingRouteRef.current = destination;
    setTransitioning(true);
    coverTimeoutRef.current = window.setTimeout(() => {
      if (pendingRouteRef.current !== destination) return;
      coverTimeoutRef.current = null;
      pendingRouteRef.current = null;
      committedRouteRef.current = destination;
      setActiveView(destination.view);
      setActiveResearch(destination.research);
      if (updateHistory) {
        window.history.pushState(null, "", destination.research ? researchHashes[destination.research] : `#${destination.view}`);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
      releaseTimeoutRef.current = window.setTimeout(() => {
        releaseTimeoutRef.current = null;
        setTransitioning(false);
      }, VIEW_RELEASE_MS);
    }, VIEW_COVER_MS);
  }, [clearPendingTransition]);

  useEffect(() => {
    showRouteRef.current = showRoute;
  }, [showRoute]);

  const showView = useCallback((next: ViewId, updateHistory: boolean) => {
    showRoute(next, null, updateHistory);
  }, [showRoute]);

  useEffect(() => {
    const initialFrame = window.requestAnimationFrame(() => {
      const initialRoute = routeFromHash(window.location.hash);
      committedRouteRef.current = initialRoute;
      if (initialRoute.view !== "home") setActiveView(initialRoute.view);
      setActiveResearch(initialRoute.research);
    });

    let historyFrame = 0;
    const handleHistoryChange = () => {
      window.cancelAnimationFrame(historyFrame);
      historyFrame = window.requestAnimationFrame(() => {
        const route = routeFromHash(window.location.hash);
        showRouteRef.current(route.view, route.research, false);
      });
    };
    window.addEventListener("hashchange", handleHistoryChange);
    window.addEventListener("popstate", handleHistoryChange);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.cancelAnimationFrame(historyFrame);
      clearPendingTransition();
      window.removeEventListener("hashchange", handleHistoryChange);
      window.removeEventListener("popstate", handleHistoryChange);
    };
  }, [clearPendingTransition]);

  const navigate = (view: ViewId) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showView(view, true);
  };

  const openResearch = (research: ResearchId) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    showRoute("research", research, true);
  };

  const switchLanguage = () => setLanguage((current) => current === "en" ? "zh" : "en");

  return (
    <main className={`portfolio-page ${loading ? "is-loading" : "reveal-ready"} ${transitioning ? "is-transitioning" : ""}`} data-page-visible={pageVisible}>
      <div className="site-loader" aria-hidden={!loading} data-active={loading}>
        <div className="loader-mark" aria-hidden="true"><i /><i /><i /></div>
        <p>{content.loaderLabel}</p>
        <span>FG / 26</span>
      </div>

      <div className="view-transition" aria-hidden="true"><span /><span /></div>

      <header className="site-header">
        <a className="wordmark" href="#home" onClick={navigate("home")} aria-label={`${content.name}, Home`}>
          <span>FG</span><span>{content.name}</span>
        </a>
        <p className="header-context">Research portfolio <span>/</span> BNBU</p>
        <div className="header-tools">
          <button className="language-toggle" type="button" onClick={switchLanguage} aria-label={`Switch language. Current: ${content.languageName}`}>
            <span>{content.languageAction}</span><i aria-hidden="true" />
          </button>
          <a className="header-contact" href={`mailto:${content.contact.email}`}>{content.contactAction}<Arrow diagonal /></a>
        </div>
      </header>

      <div className="portfolio-shell">
        <nav className="view-navigation" aria-label={content.navigationLabel}>
          <span className="nav-caption">INDEX / 04</span>
          <div>
            <i
              className="nav-active-marker"
              aria-hidden="true"
              style={{ "--nav-index": viewIds.indexOf(activeView) } as React.CSSProperties}
            />
            {content.navigation.map((item, index) => {
              const view = item.href.slice(1) as ViewId;
              return (
                <a key={item.href} href={item.href} onClick={navigate(view)} aria-current={activeView === view ? "page" : undefined}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <i aria-hidden="true" />
                </a>
              );
            })}
          </div>
          <p>CV · VLM · GEN AI</p>
        </nav>

        <div className="view-stage">
          <section className={`view-panel home-view ${activeView === "home" ? "is-active" : ""}`} id="home" aria-hidden={activeView !== "home"}>
            <div className="hero-copy">
              <p className="eyebrow">{content.eyebrow}</p>
              <h1>{content.headline}</h1>
              <p className="hero-description">{content.description}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#projects" onClick={navigate("projects")}>{content.primaryAction}<Arrow /></a>
                <a className="text-link" href="#profile" onClick={navigate("profile")}>{content.secondaryAction}<Arrow /></a>
              </div>
              <div className="hero-footnote">
                <div className="project-signal"><i aria-hidden="true" />{content.signal}</div>
                <span className="interaction-hint">MOVE TO EXPLORE / 3D FIELD</span>
              </div>
            </div>
            <div className="hero-visual">
              <span className="visual-label">NEURAL REPRESENTATION / 01</span>
              <NeuralField
                directions={content.interests.map((interest) => ({
                  id: interest.slug,
                  label: interest.title,
                  summary: interest.heroLabel,
                }))}
                onSelectResearch={(id) => showRoute("research", id, true)}
              />
              <span className="visual-caption">Latent space · Attention · Visual reasoning</span>
            </div>
          </section>

          <section className={`view-panel projects-view ${activeView === "projects" ? "is-active" : ""}`} id="projects" aria-hidden={activeView !== "projects"}>
            <div className="view-heading">
              <p className="section-number">{content.workKicker}</p>
              <div><h2>{content.workTitle}</h2><p>{content.workIntro}</p></div>
            </div>
            <div className="paper-grid">
              {content.papers.map((paper, index) => (
                <article className="paper-card" key={paper.title} style={{ "--paper-order": index } as React.CSSProperties}>
                  <div className="paper-visual">
                    <div className="paper-visual-head"><span>PROJECT / {String(index + 1).padStart(2, "0")}</span><span>{paper.year}</span></div>
                    <div className="paper-image-frame">
                      <Image src={paper.cover} alt={paper.figureAlt[language]} width={1105} height={1430} sizes="(max-width: 820px) 84vw, 26vw" unoptimized />
                    </div>
                  </div>
                  <div className="paper-copy">
                    <div className="paper-meta"><span>{language === "zh" ? paper.statusZh : paper.status}</span><span>{paper.authors}</span></div>
                    <h3>{paper.title}</h3>
                    <p className="paper-description">{paper.description[language]}</p>
                    <p className="paper-contribution">{paper.contribution[language]}</p>
                    <div className="paper-actions">
                      <a href={paper.pdf} target="_blank" rel="noreferrer">{content.readPaper}<Arrow diagonal /></a>
                      {paper.code && <a href={paper.code} target="_blank" rel="noreferrer">{content.viewCode}<Arrow diagonal /></a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={`view-panel research-view ${activeView === "research" ? "is-active" : ""} ${activeResearch ? "has-detail" : ""}`} id="research" aria-hidden={activeView !== "research"}>
            {!activeResearch || !selectedResearch ? (
              <div className="research-index">
                <div className="view-heading">
                  <p className="section-number">{content.researchKicker}</p>
                  <div><h2>{content.researchTitle}</h2></div>
                </div>
                <div className="interest-list">
                  {content.interests.map((interest, index) => (
                    <a className="research-entry" key={interest.title} href={researchHashes[interest.slug]} onClick={openResearch(interest.slug)}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{interest.title}</h3>
                      <p>{interest.description}</p>
                      <strong>{content.researchExplore}</strong>
                      <i aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="research-detail">
                <a className="research-back" href="#research" onClick={navigate("research")}><span aria-hidden="true">←</span>{content.researchBack}</a>
                <div className="research-detail-heading">
                  <div>
                    <p className="section-number">{content.conceptDemoLabel}</p>
                    <h2>{selectedResearch.title}</h2>
                  </div>
                  <div>
                    <p>{selectedResearch.detailIntro}</p>
                    <ul>{selectedResearch.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
                    <span>{selectedResearch.detailNote}</span>
                  </div>
                </div>
                <ResearchDemo id={activeResearch} language={language} />
                <details className="demo-explainer">
                  <summary><span>{content.demoGuideLabel}</span><i aria-hidden="true" /></summary>
                  <div className="demo-explainer-content">
                    {content.demoGuideHeadings.map((heading, index) => (
                      <section key={heading}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <h3>{heading}</h3>
                        <p>{selectedResearch.guide[index]}</p>
                      </section>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </section>

          <section className={`view-panel profile-view ${activeView === "profile" ? "is-active" : ""}`} id="profile" aria-hidden={activeView !== "profile"}>
            <div className="profile-intro">
              <p className="section-number">{content.profileKicker}</p>
              <h2>{content.profileTitle}</h2>
              <p>{content.about}</p>
            </div>
            <div className="profile-grid">
              <article className="profile-item profile-email"><span>{content.profileLabels.email}</span><a href={`mailto:${content.contact.email}`}>{content.contact.email}<Arrow diagonal /></a></article>
              <article className="profile-item profile-school"><span>{content.profileLabels.school}</span><p>{content.school}</p></article>
              <article className="profile-item"><span>{content.profileLabels.major}</span><p>{content.major}</p></article>
              <article className="profile-item"><span>{content.profileLabels.github}</span><a href={content.contact.github} target="_blank" rel="noreferrer">{content.contact.githubLabel}<Arrow diagonal /></a></article>
              <article className="profile-item profile-list"><span>{content.profileLabels.coursework}</span><ul>{content.coursework.map((course) => <li key={course}>{course}</li>)}</ul></article>
              <article className="profile-item profile-list"><span>{content.profileLabels.directions}</span><ul>{content.directionNames.map((direction) => <li key={direction}>{direction}</li>)}</ul></article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
