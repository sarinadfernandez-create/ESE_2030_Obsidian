// 10.3 — SVD Structure (flagship). A = U Σ V^T animated as three stages:
// rotate by V^T, scale by Σ, rotate by U.

import { useEffect, useRef, useState } from 'react';
import { m2apply, type Mat2, type Vec2 } from '../../lib/linearAlgebra';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

const W = 540;
const H = 540;
const CX = W / 2;
const CY = H / 2;
const UNIT = 60;

const PRESETS: Record<string, Mat2> = {
  identity: [[1, 0], [0, 1]],
  diagonal: [[2, 0], [0, 0.5]],
  shear: [[1, 1], [0, 1]],
  rotation45: [[Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4)], [Math.sin(Math.PI / 4), Math.cos(Math.PI / 4)]],
  rank1: [[1, 1], [1, 1]],
};

function computeSVD(A: Mat2) {
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

  // V^T is the matrix with rows v1, v2
  const Vt: Mat2 = [[v1[0], v1[1]], [v2[0], v2[1]]];
  // Σ is diag(sigma1, sigma2)
  const Sigma: Mat2 = [[sigma1, 0], [0, sigma2]];
  // U has columns u1, u2
  const U: Mat2 = [[u1[0], u2[0]], [u1[1], u2[1]]];

  return { U, Sigma, Vt, sigma1, sigma2, v1, v2, u1, u2 };
}

function lerpMat(I: Mat2, target: Mat2, t: number): Mat2 {
  const e = 1 - t;
  return [
    [e * I[0][0] + t * target[0][0], e * I[0][1] + t * target[0][1]],
    [e * I[1][0] + t * target[1][0], e * I[1][1] + t * target[1][1]],
  ];
}

function mul(A: Mat2, B: Mat2): Mat2 {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];
}

const SAMPLES = 100;
const CIRCLE: Vec2[] = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const t = (i / SAMPLES) * 2 * Math.PI;
  return [Math.cos(t), Math.sin(t)] as Vec2;
});

const STAGE_LABELS = ['start', 'after Vᵀ (rotate)', 'after Σ (scale)', 'after U (rotate) = A'];

export function SVDStructureViz() {
  const [A, setA] = useState<Mat2>(PRESETS.shear);
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  const svd = computeSVD(A);
  const { U, Sigma, Vt, sigma1, sigma2 } = svd;
  const I: Mat2 = [[1, 0], [0, 1]];

  // Compute matrix at each checkpoint
  const M0 = I;
  const M1 = Vt;
  const M2 = mul(Sigma, Vt);
  const M3 = A;

  let currentMat: Mat2;
  if (stage === 0) currentMat = lerpMat(M0, M0, 0);
  else if (stage === 1) currentMat = lerpMat(M0, M1, t);
  else if (stage === 2) currentMat = lerpMat(M1, M2, t);
  else currentMat = lerpMat(M2, M3, t);

  const pts = CIRCLE.map((p) => m2apply(currentMat, p));

  useEffect(() => {
    if (!playing) return;
    let start = performance.now();
    const dur = 800;
    const tick = (now: number) => {
      const frac = Math.min(1, (now - start) / dur);
      setT(frac);
      if (frac >= 1) {
        if (stage < 3) {
          setStage((s) => (s + 1) as 0 | 1 | 2 | 3);
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

  const fmt = (M: Mat2) => `[[${M[0][0].toFixed(2)}, ${M[0][1].toFixed(2)}], [${M[1][0].toFixed(2)}, ${M[1][1].toFixed(2)}]]`;

  return (
    <div style={{ maxWidth: 920 }}>
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8, marginBottom: 12 }}>
        <MonoLine size={9} color="var(--text-tertiary)">STAGE: {STAGE_LABELS[stage]}</MonoLine>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
          <GridAxes width={W} height={H} unit={UNIT} />
          {/* Reference circle */}
          <circle cx={CX} cy={CY} r={UNIT} fill="none" stroke="var(--viz-blue, #67a9ff)" strokeWidth={1} strokeOpacity={0.2} strokeDasharray="3 3" />
          {/* Current shape */}
          <polygon
            points={pts.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
            fill="var(--viz-purple, #b896ff)" fillOpacity={0.12}
            stroke="var(--viz-purple, #b896ff)" strokeWidth={1.8}
          />
          {/* v_i applied through the same transformation */}
          {(() => {
            const v1img = m2apply(currentMat, svd.v1);
            const v2img = m2apply(currentMat, svd.v2);
            return (
              <>
                <line x1={CX} y1={CY} x2={w2sX(v1img[0])} y2={w2sY(v1img[1])} stroke="var(--viz-blue, #67a9ff)" strokeWidth={2.4} />
                <line x1={CX} y1={CY} x2={w2sX(v2img[0])} y2={w2sY(v2img[1])} stroke="var(--viz-yellow, #ffd966)" strokeWidth={2.4} />
              </>
            );
          })()}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 12 }}>
        <Cell title="Vᵀ (rotate)" highlight={stage === 1} content={fmt(Vt)} />
        <Cell title="Σ (scale)" highlight={stage === 2} content={`σ₁ = ${sigma1.toFixed(3)}, σ₂ = ${sigma2.toFixed(3)}`} />
        <Cell title="U (rotate)" highlight={stage === 3} content={fmt(U)} />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
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
                  setStage(0); setT(0);
                }}
                style={{ background: 'var(--bg-elevated, #1a1f2e)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 11, padding: 4, borderRadius: 4, width: 60 }}
              />
            ))
          )}
        </div>
        <VizControlButton onClick={() => { setStage(0); setT(0); setPlaying(true); }}>play</VizControlButton>
        <VizControlButton onClick={() => {
          if (stage < 3) { setStage((s) => (s + 1) as 0 | 1 | 2 | 3); setT(1); }
        }}>step →</VizControlButton>
        <VizControlButton onClick={() => { setStage(0); setT(0); setPlaying(false); }}>reset</VizControlButton>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
        {Object.keys(PRESETS).map((name) => (
          <VizControlButton key={name} onClick={() => { setA(PRESETS[name]); setStage(0); setT(0); }}>{name}</VizControlButton>
        ))}
      </div>
    </div>
  );
}

function Cell({ title, content, highlight }: { title: string; content: string; highlight: boolean }) {
  return (
    <div style={{ background: highlight ? 'rgba(184, 150, 255, 0.15)' : 'var(--bg-panel)', border: '1px solid', borderColor: highlight ? 'var(--viz-purple, #b896ff)' : 'var(--border-subtle)', borderRadius: 8, padding: 8 }}>
      <MonoLine size={9} color={highlight ? 'var(--viz-purple, #b896ff)' : 'var(--text-tertiary)'}>{title}</MonoLine>
      <div style={{ marginTop: 4, fontSize: 10 }}>{content}</div>
    </div>
  );
}
