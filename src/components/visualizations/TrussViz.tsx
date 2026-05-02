import { useMemo, useState } from 'react';
import { computeRREF, fmtCell } from '../../lib/linearAlgebra';
import { MatrixGrid, MonoLine, PresetSelect, VizControlButton } from './_shared';

type SupportKind = 'free' | 'pin' | 'roller-x' | 'roller-y';

interface Joint {
  id: string;
  x: number; // canvas pixels
  y: number;
  pinned: SupportKind;
  load: [number, number]; // [Fx, Fy]
}
interface Bar {
  id: string;
  from: string;
  to: string;
}
interface Truss {
  joints: Joint[];
  bars: Bar[];
}

const PRESETS: Record<string, Truss> = {
  'Triangle (rigid, determinate)': {
    joints: [
      { id: 'A', x: 80, y: 280, pinned: 'pin', load: [0, 0] },
      { id: 'B', x: 360, y: 280, pinned: 'roller-y', load: [0, 0] },
      { id: 'C', x: 220, y: 100, pinned: 'free', load: [0, -10] },
    ],
    bars: [
      { id: 'AB', from: 'A', to: 'B' },
      { id: 'AC', from: 'A', to: 'C' },
      { id: 'BC', from: 'B', to: 'C' },
    ],
  },
  'Square (mechanism — collapses)': {
    joints: [
      { id: 'A', x: 90, y: 280, pinned: 'pin', load: [0, 0] },
      { id: 'B', x: 360, y: 280, pinned: 'roller-y', load: [0, 0] },
      { id: 'C', x: 360, y: 100, pinned: 'free', load: [0, 0] },
      { id: 'D', x: 90, y: 100, pinned: 'free', load: [10, 0] },
    ],
    bars: [
      { id: 'AB', from: 'A', to: 'B' },
      { id: 'BC', from: 'B', to: 'C' },
      { id: 'CD', from: 'C', to: 'D' },
      { id: 'DA', from: 'D', to: 'A' },
    ],
  },
  'Triangle + extra bar (overdetermined)': {
    joints: [
      { id: 'A', x: 80, y: 280, pinned: 'pin', load: [0, 0] },
      { id: 'B', x: 360, y: 280, pinned: 'pin', load: [0, 0] },
      { id: 'C', x: 220, y: 100, pinned: 'free', load: [0, -10] },
    ],
    bars: [
      { id: 'AB', from: 'A', to: 'B' },
      { id: 'AC', from: 'A', to: 'C' },
      { id: 'BC', from: 'B', to: 'C' },
    ],
  },
  'Cantilever': {
    joints: [
      { id: 'A', x: 90, y: 280, pinned: 'pin', load: [0, 0] },
      { id: 'B', x: 90, y: 130, pinned: 'pin', load: [0, 0] },
      { id: 'C', x: 270, y: 280, pinned: 'free', load: [0, 0] },
      { id: 'D', x: 360, y: 200, pinned: 'free', load: [10, -10] },
    ],
    bars: [
      { id: 'AB', from: 'A', to: 'B' },
      { id: 'AC', from: 'A', to: 'C' },
      { id: 'BC', from: 'B', to: 'C' },
      { id: 'BD', from: 'B', to: 'D' },
      { id: 'CD', from: 'C', to: 'D' },
    ],
  },
};

// Equilibrium matrix: rows = 2 per non-fully-pinned joint (force balance Fx, Fy).
// Columns = bar forces + reaction-component unknowns at supports.
function buildEquilibrium(t: Truss): {
  A: number[][];
  b: number[];
  reactionsCount: number;
  reactionsLabels: string[];
  barLabels: string[];
} {
  // Determine reactions per support.
  const reactionMap: { joint: string; axis: 'x' | 'y' }[] = [];
  for (const j of t.joints) {
    if (j.pinned === 'pin') {
      reactionMap.push({ joint: j.id, axis: 'x' });
      reactionMap.push({ joint: j.id, axis: 'y' });
    } else if (j.pinned === 'roller-x') {
      reactionMap.push({ joint: j.id, axis: 'x' });
    } else if (j.pinned === 'roller-y') {
      reactionMap.push({ joint: j.id, axis: 'y' });
    }
  }
  const numCols = t.bars.length + reactionMap.length;
  const numRows = t.joints.length * 2;
  const A: number[][] = Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => 0)
  );
  const b = new Array(numRows).fill(0);

  const jointIdx = new Map<string, number>();
  t.joints.forEach((j, i) => jointIdx.set(j.id, i));

  // Bar columns: each bar contributes its unit direction vector at each endpoint, with opposite signs.
  t.bars.forEach((bar, c) => {
    const from = t.joints.find((j) => j.id === bar.from)!;
    const to = t.joints.find((j) => j.id === bar.to)!;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-9) return;
    const ux = dx / len;
    // Note: SVG y is inverted (down is positive in screen space), but for a truss the math
    // doesn't care about absolute orientation as long as we're consistent. Using screen coords here.
    const uy = dy / len;
    const fromI = jointIdx.get(bar.from)!;
    const toI = jointIdx.get(bar.to)!;
    // Tension > 0: bar pulls each endpoint TOWARD the other.
    A[fromI * 2][c] = ux;
    A[fromI * 2 + 1][c] = uy;
    A[toI * 2][c] = -ux;
    A[toI * 2 + 1][c] = -uy;
  });

  // Reaction columns
  reactionMap.forEach((r, k) => {
    const i = jointIdx.get(r.joint)!;
    const col = t.bars.length + k;
    if (r.axis === 'x') A[i * 2][col] = 1;
    else A[i * 2 + 1][col] = 1;
  });

  // Loads contribute to the RHS (with opposite sign — Σ forces = applied loads, so move to RHS).
  t.joints.forEach((j, i) => {
    b[i * 2] = -j.load[0];
    b[i * 2 + 1] = -j.load[1];
  });

  return {
    A,
    b,
    reactionsCount: reactionMap.length,
    reactionsLabels: reactionMap.map((r) => `R_${r.joint}^${r.axis}`),
    barLabels: t.bars.map((b) => b.id),
  };
}

