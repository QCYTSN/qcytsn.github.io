"use client";

import { useState, type PointerEvent } from "react";
import type { Language } from "./content";

export type ResearchId = "visual-reasoning" | "vlm-evaluation" | "generative-models";

const copy = {
  en: {
    scanner: "Evidence scanner",
    entities: ["Plot", "Trend", "Caption"],
    evidence: "Recovered evidence",
    relation: "supports",
    corruption: "Visual corruption",
    modes: ["Blur", "Compression", "Occlusion"],
    question: "Which method achieves the highest score?",
    correct: "Method B",
    wrong: "Method A",
    confidence: "Model confidence",
    diagnosis: "Diagnosis",
    stable: "Stable visual grounding",
    failed: "Evidence localization failed",
    denoising: "Denoising progress",
    structure: "Structure guidance",
    texture: "Texture energy",
    prompt: "Prompt tokens",
    result: "Generated state",
    timestep: "Timestep",
  },
  zh: {
    scanner: "证据扫描镜",
    entities: ["图形", "趋势", "图注"],
    evidence: "已恢复证据",
    relation: "支持",
    corruption: "视觉扰动",
    modes: ["模糊", "压缩", "遮挡"],
    question: "哪一种方法取得了最高分？",
    correct: "方法 B",
    wrong: "方法 A",
    confidence: "模型置信度",
    diagnosis: "诊断结果",
    stable: "视觉定位稳定",
    failed: "证据定位失败",
    denoising: "去噪进度",
    structure: "结构引导",
    texture: "纹理能量",
    prompt: "提示词 Token",
    result: "生成状态",
    timestep: "时间步",
  },
} as const;

export function VisualEvidenceDemo({ language }: { language: Language }) {
  const labels = copy[language];
  const [scan, setScan] = useState(54);
  const [selected, setSelected] = useState(1);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setScan(Math.max(8, Math.min(92, ((event.clientX - bounds.left) / bounds.width) * 100)));
  };

  return (
    <div className="demo-stage evidence-demo evidence-scanner" onPointerMove={onPointerMove} style={{ "--scan": `${scan}%` } as React.CSSProperties}>
      <div className="demo-toolbar">
        <span>{labels.scanner}</span><strong>{Math.round(scan)}%</strong>
      </div>
      <div className="evidence-canvas">
        <svg className="evidence-base" viewBox="0 0 760 430" role="img" aria-label="Structured chart scene">
          <rect width="760" height="430" fill="#e7dfcf" />
          <rect x="42" y="42" width="676" height="346" fill="#f8f4ea" stroke="#171b1a" strokeOpacity=".35" />
          <text x="76" y="88" className="scene-title">MODEL PERFORMANCE / CONTROLLED STUDY</text>
          <path d="M102 322H516M102 322V132" className="scene-axis" />
          <rect x="144" y="244" width="58" height="78" fill="#91a7ee" />
          <rect x="244" y="188" width="58" height="134" fill="#2850d8" />
          <rect x="344" y="217" width="58" height="105" fill="#6684e7" />
          <rect x="444" y="154" width="58" height="168" fill="#1737a2" />
          <path d="M173 230L273 172L373 204L473 138" className="scene-trend" />
          <circle cx="173" cy="230" r="5" /><circle cx="273" cy="172" r="5" /><circle cx="373" cy="204" r="5" /><circle cx="473" cy="138" r="5" />
          <text x="142" y="347">A</text><text x="244" y="347">B</text><text x="344" y="347">C</text><text x="444" y="347">D</text>
          <rect x="556" y="133" width="126" height="158" fill="#ded5c3" />
          <path d="M576 161H656M576 181H640M576 223H661M576 243H646M576 263H656" className="caption-lines" />
          <text x="576" y="317" className="scene-caption">FIG. 04 / RESULTS</text>
        </svg>
        <div className="evidence-overlay">
          <svg viewBox="0 0 760 430" role="presentation">
            <rect x="126" y="122" width="394" height="216" className={`vision-box ${selected === 0 ? "is-selected" : ""}`} />
            <rect x="150" y="126" width="340" height="120" className={`vision-box vision-box-trend ${selected === 1 ? "is-selected" : ""}`} />
            <rect x="546" y="118" width="146" height="184" className={`vision-box ${selected === 2 ? "is-selected" : ""}`} />
            <path d="M322 106C392 72 510 72 574 107M520 232C554 220 570 208 588 192" className="evidence-links" />
            <circle cx="322" cy="106" r="7" /><circle cx="574" cy="107" r="7" /><circle cx="520" cy="232" r="7" /><circle cx="588" cy="192" r="7" />
            <text x="132" y="116">ENTITY / PLOT</text><text x="552" y="112">ENTITY / CAPTION</text>
          </svg>
        </div>
        <i className="scanner-line"><span>{Math.round(scan)}</span></i>
      </div>
      <div className="evidence-readout">
        <div className="entity-selector" role="group" aria-label={labels.evidence}>
          {labels.entities.map((entity, index) => (
            <button key={entity} type="button" className={selected === index ? "is-active" : ""} onClick={() => setSelected(index)}>{String(index + 1).padStart(2,"0")} / {entity}</button>
          ))}
        </div>
        <div className="relation-readout"><span>{labels.entities[selected]}</span><i /> <em>{labels.relation}</em><i /> <span>{labels.entities[(selected + 1) % 3]}</span></div>
      </div>
    </div>
  );
}

