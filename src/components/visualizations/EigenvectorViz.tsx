import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import {
  computeEigen2,
  m2apply,
  v2norm,
  type Mat2,
  type Vec2,
  type Eigen2Result,
} from '../../lib/linearAlgebra';
import type { SolutionFrame } from '../../content/types';

// ── World ↔ screen ──────────────────────────────────────────────────────────
const CANVAS_W = 640;
const CANVAS_H = 440;
const CENTER_X = CANVAS_W / 2;
const CENTER_Y = CANVAS_H / 2;
const UNIT = 40; // pixels per world unit

const w2sX = (x: number) => CENTER_X + x * UNIT;
const w2sY = (y: number) => CENTER_Y - y * UNIT;
const s2wX = (sx: number) => (sx - CENTER_X) / UNIT;
const s2wY = (sy: number) => (CENTER_Y - sy) / UNIT;

// Maximum world coord we'll let v range to
const WORLD_MAX = 8;

// ── Presets ──────────────────────────────────────────────────────────────────
const PRESETS: Record<string, Mat2> = {
  'Default (upper triangular)': [[2, 1], [0, 3]],
  'Diagonal (pure stretch)': [[2, 0], [0, 0.5]],
  'Rotation (complex eigenvalues)': [[0, -1], [1, 0]],
  'Shear (defective)': [[2, 1], [0, 2]],
  'Singular (zero eigenvalue)': [[2, 4], [1, 2]],
  'Identity': [[1, 0], [0, 1]],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function isFiniteMatrix(A: Mat2): boolean {
  return (
    Number.isFinite(A[0][0]) &&
    Number.isFinite(A[0][1]) &&
    Number.isFinite(A[1][0]) &&
    Number.isFinite(A[1][1])
  );
}

function clampToCanvas(v: Vec2): { v: Vec2; clipped: boolean } {
  const max = WORLD_MAX;
  const n = v2norm(v);
  if (n > max) {
    return { v: [(v[0] / n) * max, (v[1] / n) * max], clipped: true };
  }
  return { v, clipped: false };
}

function eigenLineEndpoints(vec: Vec2): { x1: number; y1: number; x2: number; y2: number } {
  const n = v2norm(vec);
  if (n < 1e-10) return { x1: 0, y1: 0, x2: 0, y2: 0 };
  const ux = vec[0] / n;
  const uy = vec[1] / n;
  const t = 100; // far past canvas
  return {
    x1: w2sX(-ux * t),
    y1: w2sY(-uy * t),
    x2: w2sX(ux * t),
    y2: w2sY(uy * t),
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpV2(a: Vec2, b: Vec2, t: number): Vec2 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

function lerpM2(a: Mat2, b: Mat2, t: number): Mat2 {
  return [
    [lerp(a[0][0], b[0][0], t), lerp(a[0][1], b[0][1], t)],
    [lerp(a[1][0], b[1][0], t), lerp(a[1][1], b[1][1], t)],
  ];
}

// ── Component types ─────────────────────────────────────────────────────────
interface ControlledProps {
  controlled: true;
  frame: SolutionFrame;
  prevFrame: SolutionFrame | null;
  t: number;
}

interface InteractiveProps {
  controlled?: false;
}

type Props = ControlledProps | InteractiveProps;

// ── Main component ──────────────────────────────────────────────────────────
export function EigenvectorViz(props: Props) {
  if (props.controlled) {
    return <ControlledEigenvectorViz frame={props.frame} prevFrame={props.prevFrame} t={props.t} />;
  }
  return <InteractiveEigenvectorViz />;
}

// ── Interactive mode ────────────────────────────────────────────────────────
function InteractiveEigenvectorViz() {
  const [matrix, setMatrix] = useState<Mat2>([[2, 1], [0, 3]]);
  const [v, setV] = useState<Vec2>([1.5, 1]);
  const lastValidMatrix = useRef<Mat2>([[2, 1], [0, 3]]);
  const [toast, setToast] = useState<string | null>(null);

  const updateMatrix = useCallback((next: Mat2) => {
    if (!isFiniteMatrix(next)) {
      setMatrix(lastValidMatrix.current);
      setToast('invalid matrix — reverted');
      setTimeout(() => setToast(null), 1800);
      return;
    }
    lastValidMatrix.current = next;
    setMatrix(next);
  }, []);

  const setEntry = (i: 0 | 1, j: 0 | 1) => (val: number) => {
    const next: Mat2 = [
      [matrix[0][0], matrix[0][1]],
      [matrix[1][0], matrix[1][1]],
    ];
    next[i][j] = val;
    updateMatrix(next);
  };

  const applyPreset = (name: string) => {
    const M = PRESETS[name];
    if (M) updateMatrix(M);
  };

  return (
    <div style={{ position: 'relative', maxWidth: CANVAS_W }}>
      <VizCanvas matrix={matrix} v={v} onDragV={setV} />
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <MatrixCell label="a₁₁" value={matrix[0][0]} onChange={setEntry(0, 0)} />
          <MatrixCell label="a₁₂" value={matrix[0][1]} onChange={setEntry(0, 1)} />
          <MatrixCell label="a₂₁" value={matrix[1][0]} onChange={setEntry(1, 0)} />
          <MatrixCell label="a₂₂" value={matrix[1][1]} onChange={setEntry(1, 1)} />
          <select
            onChange={(e) => {
              applyPreset(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            className="viz-preset-select"
          >
            <option value="" disabled>Preset…</option>
            {Object.keys(PRESETS).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {toast && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--warn)',
            color: 'var(--warn)',
            padding: '6px 12px',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            zIndex: 10,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Controlled mode ─────────────────────────────────────────────────────────
function ControlledEigenvectorViz({
  frame,
  prevFrame,
  t,
}: {
  frame: SolutionFrame;
  prevFrame: SolutionFrame | null;
  t: number;
}) {
  const stateNow = (frame.vizState ?? {}) as Record<string, unknown>;
  const statePrev = (prevFrame?.vizState ?? stateNow) as Record<string, unknown>;

  // Determine matrix + v with interpolation
  const matrix: Mat2 = useMemo(() => {
    const mNow = (stateNow.matrix as Mat2 | undefined) ?? null;
    const mPrev = (statePrev.matrix as Mat2 | undefined) ?? null;
    if (mNow && mPrev) return lerpM2(mPrev, mNow, t);
    if (mNow) return mNow;
    // Default: identity-like for problems that don't specify a matrix.
    // Use diag(lambda, lambda) so v stays an eigenvector.
    const lambda =
      typeof stateNow.lambda === 'number' ? (stateNow.lambda as number) : 2;
    return [[lambda, 0], [0, lambda]];
  }, [stateNow, statePrev, t]);

  const v: Vec2 = useMemo(() => {
    const vNow = (stateNow.v as Vec2 | undefined) ?? null;
    const vPrev = (statePrev.v as Vec2 | undefined) ?? null;
    if (vNow && vPrev) return lerpV2(vPrev, vNow, t);
    if (vNow) return vNow;
    return [1.5, 1];
  }, [stateNow, statePrev, t]);

  const stage =
    t > 0.5
      ? (stateNow.stage as string | undefined) ?? 'final'
      : (statePrev.stage as string | undefined) ?? (stateNow.stage as string | undefined) ?? 'initial';

  // For proof-style stages (no matrix in vizState), show progressive arrows:
  //   'apply-once', 'pull-scalar', 'final'           → also show A²v
  //   'apply-inverse', 'simplify', 'final-inverse'   → also show A⁻¹v = (1/λ) v
  const showA2v = !stateNow.matrix && /apply-once|pull-scalar|final$/.test(stage);
  const showAInvV = !stateNow.matrix && /apply-inverse|simplify|final-inverse/.test(stage);

  return (
    <div style={{ maxWidth: CANVAS_W }}>
      <VizCanvas
        matrix={matrix}
        v={v}
        stage={stage}
        showA2v={showA2v}
        showAInvV={showAInvV}
      />
    </div>
  );
}

// ── The shared SVG canvas (renders the math) ────────────────────────────────
interface VizCanvasProps {
  matrix: Mat2;
  v: Vec2;
  onDragV?: (next: Vec2) => void;
  stage?: string;
  showA2v?: boolean;
  showAInvV?: boolean;
}

function VizCanvas({ matrix, v, onDragV, stage, showA2v, showAInvV }: VizCanvasProps) {
  const eigen = useMemo(() => computeEigen2(matrix), [matrix]);
  const Av = useMemo(() => m2apply(matrix, v), [matrix, v]);

  const A2v = useMemo(() => m2apply(matrix, Av), [matrix, Av]);
  // A⁻¹v for diagonal-stretch matrices (used in proof problems: A = λI ⇒ A⁻¹ = (1/λ)I)
  const AInvV: Vec2 = useMemo(() => {
    const lambda = matrix[0][0];
    if (Math.abs(lambda) < 1e-9) return [0, 0];
    return [v[0] / lambda, v[1] / lambda];
  }, [matrix, v]);

  const { v: vClamped } = clampToCanvas(v);
  const { v: AvClamped, clipped: avClipped } = clampToCanvas(Av);
  const { v: A2vClamped, clipped: a2vClipped } = clampToCanvas(A2v);
  const { v: AInvVClamped } = clampToCanvas(AInvV);

  const vIsZero = v2norm(v) < 1e-9;
  const AvIsZero = v2norm(Av) < 1e-9;
  const A2vIsZero = v2norm(A2v) < 1e-9;
  const AInvVIsZero = v2norm(AInvV) < 1e-9;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        width="100%"
        style={{
          display: 'block',
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          touchAction: 'none',
        }}
      >
        <Grid />
        <Axes />
        <EigenLayer eigen={eigen} />
        {!vIsZero && <Vector x1={CENTER_X} y1={CENTER_Y} x2={w2sX(vClamped[0])} y2={w2sY(vClamped[1])} color="var(--accent)" label="v" labelOffset={10} />}
        {!AvIsZero && <Vector x1={CENTER_X} y1={CENTER_Y} x2={w2sX(AvClamped[0])} y2={w2sY(AvClamped[1])} color="var(--warn)" label="Av" labelOffset={-14} clipped={avClipped} />}
        {AvIsZero && <circle cx={CENTER_X} cy={CENTER_Y} r={4} fill="var(--warn)" />}
        {showA2v && !A2vIsZero && (
          <Vector
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={w2sX(A2vClamped[0])}
            y2={w2sY(A2vClamped[1])}
            color="var(--viz-purple)"
            label="A²v = λ²v"
            labelOffset={-14}
            clipped={a2vClipped}
          />
        )}
        {showAInvV && !AInvVIsZero && (
          <Vector
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={w2sX(AInvVClamped[0])}
            y2={w2sY(AInvVClamped[1])}
            color="var(--viz-green)"
            label="A⁻¹v = v/λ"
            labelOffset={-14}
          />
        )}
        {onDragV && !vIsZero && (
          <DragHandle cx={w2sX(vClamped[0])} cy={w2sY(vClamped[1])} onDrag={(sx, sy) => onDragV([s2wX(sx), s2wY(sy)])} />
        )}
        {/* Always-present invisible drag handle near origin so user can grab even when v is small */}
        {onDragV && vIsZero && (
          <DragHandle cx={w2sX(0.5)} cy={w2sY(0.5)} onDrag={(sx, sy) => onDragV([s2wX(sx), s2wY(sy)])} />
        )}
        <CornerAnnotation eigen={eigen} />
      </svg>
      <Overlay matrix={matrix} eigen={eigen} stage={stage} />
    </div>
  );
}

// ── Sub-renderers ───────────────────────────────────────────────────────────

function Grid() {
  const lines: React.ReactNode[] = [];
  for (let i = -8; i <= 8; i++) {
    lines.push(
      <line key={`vx-${i}`} x1={w2sX(i)} y1={0} x2={w2sX(i)} y2={CANVAS_H} stroke="var(--viz-grid)" strokeWidth={0.5} />
    );
    lines.push(
      <line key={`hy-${i}`} x1={0} y1={w2sY(i)} x2={CANVAS_W} y2={w2sY(i)} stroke="var(--viz-grid)" strokeWidth={0.5} />
    );
  }
  return <g>{lines}</g>;
}

function Axes() {
  return (
    <g>
      <line x1={0} y1={CENTER_Y} x2={CANVAS_W} y2={CENTER_Y} stroke="var(--viz-axis)" strokeWidth={1} />
      <line x1={CENTER_X} y1={0} x2={CENTER_X} y2={CANVAS_H} stroke="var(--viz-axis)" strokeWidth={1} />
    </g>
  );
}

function EigenLayer({ eigen }: { eigen: Eigen2Result }) {
  const EPS = 1e-7;
  switch (eigen.kind) {
    case 'real': {
      const nodes: React.ReactNode[] = [];
      const [v1, v2] = eigen.vectors;
      const [l1, l2] = eigen.values;
      const nullSpaceLambda = Math.abs(l1) < EPS ? 0 : Math.abs(l2) < EPS ? 1 : -1;
      const e1 = eigenLineEndpoints(v1);
      const e2 = eigenLineEndpoints(v2);
      nodes.push(<line key="el1" {...e1} stroke="var(--viz-yellow)" strokeWidth={1} strokeDasharray="6 5" opacity={0.5} />);
      // If the two eigenvectors are nearly parallel (very ill-conditioned), draw only one to avoid duplicate
      const dot = v1[0] * v2[0] + v1[1] * v2[1];
      if (Math.abs(Math.abs(dot) - 1) > 1e-3) {
        nodes.push(<line key="el2" {...e2} stroke="var(--viz-yellow)" strokeWidth={1} strokeDasharray="6 5" opacity={0.5} />);
      }
      // Annotation for null space line if singular
      if (nullSpaceLambda !== -1) {
        const vec = nullSpaceLambda === 0 ? v1 : v2;
        const lx = w2sX(vec[0] * 3);
        const ly = w2sY(vec[1] * 3);
        nodes.push(
          <text key="ns" x={lx} y={ly} fill="var(--viz-yellow)" opacity={0.6} fontFamily="var(--font-mono)" fontSize={10}>
            λ = 0 (null space)
          </text>
        );
      }
      return <g>{nodes}</g>;
    }
    case 'repeated': {
      // Defective: one line; non-defective: full-canvas tint
      if (eigen.defective && eigen.vector) {
        const e = eigenLineEndpoints(eigen.vector);
        return <line {...e} stroke="var(--viz-yellow)" strokeWidth={1} strokeDasharray="6 5" opacity={0.5} />;
      }
      // Non-defective repeated: A = λI. If λ=0, every direction collapses (don't tint).
      if (Math.abs(eigen.value) < EPS) return null;
      return <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="var(--viz-yellow)" opacity={0.04} />;
    }
    case 'complex':
      return null;
  }
}

function CornerAnnotation({ eigen }: { eigen: Eigen2Result }) {
  if (eigen.kind !== 'complex') return null;
  return (
    <text
      x={CANVAS_W - 14}
      y={CANVAS_H - 14}
      textAnchor="end"
      fill="var(--viz-yellow)"
      opacity={0.6}
      fontFamily="var(--font-mono)"
      fontSize={10}
    >
      complex eigenvalues — no real invariant lines
    </text>
  );
}

function Vector({
  x1,
  y1,
  x2,
  y2,
  color,
  label,
  labelOffset,
  clipped,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  label: string;
  labelOffset: number;
  clipped?: boolean;
}) {
  const arrowSize = 8;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const ax = x2 - ux * arrowSize - uy * arrowSize * 0.5;
  const ay = y2 - uy * arrowSize + ux * arrowSize * 0.5;
  const bx = x2 - ux * arrowSize + uy * arrowSize * 0.5;
  const by = y2 - uy * arrowSize - ux * arrowSize * 0.5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} opacity={clipped ? 0.5 : 1} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} opacity={clipped ? 0.5 : 1} />
      <text
        x={x2 + uy * labelOffset}
        y={y2 - ux * labelOffset}
        fill={color}
        fontFamily="var(--font-mono)"
        fontStyle="italic"
        fontSize={12}
      >
        {label}
      </text>
    </g>
  );
}

function DragHandle({ cx, cy, onDrag }: { cx: number; cy: number; onDrag: (sx: number, sy: number) => void }) {
  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement;
    if (!svg) return;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const move = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      // Map client -> svg viewBox coordinates
      const sx = ((ev.clientX - rect.left) / rect.width) * CANVAS_W;
      const sy = ((ev.clientY - rect.top) / rect.height) * CANVAS_H;
      onDrag(sx, sy);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <g style={{ cursor: 'grab' }} onPointerDown={onPointerDown}>
      <circle cx={cx} cy={cy} r={14} fill="transparent" />
      <circle cx={cx} cy={cy} r={5} fill="var(--accent)" stroke="var(--bg-base)" strokeWidth={2} />
    </g>
  );
}

function Overlay({
  matrix,
  eigen,
  stage,
}: {
  matrix: Mat2;
  eigen: Eigen2Result;
  stage?: string;
}) {
  const matrixLatex = `A = \\begin{pmatrix} ${matrix[0][0].toFixed(2)} & ${matrix[0][1].toFixed(2)} \\\\ ${matrix[1][0].toFixed(2)} & ${matrix[1][1].toFixed(2)} \\end{pmatrix}`;

  let eigenText: string;
  switch (eigen.kind) {
    case 'real': {
      const [l1, l2] = eigen.values;
      const EPS = 1e-7;
      if (Math.abs(l1) < EPS || Math.abs(l2) < EPS) {
        eigenText = `λ₁ = ${l1.toFixed(2)}, λ₂ = ${l2.toFixed(2)}  (singular)`;
      } else {
        eigenText = `λ₁ = ${l1.toFixed(2)}, λ₂ = ${l2.toFixed(2)}`;
      }
      break;
    }
    case 'repeated': {
      const EPS = 1e-7;
      if (Math.abs(eigen.value) < EPS) {
        eigenText = `λ = 0.00  (all directions collapse to origin)`;
      } else if (eigen.defective) {
        eigenText = `λ = ${eigen.value.toFixed(2)} (repeated, defective — only one eigenvector direction)`;
      } else {
        eigenText = `λ = ${eigen.value.toFixed(2)} (repeated, all directions are eigenvectors)`;
      }
      break;
    }
    case 'complex':
      eigenText = `λ = ${eigen.real.toFixed(2)} ± ${eigen.imag.toFixed(2)}i  (no real eigenvectors)`;
      break;
  }

  return (
    <div
      className="glass"
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        padding: '10px 14px',
        borderRadius: 6,
        maxWidth: 280,
      }}
    >
      <div style={{ fontSize: 12, marginBottom: 6 }}>
        <BlockMath math={matrixLatex} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
        {eigenText}
      </div>
      {stage && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-tertiary)',
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          stage: {stage}
        </div>
      )}
    </div>
  );
}

// ── Matrix entry control ────────────────────────────────────────────────────
function MatrixCell({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [text, setText] = useState(value.toFixed(2));
  useEffect(() => setText(value.toFixed(2)), [value]);

  const commit = (raw: string) => {
    const n = Number(raw);
    if (Number.isFinite(n)) onChange(n);
    else setText(value.toFixed(2));
  };

  // horizontal drag-to-scrub
  const dragRef = useRef<{ startX: number; startVal: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startVal: value };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const next = Math.max(-5, Math.min(5, dragRef.current.startVal + dx * 0.01));
    onChange(Number(next.toFixed(2)));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 4,
        padding: '6px 10px',
        cursor: 'ew-resize',
        userSelect: 'none',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
        {label}
      </span>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          outline: 'none',
          cursor: 'text',
        }}
      />
    </div>
  );
}
