// 10.2 — Polar Decomposition A = QP (rotate after stretch) vs A = P'Q (stretch
// after rotate). Side-by-side two-stage animation; both reach the same final ellipse.

import { useEffect, useRef, useState } from 'react';
import { m2apply, type Mat2, type Vec2 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

const W = 360;
const H = 360;
const CX = W / 2;
const CY = H / 2;
const UNIT = 50;

const PRESETS: Record<string, Mat2> = {
  pureRotation: [[Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4)], [Math.sin(Math.PI / 4), Math.cos(Math.PI / 4)]],
  pureStretch: [[2, 0], [0, 0.5]],
  shear: [[1, 1], [0, 1]],
  rotateThenStretch: [[1.5, 0.5], [-0.5, 1.5]],
};

// Compute polar decomposition A = QP via SVD: A = U Σ V^T, then Q = U V^T, P = V Σ V^T.
function polarDecomp(A: Mat2): { Q: Mat2; P: Mat2; Pprime: Mat2 } {
  // Eigendecomp of A^T A → V, Σ²
  const [a, b] = A[0];
  const [c, d] = A[1];
  const m00 = a * a + c * c;
  const m11 = b * b + d * d;
  const m01 = a * b + c * d;
  const tr = m00 + m11;
  const det = m00 * m11 - m01 * m01;
  const disc = Math.max(0, tr * tr - 4 * det);
  const sqrtD = Math.sqrt(disc);
  const lambda1 = Math.max(0, (tr + sqrtD) / 2);
  const lambda2 = Math.max(0, (tr - sqrtD) / 2);
  const sigma1 = Math.sqrt(lambda1);
  const sigma2 = Math.sqrt(lambda2);

  let v1: Vec2;
  if (Math.abs(m01) > 1e-10) v1 = [lambda1 - m11, m01];
  else v1 = m00 >= m11 ? [1, 0] : [0, 1];
  const n1 = Math.hypot(v1[0], v1[1]) || 1;
  v1 = [v1[0] / n1, v1[1] / n1];
  const v2: Vec2 = [-v1[1], v1[0]];

  const u1raw = m2apply(A, v1);
  const u2raw = m2apply(A, v2);
  const u1: Vec2 = sigma1 > 1e-10 ? [u1raw[0] / sigma1, u1raw[1] / sigma1] : [1, 0];
  const u2: Vec2 = sigma2 > 1e-10 ? [u2raw[0] / sigma2, u2raw[1] / sigma2] : [-u1[1], u1[0]];

  // P = V Σ V^T (acts in domain)
  const P: Mat2 = [
    [sigma1 * v1[0] * v1[0] + sigma2 * v2[0] * v2[0], sigma1 * v1[0] * v1[1] + sigma2 * v2[0] * v2[1]],
    [sigma1 * v1[0] * v1[1] + sigma2 * v2[0] * v2[1], sigma1 * v1[1] * v1[1] + sigma2 * v2[1] * v2[1]],
  ];
  // Q = U V^T
  const Q: Mat2 = [
    [u1[0] * v1[0] + u2[0] * v2[0], u1[0] * v1[1] + u2[0] * v2[1]],
    [u1[1] * v1[0] + u2[1] * v2[0], u1[1] * v1[1] + u2[1] * v2[1]],
  ];
  // P' = U Σ U^T (acts in codomain)
  const Pprime: Mat2 = [
    [sigma1 * u1[0] * u1[0] + sigma2 * u2[0] * u2[0], sigma1 * u1[0] * u1[1] + sigma2 * u2[0] * u2[1]],
    [sigma1 * u1[0] * u1[1] + sigma2 * u2[0] * u2[1], sigma1 * u1[1] * u1[1] + sigma2 * u2[1] * u2[1]],
  ];
  return { Q, P, Pprime };
}

function lerpMat(I: Mat2, target: Mat2, t: number): Mat2 {
  const e = 1 - t;
  return [
    [e * I[0][0] + t * target[0][0], e * I[0][1] + t * target[0][1]],
    [e * I[1][0] + t * target[1][0], e * I[1][1] + t * target[1][1]],
  ];
}

function applyTo(M: Mat2, pts: Vec2[]): Vec2[] {
  return pts.map((p) => m2apply(M, p));
}

const SAMPLES = 80;
const CIRCLE: Vec2[] = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const t = (i / SAMPLES) * 2 * Math.PI;
  return [Math.cos(t), Math.sin(t)] as Vec2;
});

