// 8.1 — Complex Eigenvalues (flagship interactive).
// Real 2x2 matrix A = [[a, -b], [b, a]] with eigenvalues a±bi acts as rotate-and-scale.
// User adjusts a, b via sliders; sees iterates spiral. Eigenvalue plotted in complex plane.

import { useEffect, useRef, useState } from 'react';
import { GridAxes, MonoLine, VizControlButton } from './_shared';

type Vec2 = [number, number];

const W = 480;
const H = 480;
const CX = W / 2;
const CY = H / 2;
const UNIT = 60;

const CW = 220; // complex plane width
const CH = 220;
const CCX = CW / 2;
const CCY = CH / 2;
const CUNIT = 80;

type Preset = 'spiralOut' | 'spiralIn' | 'pureRotation' | 'tightSpiralIn' | 'custom';

const PRESETS: Record<Exclude<Preset, 'custom'>, { a: number; b: number }> = {
  spiralOut: { a: 0.7, b: 0.7 },
  spiralIn: { a: 0.65, b: 0.4 },
  pureRotation: { a: Math.cos(Math.PI / 6), b: Math.sin(Math.PI / 6) },
  tightSpiralIn: { a: 0.25, b: 0.2 },
};

const MAX_ITER = 24;

export function ComplexEigenvalueViz() {
  const [a, setA] = useState(0.7);
  const [b, setB] = useState(0.7);
  const [x0, setX0] = useState<Vec2>([1.5, 0]);
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [, setPreset] = useState<Preset>('spiralOut');
  const rafRef = useRef<number | null>(null);

  // Apply A = [[a, -b], [b, a]] to vector v
  const apply = (v: Vec2): Vec2 => [a * v[0] - b * v[1], b * v[0] + a * v[1]];

  // Compute iterate trail
  const iterates: Vec2[] = [x0];
  for (let i = 0; i < MAX_ITER; i++) {
    iterates.push(apply(iterates[i]));
  }

  const modulus = Math.hypot(a, b);
  const arg = Math.atan2(b, a);
  const argDeg = (arg * 180) / Math.PI;

  // Animation
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last > 600) {
        setK((kk) => {
          const next = kk + 1;
          if (next > MAX_ITER) {
            setPlaying(false);
            return MAX_ITER;
          }
          return next;
        });
        last = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const applyPreset = (p: Preset) => {
    setPreset(p);
    if (p !== 'custom') {
      setA(PRESETS[p].a);
      setB(PRESETS[p].b);
    }
    setK(0);
  };

  const w2sX = (x: number) => CX + x * UNIT;
  const w2sY = (y: number) => CY - y * UNIT;

  // Logarithmic spiral interpolation through iterates: x(t) = r^t · R(θt) · x0
  const r = modulus;
  const theta = arg;
  const spiralPts: [number, number][] = [];
  if (r > 1e-6) {
    const tMax = k;
    const steps = Math.max(60, tMax * 16);
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tMax;
      const scale = Math.pow(r, t);
      const ang = theta * t;
      const x = scale * (Math.cos(ang) * x0[0] - Math.sin(ang) * x0[1]);
      const y = scale * (Math.sin(ang) * x0[0] + Math.cos(ang) * x0[1]);
      spiralPts.push([x, y]);
    }
  }

  const onDragX0 = (e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGCircleElement).setPointerCapture(e.pointerId);
    const svg = (e.currentTarget as SVGCircleElement).ownerSVGElement!;
    const onMv = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const sx = ((ev.clientX - rect.left) / rect.width) * W;
      const sy = ((ev.clientY - rect.top) / rect.height) * H;
      const wx = (sx - CX) / UNIT;
      const wy = (CY - sy) / UNIT;
      setX0([Number(wx.toFixed(2)), Number(wy.toFixed(2))]);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMv);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMv);
    window.addEventListener('pointerup', onUp);
  };

  const interpretation =
    Math.abs(modulus - 1) < 1e-4
      ? 'Pure rotation: |λ| = 1, neutral.'
      : modulus > 1
      ? `Spiral out: |λ| ≈ ${modulus.toFixed(3)}, grows per step.`
      : modulus < 1e-4
      ? 'Collapses to origin: |λ| ≈ 0.'
      : `Spiral in: |λ| ≈ ${modulus.toFixed(3)}, decays.`;

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, alignItems: 'start' }}>
        {/* Main canvas */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            <GridAxes width={W} height={H} unit={UNIT} />

            {/* Spiral path */}
            {spiralPts.length > 1 && (
              <polyline
                points={spiralPts.map((p) => `${w2sX(p[0])},${w2sY(p[1])}`).join(' ')}
                fill="none"
                stroke="var(--viz-yellow, #ffd966)"
                strokeWidth={1.4}
                strokeOpacity={0.6}
              />
            )}

            {/* Iterate dots (fading trail) */}
            {iterates.slice(0, k + 1).map((p, i) => (
              <circle
                key={i}
                cx={w2sX(p[0])}
                cy={w2sY(p[1])}
                r={i === k ? 5 : 3}
                fill="var(--viz-blue, #67a9ff)"
                fillOpacity={i === k ? 1 : 0.3 + (0.7 * i) / Math.max(1, k)}
              />
            ))}

            {/* x0 as a draggable arrow */}
            <line
              x1={CX}
              y1={CY}
              x2={w2sX(x0[0])}
              y2={w2sY(x0[1])}
              stroke="var(--viz-purple, #b896ff)"
              strokeWidth={2.4}
            />
            <circle
              cx={w2sX(x0[0])}
              cy={w2sY(x0[1])}
              r={8}
              fill="var(--viz-purple, #b896ff)"
              style={{ cursor: 'grab' }}
              onPointerDown={onDragX0}
            />
            <text
              x={w2sX(x0[0]) + 10}
              y={w2sY(x0[1]) - 6}
              fontSize={12}
              fontFamily="var(--font-mono)"
              fontStyle="italic"
              fill="var(--viz-purple, #b896ff)"
            >
              x₀
            </text>
          </svg>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Complex plane inset */}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8 }}>
            <MonoLine size={9} color="var(--text-tertiary)">EIGENVALUE λ = a + bi</MonoLine>
            <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" style={{ display: 'block', marginTop: 4 }}>
              {/* Axes */}
              <line x1={0} y1={CCY} x2={CW} y2={CCY} stroke="var(--viz-axis, #555)" strokeWidth={1} />
              <line x1={CCX} y1={0} x2={CCX} y2={CH} stroke="var(--viz-axis, #555)" strokeWidth={1} />
              {/* Unit circle */}
              <circle cx={CCX} cy={CCY} r={CUNIT} fill="none" stroke="var(--viz-grid, #444)" strokeWidth={0.8} strokeDasharray="3 3" />
              {/* λ and conjugate */}
              <circle cx={CCX + a * CUNIT} cy={CCY - b * CUNIT} r={5} fill="var(--viz-blue, #67a9ff)" />
              <circle cx={CCX + a * CUNIT} cy={CCY + b * CUNIT} r={5} fill="var(--viz-blue, #67a9ff)" fillOpacity={0.5} />
              {/* Argument arc */}
              {Math.abs(b) > 1e-4 && (
                <path
                  d={`M ${CCX + 20} ${CCY} A 20 20 0 0 ${b > 0 ? 0 : 1} ${CCX + 20 * Math.cos(arg)} ${CCY - 20 * Math.sin(arg)}`}
                  fill="none"
                  stroke="var(--viz-green, #6fd49a)"
                  strokeWidth={1.4}
                />
              )}
              <text x={CCX + 8} y={CCY - 8} fontSize={10} fontFamily="var(--font-mono)" fill="var(--viz-green, #6fd49a)">
                θ
              </text>
            </svg>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
              <div>|λ| = <span style={{ color: 'var(--accent-bright, #67a9ff)' }}>{modulus.toFixed(3)}</span></div>
              <div>θ = {argDeg.toFixed(1)}°</div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 10, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <MonoLine size={9} color="var(--text-tertiary)">MATRIX a, b</MonoLine>
            <label style={{ display: 'block', marginTop: 6 }}>
              a = {a.toFixed(2)}
              <input
                type="range"
                min={-1.5}
                max={1.5}
                step={0.05}
                value={a}
                onChange={(e) => { setA(parseFloat(e.target.value)); setPreset('custom'); }}
                style={{ width: '100%' }}
              />
            </label>
            <label style={{ display: 'block', marginTop: 6 }}>
              b = {b.toFixed(2)}
              <input
                type="range"
                min={-1.5}
                max={1.5}
                step={0.05}
                value={b}
                onChange={(e) => { setB(parseFloat(e.target.value)); setPreset('custom'); }}
                style={{ width: '100%' }}
              />
            </label>
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-secondary)' }}>{interpretation}</div>
          </div>

          {/* Presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(['spiralOut', 'spiralIn', 'pureRotation', 'tightSpiralIn'] as const).map((p) => (
              <VizControlButton key={p} onClick={() => applyPreset(p)}>{p}</VizControlButton>
            ))}
          </div>

          {/* Play controls */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <VizControlButton onClick={() => setPlaying((p) => !p)}>{playing ? 'pause' : 'play'}</VizControlButton>
            <VizControlButton onClick={() => setK((kk) => Math.min(MAX_ITER, kk + 1))}>step</VizControlButton>
            <VizControlButton onClick={() => { setK(0); setPlaying(false); }}>reset</VizControlButton>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            iteration k = {k} / {MAX_ITER}
          </div>
        </div>
      </div>
    </div>
  );
}