export function VlmRobustnessDemo({ language }: { language: Language }) {
  const labels = copy[language];
  const [severity, setSeverity] = useState(24);
  const [corruption, setCorruption] = useState(0);
  const failureThreshold = [62, 54, 46][corruption];
  const failed = severity >= failureThreshold;
  const confidence = Math.max(12, Math.round(96 - severity * (corruption === 2 ? .92 : .72)));

  return (
    <div className="demo-stage vlm-demo" style={{ "--severity": severity / 100 } as React.CSSProperties}>
      <div className="demo-toolbar">
        <span>VLM ROBUSTNESS ARENA</span><strong>CASE / 017</strong>
      </div>
      <div className="vlm-arena">
        <div className="benchmark-pane">
          <div className={`benchmark-chart corruption-${corruption}`} style={{ "--blur": `${severity * .055}px` } as React.CSSProperties}>
            <svg viewBox="0 0 480 330" role="img" aria-label="Benchmark bar chart">
              <rect width="480" height="330" fill="#f8f4ea" />
              <text x="34" y="42" className="chart-title">ALIGNMENT SCORE ↑</text>
              <path d="M58 280H446M58 280V72" className="chart-axis" />
              {[0,1,2,3].map((index) => <path key={index} d={`M58 ${110 + index * 43}H446`} className="chart-grid" />)}
              <rect x="92" y="184" width="66" height="96" fill="#8fa5eb" />
              <rect x="204" y="112" width="66" height="168" fill="#2850d8" />
              <rect x="316" y="150" width="66" height="130" fill="#b45b3c" />
              <text x="112" y="305">A</text><text x="224" y="305">B</text><text x="336" y="305">C</text>
              <text x="212" y="101" className="chart-value">0.87</text>
            </svg>
            {corruption === 1 && <div className="compression-grid" />}
            {corruption === 2 && <div className="occlusion-block" style={{ height: `${20 + severity * 1.8}px` }} />}
          </div>
          <p>{labels.question}</p>
        </div>
        <div className={`model-pane ${failed ? "has-failed" : ""}`}>
          <span>MODEL RESPONSE</span>
          <strong>{failed ? labels.wrong : labels.correct}</strong>
          <div className="confidence-meter"><i style={{ width: `${confidence}%` }} /></div>
          <p><span>{labels.confidence}</span><b>{confidence}%</b></p>
          <div className="diagnosis-card"><span>{labels.diagnosis}</span><strong>{failed ? labels.failed : labels.stable}</strong><i /></div>
        </div>
      </div>
      <div className="robustness-controls">
        <div className="corruption-selector" role="group" aria-label={labels.corruption}>
          {labels.modes.map((mode, index) => <button key={mode} type="button" className={corruption === index ? "is-active" : ""} onClick={() => setCorruption(index)}>{mode}</button>)}
        </div>
        <label><span>{labels.corruption}</span><input type="range" min="0" max="100" value={severity} onChange={(event) => setSeverity(Number(event.target.value))} /><strong>{severity}%</strong></label>
      </div>
    </div>
  );
}

export function GenerativeControlDemo({ language }: { language: Language }) {
  const labels = copy[language];
  const [denoising, setDenoising] = useState(68);
  const [structure, setStructure] = useState(72);
  const [texture, setTexture] = useState(56);
  const [token, setToken] = useState(0);
  const tokens = ["red hat", "blue scarf", "gold light"];

  return (
    <div className="demo-stage generative-demo" style={{ "--denoise": denoising / 100, "--structure": structure / 100, "--texture": texture / 100 } as React.CSSProperties}>
      <div className="demo-toolbar"><span>LATENT CONTROL CONSOLE</span><strong>SD / INFERENCE</strong></div>
      <div className="generation-console">
        <div className="prompt-panel">
          <span>{labels.prompt}</span>
          <div>{tokens.map((item, index) => <button key={item} type="button" className={token === index ? "is-active" : ""} onClick={() => setToken(index)}>{item}</button>)}</div>
          <div className="latent-vector"><span>z<sub>t</sub></span>{Array.from({length:18},(_,index)=><i key={index} />)}</div>
        </div>
        <div className="latent-canvas">
          <div className="latent-grid" />
          <div className={`generated-portrait token-${token}`}>
            <div className="portrait-glow" />
            <div className="cat-ear left" /><div className="cat-ear right" />
            <div className="cat-head"><i className="eye left" /><i className="eye right" /><i className="nose" /></div>
            <div className="attribute-shape" />
            <div className="attention-heat" />
            <div className="noise-field" />
          </div>
          <div className="spatial-box"><span>{tokens[token]}</span><i /><i /><i /><i /></div>
        </div>
        <div className="generation-readout">
          <span>{labels.result}</span>
          <div><b>{labels.timestep}</b><strong>{Math.round(50 - denoising * .5)}</strong></div>
          <div><b>CFG</b><strong>7.5</strong></div>
          <div><b>ATTN</b><strong>{Math.round(structure * .92)}%</strong></div>
          <div className="spectrum">{Array.from({length:16},(_,index)=><i key={index} style={{height:`${18 + ((index * 17 + texture) % 58)}%`}} />)}</div>
        </div>
      </div>
      <div className="generation-controls">
        {[
          [labels.denoising, denoising, setDenoising],
          [labels.structure, structure, setStructure],
          [labels.texture, texture, setTexture],
        ].map(([label, value, setter]) => (
          <label key={String(label)}><span>{String(label)}</span><input type="range" min="0" max="100" value={Number(value)} onChange={(event) => (setter as (value:number)=>void)(Number(event.target.value))} /><strong>{Number(value)}%</strong></label>
        ))}
      </div>
    </div>
  );
}

export function ResearchDemo({ id, language }: { id: ResearchId; language: Language }) {
  if (id === "visual-reasoning") return <VisualEvidenceDemo language={language} />;
  if (id === "vlm-evaluation") return <VlmRobustnessDemo language={language} />;
  return <GenerativeControlDemo language={language} />;
}
