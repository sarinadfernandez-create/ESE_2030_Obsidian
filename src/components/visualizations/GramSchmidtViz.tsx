import { useState, useMemo, useEffect, useRef } from 'react';
import { BlockMath } from 'react-katex';
import {
  v3normalize,
  v3project,
  v3sub,
  v3norm,
  v3dot,
  v3lerp,
  isometricProject,
  type Vec3,
} from '../../lib/linearAlgebra';
import type { SolutionFrame } from '../../content/types';

const CANVAS_W = 640;
const CANVAS_H = 500;
const CENTER_X = CANVAS_W / 2;
const CENTER_Y = CANVAS_H / 2 + 30;
const SCALE = 60;
const WORLD_MAX = 5;

type Vec3Triple = [Vec3, Vec3, Vec3];

const PRESETS: Record<string, Vec3Triple> = {
  'Default (general 3D)': [[1, 1, 0], [1, 0, 1], [0, 1, 1]],
  'Already orthogonal': [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  'Two parallel vectors': [[1, 0, 0], [2, 0, 0], [0, 1, 0]],
  'Linearly dependent (sum)': [[1, 0, 0], [0, 1, 0], [1, 1, 0]],
};

const STEP_NAMES = ['start', 'e₁', 'proj₁', 'u₂', 'e₂', 'proj₂', 'e₃'];
const STEP_FORMULAS = [
  '\\text{initial vectors } v_1, v_2, v_3',
  'e_1 = \\dfrac{v_1}{\\|v_1\\|}',
  '\\operatorname{proj}_{e_1}(v_2) = \\langle v_2, e_1 \\rangle e_1',
  'u_2 = v_2 - \\operatorname{proj}_{e_1}(v_2)',
  'e_2 = \\dfrac{u_2}{\\|u_2\\|}',
  '\\operatorname{proj}_{e_1}(v_3),\\ \\operatorname{proj}_{e_2}(v_3)',
  'e_3 = \\dfrac{u_3}{\\|u_3\\|}',
];

// ── Step computation ────────────────────────────────────────────────────────

interface StepState {
  // What to render at each step. Vectors are in world coords.
  v1: Vec3 | null;
  v2: Vec3 | null;
  v3: Vec3 | null;
  e1: Vec3 | null;
  e2: Vec3 | null;
  e3: Vec3 | null;
  // Projection vectors to highlight (faint colored vectors)
  projOnE1OfV2: Vec3 | null;
  projOnE1OfV3: Vec3 | null;
  projOnE2OfV3: Vec3 | null;
  // Failure mode
  failureMessage: string | null;
}

function computeStep(vectors: Vec3Triple, step: number): StepState {
  const [v1, v2, v3] = vectors;
  const EPS = 1e-8;

  const out: StepState = {
    v1: null, v2: null, v3: null,
    e1: null, e2: null, e3: null,
    projOnE1OfV2: null, projOnE1OfV3: null, projOnE2OfV3: null,
    failureMessage: null,
  };

  // Always show original v1, v2, v3 prior to processing each
  if (step >= 0) {
    out.v1 = v1;
    out.v2 = v2;
    out.v3 = v3;
  }

  // Step 1+: e1
  const v1Norm = v3norm(v1);
  if (step >= 1) {
    if (v1Norm < EPS) {
      out.failureMessage = 'Cannot normalize the zero vector.';
      return out;
    }
    out.e1 = v3normalize(v1);
    // After step 1 the "v1" arrow is replaced by e1
    if (step >= 1) out.v1 = null;
  }

  // Step 2: show projection of v2 onto e1
  if (step >= 2 && out.e1) {
    out.projOnE1OfV2 = v3project(v2, out.e1);
  }

  // Step 3: u2 (v2 - proj)
  let u2: Vec3 | null = null;
  if (step >= 3 && out.e1) {
    u2 = v3sub(v2, v3project(v2, out.e1));
    out.v2 = u2; // v2 has slid to u2
    out.projOnE1OfV2 = null; // projection is gone
  }

  // Step 4: e2
  if (step >= 4) {
    if (u2 === null && out.e1) u2 = v3sub(v2, v3project(v2, out.e1));
    if (!u2 || v3norm(u2) < EPS) {
      out.failureMessage = 'Step failed: u₂ = 0 — vectors are linearly dependent';
      out.v2 = null;
      return out;
    }
    out.e2 = v3normalize(u2);
    out.v2 = null;
  }

  // Step 5: projections of v3 onto e1 and e2
  if (step >= 5 && out.e1 && out.e2) {
    out.projOnE1OfV3 = v3project(v3, out.e1);
    out.projOnE2OfV3 = v3project(v3, out.e2);
  }

  // Step 6: e3
  if (step >= 6 && out.e1 && out.e2) {
    const u3 = v3sub(v3sub(v3, v3project(v3, out.e1)), v3project(v3, out.e2));
    if (v3norm(u3) < EPS) {
      out.failureMessage = 'Step failed: u₃ = 0 — vectors are linearly dependent';
      out.v3 = null;
      out.projOnE1OfV3 = null;
      out.projOnE2OfV3 = null;
      return out;
    }
    out.e3 = v3normalize(u3);
    out.v3 = null;
    out.projOnE1OfV3 = null;
    out.projOnE2OfV3 = null;
  }

  return out;
}

// Lerp between two step states (per-vector lerp; nulls remain nulls)
function lerpStep(a: StepState, b: StepState, t: number): StepState {
  const lerpField = (av: Vec3 | null, bv: Vec3 | null): Vec3 | null => {
    if (av && bv) return v3lerp(av, bv, t);
    if (bv) return bv;
    if (av) return av;
    return null;
  };
  return {
    v1: lerpField(a.v1, b.v1),
    v2: lerpField(a.v2, b.v2),
    v3: lerpField(a.v3, b.v3),
    e1: lerpField(a.e1, b.e1),
    e2: lerpField(a.e2, b.e2),
    e3: lerpField(a.e3, b.e3),
    projOnE1OfV2: lerpField(a.projOnE1OfV2, b.projOnE1OfV2),
    projOnE1OfV3: lerpField(a.projOnE1OfV3, b.projOnE1OfV3),
    projOnE2OfV3: lerpField(a.projOnE2OfV3, b.projOnE2OfV3),
    failureMessage: t > 0.5 ? b.failureMessage : a.failureMessage,
  };
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

// Map controlled-mode stage strings to step numbers
function stageToStep(stage: string | undefined): number {
  switch (stage) {
    case 'initial': return 0;
    case 'normalize-v1': return 1;
    case 'project-v2': return 2;
    case 'subtract-v2': return 3;
    case 'final': return 4;
    case 'gs-degenerate-1': return 4;
    case 'gs-degenerate-2': return 5;
    case 'gs-degenerate-3':
    case 'gs-degenerate-4': return 6;
    default: return 0;
  }
}

// ── Main component ──────────────────────────────────────────────────────────

export function GramSchmidtViz(props: Props) {
  if (props.controlled) return <ControlledGS {...props} />;
  return <InteractiveGS />;
}

// ── Interactive ─────────────────────────────────────────────────────────────

function InteractiveGS() {
  const [vectors, setVectors] = useState<Vec3Triple>(PRESETS['Default (general 3D)']);
  const [step, setStep] = useState(0);
  const [tweenT, setTweenT] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const stepNow = useMemo(() => computeStep(vectors, step), [vectors, step]);
  const stepPrev = useMemo(() => computeStep(vectors, Math.max(0, step - 1)), [vectors, step]);
  const renderState = useMemo(() => lerpStep(stepPrev, stepNow, tweenT), [stepPrev, stepNow, tweenT]);

  const failed = stepNow.failureMessage !== null;

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    let prevTime = performance.now();
    const tick = (now: number) => {
      const dt = (now - prevTime) / 1500; // 1.5s per step
      prevTime = now;
      setTweenT((prev) => {
        const next = prev + dt;
        if (next >= 1) {
          setStep((s) => {
            if (s >= 6) {
              setIsPlaying(false);
              return 6;
            }
            return s + 1;
          });
          return 0;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  // When step changes externally (manual nav), snap tween to 1
  const lastStepRef = useRef(step);
  useEffect(() => {
    if (step !== lastStepRef.current && !isPlaying) {
      setTweenT(1);
      lastStepRef.current = step;
    }
  }, [step, isPlaying]);

  const handlePreset = (name: string) => {
    const preset = PRESETS[name];
    if (preset) {
      setVectors(preset);
      setStep(0);
      setTweenT(1);
      setIsPlaying(false);
    }
  };

  const setVectorEntry = (vi: 0 | 1 | 2, ci: 0 | 1 | 2, value: number) => {
    const next: Vec3Triple = [
      [...vectors[0]] as Vec3,
      [...vectors[1]] as Vec3,
      [...vectors[2]] as Vec3,
    ];
    if (Number.isFinite(value)) next[vi][ci] = value;
    setVectors(next);
    setStep(0);
    setTweenT(1);
  };

  return (
    <div style={{ position: 'relative', maxWidth: CANVAS_W }}>
      <GSCanvas state={renderState} step={step} />
      <StepFormulaOverlay step={step} failed={failed} />

      {/* Slider */}
      <div style={{ marginTop: 16 }}>
        <input
          type="range"
          min={0}
          max={6}
          step={0.01}
          value={step + (tweenT < 1 ? tweenT - 1 : 0)}
          onChange={(e) => {
            const v = Number(e.target.value);
            const nextStep = Math.floor(v);
            const nextT = v - nextStep;
            setIsPlaying(false);
            setStep(Math.max(0, Math.min(6, nextStep)));
            setTweenT(nextT === 0 && nextStep > 0 ? 1 : nextT === 0 ? 1 : nextT);
          }}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-tertiary)',
            marginTop: 4,
          }}
        >
          {STEP_NAMES.map((name, i) => (
            <span key={i} style={{ color: i === step ? 'var(--accent)' : undefined }}>
              {name}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <button
            className="graph-control-btn"
            onClick={() => {
              setStep((s) => Math.max(0, s - 1));
              setTweenT(1);
              setIsPlaying(false);
            }}
            disabled={step === 0}
          >
            ◀ prev
          </button>
          <button
            className="graph-control-btn"
            onClick={() => setIsPlaying((p) => !p)}
            disabled={failed && step >= 6}
          >
            {isPlaying ? '⏸ pause' : '▶ play'}
          </button>
          <button
            className="graph-control-btn"
            onClick={() => {
              setStep((s) => Math.min(6, s + 1));
              setTweenT(1);
              setIsPlaying(false);
            }}
            disabled={step === 6 || failed}
          >
            next ▶
          </button>
          <select
            className="viz-preset-select"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) handlePreset(e.target.value);
              e.target.value = '';
            }}
          >
            <option value="" disabled>Preset…</option>
            {Object.keys(PRESETS).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Vector inputs */}
        <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
          {([0, 1, 2] as const).map((vi) => (
            <div key={vi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', width: 24 }}>
                v{vi + 1}
              </span>
              {([0, 1, 2] as const).map((ci) => (
                <input
                  key={ci}
                  type="number"
                  step={0.1}
                  value={vectors[vi][ci]}
                  onChange={(e) => setVectorEntry(vi, ci, Number(e.target.value))}
                  style={{
                    width: 60,
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    padding: '4px 6px',
                    borderRadius: 3,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Controlled ──────────────────────────────────────────────────────────────

function ControlledGS({ frame, prevFrame, t }: { frame: SolutionFrame; prevFrame: SolutionFrame | null; t: number }) {
  const stateNow = (frame.vizState ?? {}) as Record<string, unknown>;
  const statePrev = (prevFrame?.vizState ?? stateNow) as Record<string, unknown>;

  const vectors: Vec3Triple = useMemo(() => {
    const v1 = (stateNow.v1 as Vec3) ?? [1, 0, 0];
    const v2 = (stateNow.v2 as Vec3) ?? [0, 1, 0];
    const v3 = (stateNow.v3 as Vec3) ?? [0, 0, 1];
    return [v1, v2, v3];
  }, [stateNow]);

  const stepNow = stageToStep(stateNow.stage as string | undefined);
  const stepPrev = stageToStep(statePrev.stage as string | undefined);

  const sNow = useMemo(() => computeStep(vectors, stepNow), [vectors, stepNow]);
  const sPrev = useMemo(() => computeStep(vectors, stepPrev), [vectors, stepPrev]);
  const render = useMemo(() => lerpStep(sPrev, sNow, t), [sPrev, sNow, t]);

  return (
    <div style={{ position: 'relative', maxWidth: CANVAS_W }}>
      <GSCanvas state={render} step={stepNow} />
      <StepFormulaOverlay step={stepNow} failed={!!sNow.failureMessage} />
    </div>
  );
}

// ── Canvas rendering ────────────────────────────────────────────────────────

function GSCanvas({ state, step: _step }: { state: StepState; step: number }) {
  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      width="100%"
      style={{
        display: 'block',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
      }}
    >
      <Axes3D />
      {/* Projections (drawn behind solid vectors) */}
      {state.projOnE1OfV2 && <Arrow3D v={state.projOnE1OfV2} color="var(--viz-blue)" opacity={0.45} />}
      {state.projOnE1OfV3 && <Arrow3D v={state.projOnE1OfV3} color="var(--viz-blue)" opacity={0.4} />}
      {state.projOnE2OfV3 && <Arrow3D v={state.projOnE2OfV3} color="var(--viz-yellow)" opacity={0.4} />}

      {/* Drop lines for projections */}
      {state.projOnE1OfV2 && state.v2 && <DropLine from={state.v2} to={state.projOnE1OfV2} />}

      {/* Original / sliding vectors */}
      {state.v1 && <Arrow3D v={state.v1} color="var(--viz-blue)" label="v₁" />}
      {state.v2 && <Arrow3D v={state.v2} color="var(--viz-yellow)" label="v₂" />}
      {state.v3 && <Arrow3D v={state.v3} color="var(--viz-red)" label="v₃" />}

      {/* Orthonormal vectors (e_i) */}
      {state.e1 && <Arrow3D v={state.e1} color="var(--viz-blue)" label="e₁" />}
      {state.e2 && <Arrow3D v={state.e2} color="var(--viz-yellow)" label="e₂" />}
      {state.e3 && <Arrow3D v={state.e3} color="var(--viz-red)" label="e₃" />}

      {/* Right-angle markers when basis built */}
      {state.e1 && state.e2 && <RightAngleMarker a={state.e1} b={state.e2} />}
      {state.e1 && state.e3 && <RightAngleMarker a={state.e1} b={state.e3} />}
      {state.e2 && state.e3 && <RightAngleMarker a={state.e2} b={state.e3} />}

      {/* Failure overlay */}
      {state.failureMessage && (
        <g>
          <rect x={CENTER_X - 200} y={20} width={400} height={36} fill="var(--bg-elevated)" stroke="var(--warn)" rx={4} />
          <text x={CENTER_X} y={43} textAnchor="middle" fill="var(--warn)" fontFamily="var(--font-mono)" fontSize={11}>
            {state.failureMessage}
          </text>
        </g>
      )}
    </svg>
  );
}

function Axes3D() {
  const axisLen = WORLD_MAX;
  const xEnd = isometricProject([axisLen, 0, 0], SCALE);
  const yEnd = isometricProject([0, axisLen, 0], SCALE);
  const zEnd = isometricProject([0, 0, axisLen], SCALE);
  return (
    <g>
      <line x1={CENTER_X} y1={CENTER_Y} x2={CENTER_X + xEnd[0]} y2={CENTER_Y + xEnd[1]} stroke="var(--viz-axis)" opacity={0.5} />
      <line x1={CENTER_X} y1={CENTER_Y} x2={CENTER_X + yEnd[0]} y2={CENTER_Y + yEnd[1]} stroke="var(--viz-axis)" opacity={0.5} />
      <line x1={CENTER_X} y1={CENTER_Y} x2={CENTER_X + zEnd[0]} y2={CENTER_Y + zEnd[1]} stroke="var(--viz-axis)" opacity={0.5} />
      <text x={CENTER_X + xEnd[0] + 6} y={CENTER_Y + xEnd[1]} fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize={10}>x</text>
      <text x={CENTER_X + yEnd[0] + 6} y={CENTER_Y + yEnd[1]} fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize={10}>y</text>
      <text x={CENTER_X + zEnd[0] + 6} y={CENTER_Y + zEnd[1]} fill="var(--text-tertiary)" fontFamily="var(--font-mono)" fontSize={10}>z</text>
    </g>
  );
}

function clampVec3(v: Vec3): Vec3 {
  const n = v3norm(v);
  if (n > WORLD_MAX) return [v[0] / n * WORLD_MAX, v[1] / n * WORLD_MAX, v[2] / n * WORLD_MAX];
  return v;
}

function Arrow3D({ v, color, label, opacity = 1 }: { v: Vec3; color: string; label?: string; opacity?: number }) {
  if (v3norm(v) < 1e-9) return null;
  const clamped = clampVec3(v);
  const [px, py] = isometricProject(clamped, SCALE);
  const x2 = CENTER_X + px;
  const y2 = CENTER_Y + py;
  const x1 = CENTER_X;
  const y1 = CENTER_Y;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const arrowSize = 7;
  const ax = x2 - ux * arrowSize - uy * arrowSize * 0.5;
  const ay = y2 - uy * arrowSize + ux * arrowSize * 0.5;
  const bx = x2 - ux * arrowSize + uy * arrowSize * 0.5;
  const by = y2 - uy * arrowSize - ux * arrowSize * 0.5;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} />
      {label && (
        <text x={x2 + uy * 12} y={y2 - ux * 12} fill={color} fontFamily="var(--font-mono)" fontStyle="italic" fontSize={11}>
          {label}
        </text>
      )}
    </g>
  );
}

function DropLine({ from, to }: { from: Vec3; to: Vec3 }) {
  const [fx, fy] = isometricProject(clampVec3(from), SCALE);
  const [tx, ty] = isometricProject(clampVec3(to), SCALE);
  return (
    <line
      x1={CENTER_X + fx}
      y1={CENTER_Y + fy}
      x2={CENTER_X + tx}
      y2={CENTER_Y + ty}
      stroke="var(--text-tertiary)"
      strokeWidth={0.8}
      strokeDasharray="3 3"
      opacity={0.5}
    />
  );
}

function RightAngleMarker({ a, b }: { a: Vec3; b: Vec3 }) {
  // Only draw if a and b are roughly orthogonal (within tolerance)
  const aN = v3normalize(a);
  const bN = v3normalize(b);
  if (Math.abs(v3dot(aN, bN)) > 0.05) return null;
  const size = 0.25; // world units
  const p1 = isometricProject([aN[0] * size, aN[1] * size, aN[2] * size], SCALE);
  const p2 = isometricProject([(aN[0] + bN[0]) * size, (aN[1] + bN[1]) * size, (aN[2] + bN[2]) * size], SCALE);
  const p3 = isometricProject([bN[0] * size, bN[1] * size, bN[2] * size], SCALE);
  return (
    <polyline
      points={`${CENTER_X + p1[0]},${CENTER_Y + p1[1]} ${CENTER_X + p2[0]},${CENTER_Y + p2[1]} ${CENTER_X + p3[0]},${CENTER_Y + p3[1]}`}
      fill="none"
      stroke="var(--viz-axis)"
      strokeWidth={0.8}
      opacity={0.6}
    />
  );
}

function StepFormulaOverlay({ step, failed }: { step: number; failed: boolean }) {
  return (
    <div
      className="glass"
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        padding: '10px 14px',
        borderRadius: 6,
        maxWidth: 320,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 4,
        }}
      >
        STEP {step + 1} OF 7: {STEP_NAMES[step]}
      </div>
      <div style={{ fontSize: 13 }}>
        <BlockMath math={STEP_FORMULAS[step]} />
      </div>
      {failed && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--warn)', marginTop: 4 }}>
          process halted — see canvas message
        </div>
      )}
    </div>
  );
}
