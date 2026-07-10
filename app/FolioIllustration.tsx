export function FolioIllustration() {
  const cubeHandles = [
    [312, 354], [394, 329], [452, 368], [371, 397],
    [312, 442], [394, 416], [452, 449], [371, 478],
  ];

  return (
    <div className="figure-motif" aria-hidden="true">
      <svg className="folio-illustration" viewBox="0 0 620 680" role="presentation">
        <defs>
          <pattern id="folioMicroDots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.65" fill="#244fd7" opacity="0.13" />
          </pattern>
          <pattern id="folioGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#151a1d" strokeWidth="0.75" opacity="0.24" />
          </pattern>
          <pattern id="folioHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#244fd7" strokeWidth="1" opacity="0.72" />
          </pattern>
          <filter id="folioPaperShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#151a1d" floodOpacity="0.1" />
          </filter>
        </defs>

        <rect className="folio-paper" x="1" y="1" width="618" height="678" fill="url(#folioMicroDots)" />

        <g className="registration-mark">
          <path d="M18 52V18H52M568 18H602V52M18 628V662H52M568 662H602V628" />
          <path d="M145 19V43M133 31H157M574 136V160M562 148H586M558 557V581M546 569H570" />
          <circle cx="145" cy="31" r="3" />
          <circle cx="574" cy="148" r="3" />
          <circle cx="558" cy="569" r="3" />
        </g>

        <text className="folio-index" x="574" y="72">01.</text>

        <g className="figure-caption-block">
          <text className="folio-mono cobalt-text" x="28" y="75">FIG. 1</text>
          <line className="cobalt-line" x1="28" y1="88" x2="91" y2="88" />
          <text className="folio-caption" x="28" y="110">
            <tspan x="28" dy="0">Structured representation</tspan>
            <tspan x="28" dy="13">of visual evidence as</tspan>
            <tspan x="28" dy="13">auditable primitives.</tspan>
          </text>
        </g>

        <g className="curve-editor">
          <path className="editor-axis" d="M112 262H382M168 286V72" />
          <path className="axis-arrow" d="M382 262L372 257V267ZM168 72L163 82H173Z" />
          <path className="editor-curve" d="M168 262C215 260 228 238 250 204C270 173 297 193 322 153C339 126 350 102 369 92" />
          <path className="editor-guide" d="M250 204V139M250 204H322M322 153V82M322 153H369M214 232V171M214 232H278" />
          <rect className="editor-handle" x="244" y="133" width="12" height="12" />
          <rect className="editor-handle" x="316" y="76" width="12" height="12" />
          <rect className="editor-handle" x="363" y="86" width="12" height="12" />
          <rect className="editor-handle small" x="208" y="165" width="11" height="11" />
          <circle className="editor-anchor" cx="168" cy="262" r="5" />
          <circle className="editor-anchor" cx="214" cy="232" r="4" />
          <circle className="editor-anchor" cx="250" cy="204" r="5" />
          <circle className="editor-anchor" cx="286" cy="191" r="4" />
          <circle className="editor-anchor" cx="322" cy="153" r="5" />
          <circle className="editor-open-anchor" cx="278" cy="178" r="5" />
          <rect className="editor-node" x="108" y="258" width="8" height="8" />
          <rect className="editor-node" x="378" y="258" width="8" height="8" />
          <text className="folio-serif italic" x="388" y="270">x</text>
          <text className="folio-serif italic" x="157" y="64">y</text>
        </g>

        <text className="formula top-formula" x="420" y="103">I(x,y) = Σ aₖ φₖ(x,y)</text>
        <text className="formula tensor-formula" x="454" y="137">φₖ ∈ ℝᴴˣᵂ</text>

        <g className="reference-path">
          <path d="M420 153H507V217" />
          <text className="folio-mono rust-text" x="428" y="168">[A1]</text>
        </g>

        <g className="grid-fragment" filter="url(#folioPaperShadow)">
          <rect x="46" y="300" width="184" height="194" fill="#ded5c3" />
          <rect x="61" y="317" width="150" height="157" fill="url(#folioGrid)" stroke="#151a1d" strokeWidth="0.8" opacity="0.86" />
          <path className="grid-axis" d="M79 435H195M137 457V331" />
          <path className="grid-dash" d="M88 357H186M88 397H186" />
          {[92, 122, 152, 182].flatMap((x) => [348, 382, 416, 450].map((y) => (
            <g key={`${x}-${y}`}>
              <line x1={x - 4} y1={y} x2={x + 4} y2={y} />
              <line x1={x} y1={y - 4} x2={x} y2={y + 4} />
            </g>
          )))}
          <rect className="grid-focal" x="173" y="375" width="10" height="10" />
          <circle className="grid-origin" cx="137" cy="416" r="4" />
        </g>

        <g className="underlay-sheet" filter="url(#folioPaperShadow)">
          <rect x="202" y="386" width="286" height="212" fill="#ded5c3" />
          <path d="M202 386H488M202 598H488" />
          <path className="underlay-guide" d="M236 416H442M236 444H462M236 565H456" />
        </g>

        <g className="blueprint-panel" filter="url(#folioPaperShadow)">
          <rect x="230" y="274" width="304" height="274" fill="#244fd7" />
          <rect className="hatch-tab" x="346" y="257" width="104" height="29" fill="url(#folioHatch)" />
          <path className="blueprint-crop" d="M224 286H245V265M519 265V286H540M224 536H245V557M519 557V536H540" />
          <text className="blueprint-letter" x="249" y="304">M</text>
          <path className="blueprint-cube" d="M312 354L394 329L452 368L371 397ZM312 354V442L371 478V397M371 478L452 449V368" />
          <path className="blueprint-guide" d="M394 329V416L452 449M394 416L312 442M394 416L371 478" />
          {cubeHandles.map(([x, y]) => (
            <rect className="blueprint-handle" key={`${x}-${y}`} x={x - 4} y={y - 4} width="8" height="8" />
          ))}
          <path className="blueprint-axis" d="M269 494V450M269 494H314M269 494L249 515" />
          <text className="blueprint-coordinate" x="316" y="522">vᵢ ∈ ℝ³</text>
          <path className="blueprint-output" d="M444 403H508M496 393L508 403L496 413" />
          <text className="blueprint-label" x="425" y="389">visual evidence</text>
          <path className="blueprint-vector" d="M462 338H493M485 332L493 338L485 344" />
          <text className="blueprint-coordinate" x="436" y="325">vᵢ ∈ ℝ³</text>
          <text className="blueprint-coordinate" x="403" y="502">E ∈ ℝⁿˣ²</text>
          <g className="blueprint-spark">
            <path d="M501 294V318M489 306H513" />
            <circle cx="501" cy="306" r="3" />
          </g>
        </g>

        <g className="scale-ruler">
          <path d="M579 266V501" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((tick) => (
            <line key={tick} x1="579" y1={278 + tick * 26} x2={tick % 2 === 0 ? 593 : 588} y2={278 + tick * 26} />
          ))}
          <rect x="574" y="373" width="10" height="10" />
          <text className="folio-mono cobalt-text" x="595" y="282">1.0</text>
          <text className="folio-mono cobalt-text" x="595" y="385">0.5</text>
          <text className="folio-mono cobalt-text" x="595" y="492">0.0</text>
        </g>

        <g className="constraint-legend">
          <rect className="legend-node" x="42" y="525" width="10" height="10" />
          <rect className="legend-edge" x="42" y="549" width="10" height="10" />
          <circle className="legend-anchor" cx="47" cy="579" r="5" />
          <path className="legend-constraint" d="M42 606H52M47 601V611" />
          <text x="63" y="534">Nodes</text>
          <text x="63" y="558">Edges</text>
          <text x="63" y="583">Anchors</text>
          <text x="63" y="610">Constraints</text>
        </g>

        <g className="dot-matrix">
          {[0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => (
            <circle key={`${row}-${col}`} cx={43 + col * 10} cy={642 + row * 10} r="1.8" />
          )))}
        </g>

        <g className="loss-block">
          <text className="formula" x="243" y="588">ℒ = λ₁ℒsemantic + λ₂ℒstructure</text>
          <text className="formula small-formula" x="282" y="617">+ λ₃R(M)</text>
        </g>

        <g className="reference-r">
          <path d="M449 632H527" />
          <text className="folio-mono rust-text" x="534" y="637">[R3]</text>
        </g>
      </svg>
    </div>
  );
}