function rankOf(A: number[][]): number {
  if (A.length === 0 || A[0].length === 0) return 0;
  return computeRREF(A, { partialPivot: true }).rank;
}

function solveSystem(A: number[][], b: number[]): number[] | null {
  const m = A.length;
  const n = A[0]?.length ?? 0;
  if (n === 0) return [];
  const aug = A.map((row, i) => [...row, b[i]]);
  const { rref } = computeRREF(aug, { partialPivot: true });
  for (let r = 0; r < m; r++) {
    let allZero = true;
    for (let j = 0; j < n; j++) {
      if (Math.abs(rref[r][j]) > 1e-9) {
        allZero = false;
        break;
      }
    }
    if (allZero && Math.abs(rref[r][n]) > 1e-9) return null;
  }
  const x = new Array(n).fill(0);
  let r = 0;
  for (let c = 0; c < n && r < m; c++) {
    if (Math.abs(rref[r][c] - 1) < 1e-9) {
      x[c] = rref[r][n];
      r++;
    }
  }
  return x;
}

export function TrussViz() {
  const [presetName, setPresetName] = useState('Triangle (rigid, determinate)');
  const truss = PRESETS[presetName];
  const { A, b, reactionsCount, barLabels } = useMemo(() => buildEquilibrium(truss), [truss]);

  const rA = useMemo(() => rankOf(A), [A]);
  // Self-stresses: nullity of A
  const nullityA = (A[0]?.length ?? 0) - rA;
  // Mechanisms: nullity of A^T (rows of A)
  const AT = useMemo(() => {
    const rows = A.length;
    const cols = A[0]?.length ?? 0;
    const out: number[][] = Array.from({ length: cols }, () => Array.from({ length: rows }, () => 0));
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) out[j][i] = A[i][j];
    return out;
  }, [A]);
  const rAT = useMemo(() => rankOf(AT), [AT]);
  const mechanisms = (AT[0]?.length ?? 0) - rAT;

  const solution = useMemo(() => solveSystem(A, b), [A, b]);
  const equilibrable = solution !== null;

  const numBars = truss.bars.length;
  const numJoints = truss.joints.length;
  const maxwellCount = numBars + reactionsCount - 2 * numJoints;

  let verdict: string;
  let verdictColor = 'var(--text-secondary)';
  if (mechanisms > 0 && nullityA > 0) {
    verdict = 'both indeterminate AND underdetermined';
    verdictColor = 'var(--warn)';
  } else if (mechanisms > 0) {
    verdict = 'underdetermined — mechanisms exist (truss is not rigid)';
    verdictColor = 'var(--warn)';
  } else if (nullityA > 0) {
    verdict = 'rigid but indeterminate (self-stresses exist)';
    verdictColor = 'var(--accent-bright)';
  } else {
    verdict = 'statically determinate and rigid';
    verdictColor = 'var(--success)';
  }

  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 460px', minWidth: 460, position: 'relative' }}>
        <svg
          viewBox="0 0 480 400"
          width="100%"
          style={{
            display: 'block',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
        >
          {truss.bars.map((bar, idx) => {
            const from = truss.joints.find((j) => j.id === bar.from)!;
            const to = truss.joints.find((j) => j.id === bar.to)!;
            const force = solution ? solution[idx] : null;
            return <BarLine key={bar.id} from={from} to={to} force={force} />;
          })}
          {truss.joints.map((j) => (
            <JointDot key={j.id} joint={j} />
          ))}
        </svg>
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <VizControlButton onClick={() => setPresetName('Triangle (rigid, determinate)')}>reset</VizControlButton>
        </div>
      </div>

      <div style={{ flex: '0 1 320px', minWidth: 280 }}>
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
          }}
        >
          <MonoLine color="var(--text-tertiary)" size={9}>
            EQUILIBRIUM MATRIX A
          </MonoLine>
          <div style={{ marginTop: 8, overflowX: 'auto', paddingBottom: 4 }}>
            <MatrixGrid matrix={A} cellSize={32} />
          </div>
          <div
            style={{
              marginTop: 10,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 10,
            }}
          >
            <MonoLine>rank(A) = {rA}</MonoLine>
            <MonoLine>self-stresses: dim = {nullityA}</MonoLine>
            <MonoLine>mechanisms: dim = {mechanisms}</MonoLine>
            <MonoLine>
              Maxwell: b + r − 2j = {numBars} + {reactionsCount} − {2 * numJoints} = {maxwellCount}
            </MonoLine>
            <div style={{ height: 8 }} />
            <MonoLine color={verdictColor}>{verdict}</MonoLine>
            {!equilibrable && (
              <>
                <div style={{ height: 6 }} />
                <MonoLine color="var(--warn)">
                  load is not equilibrable — truss cannot resist applied load
                </MonoLine>
              </>
            )}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <PresetSelect presets={Object.keys(PRESETS)} onPick={setPresetName} />
        </div>

        {equilibrable && solution && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
            }}
          >
            <MonoLine color="var(--text-tertiary)" size={9}>
              BAR FORCES
            </MonoLine>
            <div style={{ height: 6 }} />
            {barLabels.map((id, i) => {
              const f = solution[i];
              const color = f > 1e-9 ? 'var(--viz-red)' : f < -1e-9 ? 'var(--viz-blue)' : 'var(--text-tertiary)';
              const tag = f > 1e-9 ? 'tension' : f < -1e-9 ? 'compression' : 'zero';
              return (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                  <span style={{ color }}>
                    {id}: {fmtCell(f)}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{tag}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function JointDot({ joint }: { joint: Joint }) {
  const hasLoad = joint.load[0] !== 0 || joint.load[1] !== 0;
  return (
    <g>
      {joint.pinned === 'pin' && (
        <polygon
          points={`${joint.x - 10},${joint.y + 10} ${joint.x + 10},${joint.y + 10} ${joint.x},${joint.y}`}
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth={1.4}
        />
      )}
      {joint.pinned === 'roller-y' && (
        <g>
          <circle cx={joint.x} cy={joint.y + 10} r={4} fill="none" stroke="var(--text-secondary)" strokeWidth={1.4} />
          <line x1={joint.x - 10} y1={joint.y + 14} x2={joint.x + 10} y2={joint.y + 14} stroke="var(--text-secondary)" strokeWidth={1.2} />
        </g>
      )}
      {joint.pinned === 'roller-x' && (
        <g>
          <circle cx={joint.x - 10} cy={joint.y} r={4} fill="none" stroke="var(--text-secondary)" strokeWidth={1.4} />
          <line x1={joint.x - 14} y1={joint.y - 10} x2={joint.x - 14} y2={joint.y + 10} stroke="var(--text-secondary)" strokeWidth={1.2} />
        </g>
      )}
      <circle cx={joint.x} cy={joint.y} r={6} fill="var(--accent)" />
      <text
        x={joint.x + 10}
        y={joint.y - 8}
        fontFamily="var(--font-mono)"
        fontSize={10}
        fill="var(--text-secondary)"
      >
        {joint.id}
      </text>
      {hasLoad && (
        <LoadArrow joint={joint} fx={joint.load[0]} fy={joint.load[1]} />
      )}
    </g>
  );
}

function LoadArrow({ joint, fx, fy }: { joint: Joint; fx: number; fy: number }) {
  // Scale: 1 unit force = 4 px
  const scale = 4;
  const x1 = joint.x;
  const y1 = joint.y;
  const x2 = joint.x + fx * scale;
  const y2 = joint.y - fy * scale; // SVG y inverted for nicer "up" arrows when fy>0
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const aSize = 7;
  const ax = x2 - ux * aSize - uy * aSize * 0.5;
  const ay = y2 - uy * aSize + ux * aSize * 0.5;
  const bx = x2 - ux * aSize + uy * aSize * 0.5;
  const by = y2 - uy * aSize - ux * aSize * 0.5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--warn)" strokeWidth={2} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill="var(--warn)" />
    </g>
  );
}

function BarLine({
  from,
  to,
  force,
}: {
  from: Joint;
  to: Joint;
  force: number | null;
}) {
  const color =
    force === null
      ? 'var(--text-secondary)'
      : Math.abs(force) < 1e-9
      ? 'var(--text-tertiary)'
      : force > 0
      ? 'var(--viz-red)'
      : 'var(--viz-blue)';
  const dashed = force !== null && Math.abs(force) < 1e-9;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      {force !== null && Math.abs(force) > 1e-9 && (
        <text
          x={mx}
          y={my - 6}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill={color}
        >
          {fmtCell(force)}
        </text>
      )}
    </g>
  );
}
