import Image from "next/image";
import type { MouseEventHandler } from "react";
import type { Language } from "./content";
import type { ResearchId } from "./ResearchDemos";

type AtlasProps = {
  language: Language;
  onResearchIndex: MouseEventHandler<HTMLAnchorElement>;
  onProfile: MouseEventHandler<HTMLAnchorElement>;
  onOpenResearch: (id: ResearchId) => MouseEventHandler<HTMLAnchorElement>;
};

const atlasCopy = {
  en: {
    eyebrow: "Researcher · Computer Vision · Vision-Language Models · Generative Models",
    headline: "How machines see—and how we can make their vision more reliable.",
    headlineLines: ["How machines see—", "and how we can make", "their vision more reliable."],
    statementLabel: "Research statement / 2026",
    statement: "My research moves between understanding visual evidence and controlling generative models, with an emphasis on interpretable experiments and practical systems. I build methods that improve reliability across perception, evaluation, and generation.",
    explore: "Explore research directions",
    profile: "View research profile",
    trajectory: "Research trajectory",
    stages: ["Understand", "Evaluate", "Control"],
    axes: "Research axes",
    method: "Method",
    period: "Period",
    affiliation: "Affiliation",
  },
  zh: {
    eyebrow: "研究者 · 计算机视觉 · 视觉语言模型 · 生成模型",
    headline: "机器如何看见，以及如何让这种视觉更加可靠。",
    headlineLines: ["机器如何看见，", "以及如何让这种视觉", "更加可靠。"],
    statementLabel: "研究陈述 / 2026",
    statement: "我的研究连接视觉证据理解与生成模型控制，重视可解释的实验设计和可检验的系统，并关注如何在感知、评估与生成过程中提升模型的可靠性。",
    explore: "探索研究方向",
    profile: "查看研究档案",
    trajectory: "研究轨迹",
    stages: ["理解", "评估", "控制"],
    axes: "研究轴线",
    method: "方法",
    period: "时间",
    affiliation: "机构",
  },
} as const;

const directions = [
  {
    id: "visual-reasoning" as const,
    title: { en: "Visual Reasoning", zh: "视觉推理" },
    question: {
      en: "How can models ground and reason over objects and their relations in the real world?",
      zh: "模型如何从真实视觉证据中定位对象，并推理对象之间的关系？",
    },
    figureTitle: { en: "Grounded visual reasoning", zh: "基于视觉证据的推理" },
    image: "/images/research/visual-reasoning.png",
    imageAlt: { en: "Detected street entities connected as a scene graph", zh: "街景实体检测结果及其场景关系图" },
    citation: "Liu et al. Visual Instruction Tuning. NeurIPS 2023.",
    paper: "https://arxiv.org/abs/2304.08485",
  },
  {
    id: "vlm-evaluation" as const,
    title: { en: "VLM Evaluation", zh: "视觉语言模型评估" },
    question: {
      en: "How can we measure and calibrate the reliability of vision-language models?",
      zh: "我们如何测量并校准视觉语言模型的可靠性？",
    },
    figureTitle: { en: "Multimodal benchmark profile", zh: "多模态基准评估剖面" },
    image: "/images/research/vlm-evaluation.png",
    imageAlt: { en: "Calibration curves and benchmark distribution for two multimodal models", zh: "两个多模态模型的校准曲线与基准分布" },
    citation: "Yue et al. MMMU: A Massive Multi-discipline Multimodal Understanding and Reasoning Benchmark for Expert AGI. CVPR 2024.",
    paper: "https://arxiv.org/abs/2311.16502",
  },
  {
    id: "generative-models" as const,
    title: { en: "Generative Models", zh: "生成模型" },
    question: {
      en: "How can we control generations while preserving fidelity and factuality?",
      zh: "如何在保持保真度与事实一致性的同时控制生成过程？",
    },
    figureTitle: { en: "Rectified-flow generation path", zh: "整流流生成轨迹" },
    image: "/images/research/generative-models.png",
    imageAlt: { en: "A sequence progressing from noise to a resolved landscape", zh: "从噪声逐步生成清晰景观的序列" },
    citation: "Esser et al. Scaling Rectified Flow Transformers for High-Resolution Image Synthesis. ICML 2024.",
    paper: "https://arxiv.org/abs/2403.03206",
  },
] as const;

export function ResearchAtlas({ language, onResearchIndex, onProfile, onOpenResearch }: AtlasProps) {
  const copy = atlasCopy[language];

  return (
    <div className="research-atlas">
      <div className="atlas-intro">
        <div className="atlas-thesis">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="atlas-title" aria-label={copy.headline}>{copy.headlineLines.map((line) => <span key={line}>{line}</span>)}</h1>
        </div>
        <aside className="atlas-statement">
          <h2>{copy.statementLabel}</h2>
          <p>{copy.statement}</p>
          <div className="atlas-actions">
            <a href="#research" onClick={onResearchIndex}><span aria-hidden="true">→</span>{copy.explore}</a>
            <a href="#profile" onClick={onProfile}>{copy.profile}<span aria-hidden="true">→</span></a>
          </div>
        </aside>
      </div>

      <div className="atlas-trajectory" aria-label={`${copy.trajectory}: ${copy.stages.join(", ")}`}>
        <strong>{copy.trajectory}</strong>
        <div>
          {copy.stages.map((stage) => <span key={stage}><i aria-hidden="true" />{stage}</span>)}
        </div>
      </div>

      <div className="atlas-directions">
        {directions.map((direction, index) => (
          <article className="atlas-direction" key={direction.id}>
            <div className="atlas-direction-heading">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2><a href={`#research/${direction.id}`} onClick={onOpenResearch(direction.id)}>{direction.title[language]}</a></h2>
                <p>{direction.question[language]}</p>
              </div>
            </div>
            <figure>
              <figcaption>{direction.figureTitle[language]}</figcaption>
              <div className="atlas-figure-frame">
                <Image src={direction.image} alt={direction.imageAlt[language]} fill sizes="(max-width: 820px) 92vw, 28vw" unoptimized />
              </div>
            </figure>
            <a className="atlas-citation" href={direction.paper} target="_blank" rel="noreferrer">{direction.citation}</a>
          </article>
        ))}
      </div>

      <div className="atlas-footer">
        <span><small>{copy.method}</small>{copy.stages.join(" · ")}</span>
        <span><small>{copy.period}</small>2023—2026</span>
        <span><small>{copy.affiliation}</small>BNBU</span>
      </div>
    </div>
  );
}
