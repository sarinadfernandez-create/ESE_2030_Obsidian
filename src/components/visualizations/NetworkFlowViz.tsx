import { useMemo, useState } from 'react';
import { computeRREF, fmtCell } from '../../lib/linearAlgebra';
import { MatrixGrid, MonoLine, PresetSelect, VizControlButton } from './_shared';

interface FNode {
  id: string;
  x: number; // canvas px
  y: number;
  supply: number;
}
interface FEdge {
  id: string;
  from: string;
  to: string;
}
interface Network {
  nodes: FNode[];
  edges: FEdge[];
}

const PRESETS: Record<string, Network> = {
  'Triangle (default)': {
    nodes: [
      { id: 'A', x: 110, y: 90, supply: 5 },
      { id: 'B', x: 380, y: 90, supply: 0 },
      { id: 'C', x: 240, y: 320, supply: -5 },
    ],
    edges: [
      { id: 'e1', from: 'A', to: 'B' },
      { id: 'e2', from: 'B', to: 'C' },
      { id: 'e3', from: 'A', to: 'C' },
    ],
  },
  'Square cycle': {
    nodes: [
      { id: 'A', x: 110, y: 90, supply: 6 },
      { id: 'B', x: 380, y: 90, supply: 0 },
      { id: 'C', x: 380, y: 320, supply: -6 },
      { id: 'D', x: 110, y: 320, supply: 0 },
    ],
    edges: [
      { id: 'e1', from: 'A', to: 'B' },
      { id: 'e2', from: 'B', to: 'C' },
      { id: 'e3', from: 'D', to: 'C' },
      { id: 'e4', from: 'A', to: 'D' },
    ],
  },
  'Tree (no cycles)': {
    nodes: [
      { id: 'A', x: 240, y: 80, supply: 10 },
      { id: 'B', x: 110, y: 240, supply: -4 },
      { id: 'C', x: 240, y: 240, supply: -3 },
      { id: 'D', x: 380, y: 240, supply: -3 },
    ],
    edges: [
      { id: 'e1', from: 'A', to: 'B' },
      { id: 'e2', from: 'A', to: 'C' },
      { id: 'e3', from: 'A', to: 'D' },
    ],
  },
  'Inconsistent supplies': {
    nodes: [
      { id: 'A', x: 110, y: 90, supply: 5 },
      { id: 'B', x: 380, y: 90, supply: 0 },
      { id: 'C', x: 240, y: 320, supply: -3 },
    ],
    edges: [
      { id: 'e1', from: 'A', to: 'B' },
      { id: 'e2', from: 'B', to: 'C' },
      { id: 'e3', from: 'A', to: 'C' },
    ],
  },
};

function buildIncidence(net: Network): {
  A: number[][];
  b: number[];
  nodeIndex: Map<string, number>;
} {
  const nodeIndex = new Map<string, number>();
  net.nodes.forEach((n, i) => nodeIndex.set(n.id, i));
  const A: number[][] = Array.from({ length: net.nodes.length }, () =>
    Array.from({ length: net.edges.length }, () => 0)
  );
  net.edges.forEach((e, j) => {
    const from = nodeIndex.get(e.from);
    const to = nodeIndex.get(e.to);
    if (from === undefined || to === undefined) return;
    if (from === to) return; // self-loop: column stays zero (any flow is a circulation)
    A[from][j] = -1; // outgoing
    A[to][j] = 1; // incoming
  });
  const b = net.nodes.map((n) => n.supply);
  return { A, b, nodeIndex };
}

// Solve Ax = b using RREF on the augmented matrix. Returns one particular solution
// (free vars set to 0) or null if inconsistent.
function solveSystem(A: number[][], b: number[]): { x: number[] | null; rank: number; nullity: number } {
  const m = A.length;
  const n = A[0]?.length ?? 0;
  if (n === 0) return { x: [], rank: 0, nullity: 0 };
  const augmented = A.map((row, i) => [...row, b[i]]);
  const { rref } = computeRREF(augmented, { partialPivot: true });
  // Inconsistent: any row with all zeros in A-part but nonzero in b-part.
  for (let r = 0; r < m; r++) {
    let allZero = true;
    for (let j = 0; j < n; j++) {
      if (Math.abs(rref[r][j]) > 1e-9) {
        allZero = false;
        break;
      }
    }
    if (allZero && Math.abs(rref[r][n]) > 1e-9) {
      // Adjust rank: rank counts rows including the consistency row, but the rank of A alone matters.
      // Compute rank of A alone:
      const { rank: rA } = computeRREF(A, { partialPivot: true });
      return { x: null, rank: rA, nullity: n - rA };
    }
  }
  // Consistent. Read off particular solution.
  const x = new Array(n).fill(0);
  // Find pivot columns in the A-part.
  const pivotCols: number[] = [];
  let r = 0;
  for (let c = 0; c < n && r < m; c++) {
    if (Math.abs(rref[r][c] - 1) < 1e-9) {
      pivotCols.push(c);
      x[c] = rref[r][n];
      r++;
    } else if (Math.abs(rref[r][c]) < 1e-9) {
      continue;
    }
  }
  return { x, rank: pivotCols.length, nullity: n - pivotCols.length };
}

