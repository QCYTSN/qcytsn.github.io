"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { ResearchId } from "./ResearchDemos";

export type NeuralDirection = {
  id: ResearchId;
  label: string;
  summary: string;
};

type NeuralFieldProps = {
  directions: readonly NeuralDirection[];
  onSelectResearch: (id: ResearchId) => void;
};

const directionAnchors = [
  { x: 39, y: 34, path: "M92 92L178 58L234 184L192 304" },
  { x: 56, y: 42, path: "M178 58L270 108L338 226L398 318" },
  { x: 48, y: 67, path: "M124 212L234 184L286 360L360 468" },
] as const;

const nodes = [
  [92, 92], [178, 58], [270, 108], [366, 62], [472, 120],
  [124, 212], [234, 184], [338, 226], [442, 198], [526, 254],
  [76, 336], [192, 304], [286, 360], [398, 318], [494, 374],
  [148, 450], [258, 426], [360, 468], [470, 438],
] as const;

const edges = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,6],[2,7],[3,8],[4,8],
  [5,6],[6,7],[7,8],[8,9],[5,10],[6,11],[7,12],[8,13],[9,14],
  [10,11],[11,12],[12,13],[13,14],[10,15],[11,15],[11,16],[12,16],
  [12,17],[13,17],[13,18],[14,18],[15,16],[16,17],[17,18],
] as const;

export function NeuralField({ directions, onSelectResearch }: NeuralFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [activeDirection, setActiveDirection] = useState<number | null>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const field = fieldRef.current;
    if (!field) return;
    const bounds = field.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    field.style.setProperty("--pointer-x", x.toFixed(3));
    field.style.setProperty("--pointer-y", y.toFixed(3));
    if (event.pointerType === "touch") return;
    const px = ((event.clientX - bounds.left) / bounds.width) * 100;
    const py = ((event.clientY - bounds.top) / bounds.height) * 100;
    const nearest = directionAnchors
      .map((anchor, index) => ({ index, distance: Math.hypot(px - anchor.x, py - anchor.y) }))
      .sort((a, b) => a.distance - b.distance)[0];
    setActiveDirection(nearest.distance <= 13 ? nearest.index : null);
  };

  const activateDirection = (index: number) => {
    const touchOnly = window.matchMedia("(hover: none)").matches;
    if (touchOnly && activeDirection !== index) {
      setActiveDirection(index);
      return;
    }
    onSelectResearch(directions[index].id);
  };

  const resetPointer = () => {
    fieldRef.current?.style.setProperty("--pointer-x", "0");
    fieldRef.current?.style.setProperty("--pointer-y", "0");
    const focusInside = fieldRef.current?.contains(document.activeElement);
    if (!focusInside && !window.matchMedia("(hover: none)").matches) setActiveDirection(null);
  };

  return (
    <div
      className={`neural-field ${activeDirection !== null ? "has-active-direction" : ""}`}
      ref={fieldRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
      style={{ "--pointer-x": "0", "--pointer-y": "0" } as React.CSSProperties}
    >
      <div className="neural-ambient" aria-hidden="true" />
      <div className="neural-layer neural-layer-back" aria-hidden="true">
        <span>LATENT / 04</span>
        <div className="tensor-grid">
          {Array.from({ length: 35 }, (_, index) => <i key={index} />)}
        </div>
      </div>

      <div className="neural-layer neural-layer-network" aria-hidden="true">
        <svg viewBox="0 0 600 540" role="presentation">
          <defs>
            <radialGradient id="nodeGlow">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".35" stopColor="#b9c8ff" />
              <stop offset="1" stopColor="#4267ef" />
            </radialGradient>
            <filter id="softGlow" x="-200%" y="-200%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g className="network-edges">
            {edges.map(([from, to], index) => (
              <line key={index} x1={nodes[from][0]} y1={nodes[from][1]} x2={nodes[to][0]} y2={nodes[to][1]} />
            ))}
          </g>
          <g className="signal-path">
            <path d={directionAnchors[activeDirection ?? 1].path} />
            <circle r="4">
              <animateMotion
                dur="4.2s"
                repeatCount="indefinite"
                path={directionAnchors[activeDirection ?? 1].path}
              />
            </circle>
          </g>
          <g className="network-nodes">
            {nodes.map(([x, y], index) => (
              <g key={index} className={index === 7 || index === 12 ? "is-core" : ""}>
                <circle className="node-halo" cx={x} cy={y} r={index === 7 || index === 12 ? 20 : 11} />
                <circle className="node-point" cx={x} cy={y} r={index === 7 || index === 12 ? 6 : 3.2} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="neural-layer neural-layer-front" aria-hidden="true">
        <div className="attention-card">
          <span>ATTENTION FIELD</span>
          <strong>Q · K<sup>T</sup></strong>
          <div className="attention-map">{Array.from({ length: 48 }, (_, index) => <i key={index} />)}</div>
        </div>
        <div className="vector-card">
          <span>FEATURE VECTOR</span>
          <strong>z<sub>t</sub> ∈ ℝ<sup>4×64×64</sup></strong>
          <div>{[.28,.7,.45,.92,.56,.34,.78,.51].map((value, index) => <i key={index} style={{ "--bar": value } as React.CSSProperties} />)}</div>
        </div>
      </div>

      <div className="neural-directions">
        {directions.map((direction, index) => (
          <button
            key={direction.id}
            className="neural-direction"
            type="button"
            aria-pressed={activeDirection === index}
            style={{ left: `${directionAnchors[index].x}%`, top: `${directionAnchors[index].y}%` }}
            onPointerEnter={() => setActiveDirection(index)}
            onFocus={() => setActiveDirection(index)}
            onClick={() => activateDirection(index)}
          >
            <i aria-hidden="true" />
            <span>{direction.label}</span>
          </button>
        ))}
      </div>

      <div className="neural-axis" aria-hidden="true"><i /><i /><i /><span>representation space</span></div>
      <div className="neural-readout" aria-live="polite">
        <span>{activeDirection === null ? "MODEL STATE" : directions[activeDirection].summary}</span>
        <strong>{activeDirection === null ? "ACTIVE" : directions[activeDirection].label}</strong>
        <i />
      </div>
    </div>
  );
}
