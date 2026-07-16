"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Language } from "./content";

const archiveCopy = {
  en: {
    label: "Optical archive / 03",
    plate: "Archival plate A-17",
    modes: ["Figure", "Compare", "Structure"],
    hint: "Drag to compare · Click to lock focus",
    focus: "Focus locked / vector edge",
    source: "Source",
    sourceValue: "Manuscript scan",
    resolution: "Resolution",
    resolutionValue: "600 dpi",
    format: "Format",
    formatValue: "Pixel / vector",
    date: "Date",
    dateValue: "2025–04–26",
    lab: "Lab",
    labValue: "BNBU Vision Lab",
  },
  zh: {
    label: "视觉档案 / 03",
    plate: "档案图版 A-17",
    modes: ["图像", "对照", "结构"],
    hint: "拖动比较 · 点击锁定观察点",
    focus: "焦点已锁定 / 向量边缘",
    source: "来源",
    sourceValue: "手稿扫描",
    resolution: "分辨率",
    resolutionValue: "600 dpi",
    format: "格式",
    formatValue: "像素 / 向量",
    date: "日期",
    dateValue: "2025–04–26",
    lab: "实验室",
    labValue: "BNBU 视觉实验室",
  },
} as const;

const modeSplits = [86, 50, 14] as const;

export function OpticalArchive({ language }: { language: Language }) {
  const labels = archiveCopy[language];
  const [split, setSplit] = useState(50);
  const [mode, setMode] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [locked, setLocked] = useState(false);
  const [focus, setFocus] = useState({ x: 78, y: 34 });
  const startRef = useRef({ x: 0, y: 0, moved: false });

  const locate = (event: PointerEvent<HTMLDivElement>, updateSplit: boolean) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(8, Math.min(90, ((event.clientY - bounds.top) / bounds.height) * 100));
    if (updateSplit) {
      setSplit(x);
      setMode(1);
    }
    if (!locked || updateSplit) setFocus({ x, y });
  };

  const setArchiveMode = (index: number) => {
    setMode(index);
    setSplit(modeSplits[index]);
    setLocked(false);
  };

  const adjustSplit = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setMode(1);
    setSplit((current) => Math.max(8, Math.min(92, current + (event.key === "ArrowLeft" ? -3 : 3))));
  };

  return (
    <div
      className={`optical-archive ${dragging ? "is-dragging" : ""} ${locked ? "is-locked" : ""}`}
      data-mode={mode}
      style={{ "--archive-split": `${split}%`, "--focus-x": `${focus.x}%`, "--focus-y": `${focus.y}%` } as CSSProperties}
    >
      <div className="archive-header">
        <span>{labels.label}</span>
        <strong>{labels.plate}</strong>
      </div>

      <div className="archive-mode-selector" role="group" aria-label={language === "zh" ? "显示模式" : "Display mode"}>
        {labels.modes.map((label, index) => (
          <button key={label} type="button" className={mode === index ? "is-active" : ""} onClick={() => setArchiveMode(index)} aria-pressed={mode === index}>
            {label}
          </button>
        ))}
      </div>

      <div
        className="archive-field"
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          startRef.current = { x: event.clientX, y: event.clientY, moved: false };
          setDragging(true);
          locate(event, true);
        }}
        onPointerMove={(event) => {
          if (dragging) {
            if (Math.hypot(event.clientX - startRef.current.x, event.clientY - startRef.current.y) > 5) startRef.current.moved = true;
            locate(event, true);
          } else if (!locked) {
            locate(event, false);
          }
        }}
        onPointerUp={(event) => {
          if (!startRef.current.moved) setLocked((current) => !current);
          setDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => setDragging(false)}
        onPointerLeave={() => { if (!dragging && !locked) setFocus({ x: 78, y: 34 }); }}
      >
        <Image className="archive-image archive-image-composite" src="/images/hero/optical-specimen-premium-composite.png" alt="Pixel evidence compared with recovered vector structure" fill sizes="(max-width: 820px) 100vw, 48vw" priority unoptimized />
        <div className="archive-pixel-layer" aria-hidden="true">
          <Image className="archive-image" src="/images/hero/optical-specimen-pixel.png" alt="" fill sizes="(max-width: 820px) 100vw, 48vw" priority unoptimized />
        </div>
        <div className="archive-structure-layer" aria-hidden="true">
          <Image className="archive-image" src="/images/hero/optical-specimen-structure.png" alt="" fill sizes="(max-width: 820px) 100vw, 48vw" priority unoptimized />
        </div>
        <div className="archive-grid" aria-hidden="true" />
        <div className="archive-divider" role="slider" tabIndex={0} aria-label={language === "zh" ? "像素与结构比较位置" : "Pixel and structure comparison position"} aria-valuemin={8} aria-valuemax={92} aria-valuenow={Math.round(split)} onKeyDown={adjustSplit}>
          <span aria-hidden="true"><i /></span>
        </div>
        <div className="archive-lens" aria-hidden="true" />
        <span className="archive-focus-label">{locked ? labels.focus : labels.hint}</span>
      </div>

      <div className="archive-metadata">
        <span><small>{labels.source}</small>{labels.sourceValue}</span>
        <span><small>{labels.resolution}</small>{labels.resolutionValue}</span>
        <span><small>{labels.format}</small>{labels.formatValue}</span>
        <span><small>{labels.date}</small>{labels.dateValue}</span>
        <span><small>{labels.lab}</small>{labels.labValue}</span>
      </div>
    </div>
  );
}