export function NetworkFlowViz() {
  const [presetName, setPresetName] = useState('Triangle (default)');
  const network = PRESETS[presetName];

  const { A, b } = useMemo(() => buildIncidence(network), [network]);
  const total = b.reduce((s, x) => s + x, 0);
  const { x: solution, rank: _rank, nullity } = useMemo(() => solveSystem(A, b), [A, b]);
  const rank = _rank;
  const inconsistent = solution === null;

  const reset = () => setPresetName('Triangle (default)');

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
          {network.edges.map((e) => {
            const from = network.nodes.find((n) => n.id === e.from);
            const to = network.nodes.find((n) => n.id === e.to);
            if (!from || !to) return null;
            const idx = network.edges.findIndex((x) => x.id === e.id);
            const flow = solution ? solution[idx] : null;
            return (
              <Edge key={e.id} from={from} to={to} flow={flow} inconsistent={inconsistent} />
            );
          })}
          {network.nodes.map((n) => (
            <Node key={n.id} node={n} />
          ))}
        </svg>
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <VizControlButton onClick={reset}>reset</VizControlButton>
        </div>
      </div>

      <div style={{ flex: '0 1 280px', minWidth: 240 }}>
        <div
          style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: 14,
          }}
        >
          <MonoLine color="var(--text-tertiary)" size={9}>
            INCIDENCE MATRIX A | b
          </MonoLine>
          <div style={{ marginTop: 8, overflowX: 'auto' }}>
            <MatrixGrid
              matrix={A.map((row, i) => [...row, b[i]])}
              augmentedColumn={A[0]?.length ?? 0}
              cellSize={36}
            />
          </div>
          <div
            style={{
              marginTop: 10,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 10,
            }}
          >
            <MonoLine>rank(A) = {rank}</MonoLine>
            <MonoLine>nullity(A) = {nullity} (independent circulations)</MonoLine>
            {inconsistent ? (
              <>
                <div style={{ height: 6 }} />
                <MonoLine color="var(--warn)">
                  no flow solution exists — total supply = {fmtCell(total)} (must be 0 for consistency)
                </MonoLine>
              </>
            ) : (
              <>
                <div style={{ height: 6 }} />
                <MonoLine color="var(--success)">
                  {nullity === 0
                    ? 'unique solution'
                    : `${nullity} free parameter${nullity === 1 ? '' : 's'} (one per cycle)`}
                </MonoLine>
              </>
            )}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <PresetSelect presets={Object.keys(PRESETS)} onPick={setPresetName} />
        </div>
      </div>
    </div>
  );
}

function Node({ node }: { node: FNode }) {
  const ringColor =
    node.supply > 0 ? 'var(--success)' : node.supply < 0 ? '#ff7b6b' : 'transparent';
  return (
    <g>
      <circle cx={node.x} cy={node.y} r={20} fill="var(--accent)" fillOpacity={0.3} />
      {ringColor !== 'transparent' && (
        <circle cx={node.x} cy={node.y} r={22} fill="none" stroke={ringColor} strokeWidth={2} />
      )}
      <text
        x={node.x}
        y={node.y + 5}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={14}
        fontWeight={600}
        fill="var(--text-primary)"
      >
        {node.id}
      </text>
      <text
        x={node.x}
        y={node.y + 38}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fill={
          node.supply > 0
            ? 'var(--success)'
            : node.supply < 0
            ? '#ff7b6b'
            : 'var(--text-tertiary)'
        }
      >
        {node.supply > 0 ? `+${node.supply}` : node.supply}
      </text>
    </g>
  );
}

function Edge({
  from,
  to,
  flow,
  inconsistent,
}: {
  from: FNode;
  to: FNode;
  flow: number | null;
  inconsistent: boolean;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  // Stop short of the node circles.
  const r = 22;
  const x1 = from.x + ux * r;
  const y1 = from.y + uy * r;
  const x2 = to.x - ux * r;
  const y2 = to.y - uy * r;
  const aSize = 8;
  const ax = x2 - ux * aSize - uy * aSize * 0.6;
  const ay = y2 - uy * aSize + ux * aSize * 0.6;
  const bx = x2 - ux * aSize + uy * aSize * 0.6;
  const by = y2 - uy * aSize - ux * aSize * 0.6;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const flowColor =
    flow === null
      ? 'var(--text-muted)'
      : flow >= 0
      ? 'var(--accent-bright)'
      : 'var(--warn)';
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-secondary)" strokeWidth={1.4} />
      <polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill="var(--text-secondary)" />
      {!inconsistent && flow !== null && (
        <text
          x={mx + uy * 14}
          y={my - ux * 14}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fill={flowColor}
        >
          {fmtCell(flow)}
        </text>
      )}
    </g>
  );
}