export function PolarDecompositionViz() {
  const [A, setA] = useState<Mat2>(PRESETS.rotateThenStretch);
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0=I, 1=stage1, 2=final
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  const { Q, P, Pprime } = polarDecomp(A);

  // Left canvas (stretch first): I → P → QP=A
  // Right canvas (rotate first): I → Q → P'Q=A
  const I: Mat2 = [[1, 0], [0, 1]];
  const leftMat = stage === 0 ? I : stage === 1 ? lerpMat(I, P, t) : lerpMat(P, A, t);
  const rightMat = stage === 0 ? I : stage === 1 ? lerpMat(I, Q, t) : lerpMat(Q, A, t);

  const leftPts = applyTo(leftMat, CIRCLE);
  const rightPts = applyTo(rightMat, CIRCLE);

  useEffect(() => {
    if (!playing) return;
    let start = performance.now();
    const dur = 800;
    const tick = (now: number) => {
      const frac = Math.min(1, (now - start) / dur);
      setT(frac);
      if (frac >= 1) {
        if (stage < 2) {
          setStage((s) => (s + 1) as 0 | 1 | 2);
          setT(0);
          start = performance.now();
        } else {
          setPlaying(false);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, stage]);

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  const renderCanvas = (label: string, pts: Vec2[]) => (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
      <MonoLine size={9} color="var(--text-tertiary)">{label}</MonoLine>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <GridAxes width={W} height={H} unit={UNIT} />
        {/* Unit circle (reference) */}
        <circle cx={CX} cy={CY} r={UNIT} fill="none" stroke="var(--viz-blue, #67a9ff)" strokeWidth={1} strokeOpacity={0.25} strokeDasharray="3 3" />
        {/* Current shape */}
        <polygon
          points={pts.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
          fill="var(--viz-purple, #b896ff)" fillOpacity={0.12}
          stroke="var(--viz-purple, #b896ff)" strokeWidth={1.8}
        />
      </svg>
    </div>
  );

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, marginBottom: 12 }}>
        <MonoLine size={9} color="var(--text-tertiary)">MATRIX A</MonoLine>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {[0, 1].map((i) =>
            [0, 1].map((j) => (
              <input
                key={`${i}${j}`}
                type="number"
                step={0.1}
                value={A[i][j]}
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0;
                  const next: Mat2 = [[A[0][0], A[0][1]], [A[1][0], A[1][1]]];
                  next[i][j] = v;
                  setA(next);
                  setStage(0);
                  setT(0);
                }}
                style={{ background: 'var(--bg-elevated, #1a1f2e)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 11, padding: 4, borderRadius: 4, width: 70 }}
              />
            ))
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {Object.keys(PRESETS).map((name) => (
            <VizControlButton key={name} onClick={() => { setA(PRESETS[name]); setStage(0); setT(0); }}>{name}</VizControlButton>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {renderCanvas(stage === 0 ? 'A = QP · start' : stage === 1 ? 'A = QP · after P (stretch)' : 'A = QP · after Q (rotate)', leftPts)}
        {renderCanvas(stage === 0 ? "A = P'Q · start" : stage === 1 ? "A = P'Q · after Q (rotate)" : "A = P'Q · after P' (stretch)", rightPts)}
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
        <VizControlButton onClick={() => { setStage(0); setT(0); setPlaying(true); }}>play</VizControlButton>
        <VizControlButton onClick={() => { setStage(0); setT(0); setPlaying(false); }}>reset</VizControlButton>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 8, padding: 10, background: 'rgba(184, 150, 255, 0.06)', border: '1px solid rgba(184, 150, 255, 0.3)', borderRadius: 6 }}>
        Q = [[{Q[0][0].toFixed(2)}, {Q[0][1].toFixed(2)}], [{Q[1][0].toFixed(2)}, {Q[1][1].toFixed(2)}]] (orthogonal)<br />
        P = [[{P[0][0].toFixed(2)}, {P[0][1].toFixed(2)}], [{P[1][0].toFixed(2)}, {P[1][1].toFixed(2)}]] (symm. PSD, domain)<br />
        P' = [[{Pprime[0][0].toFixed(2)}, {Pprime[0][1].toFixed(2)}], [{Pprime[1][0].toFixed(2)}, {Pprime[1][1].toFixed(2)}]] (symm. PSD, codomain). P' = Q P Qᵀ.
      </div>
    </div>
  );
}
