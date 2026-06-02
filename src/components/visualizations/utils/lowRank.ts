// Shared low-rank utilities for Unit 12 vizes.
// Implements a simple SVD via Jacobi eigendecomposition of A^T A, suitable for
// modest matrix sizes (≤ ~256x256) at interactive speed.

export type Matrix = number[][];

export function shape(A: Matrix): [number, number] {
  return [A.length, A[0]?.length ?? 0];
}

export function zeros(m: number, n: number): Matrix {
  return Array.from({ length: m }, () => new Array(n).fill(0));
}

export function clone(A: Matrix): Matrix {
  return A.map((row) => [...row]);
}

export function transpose(A: Matrix): Matrix {
  const [m, n] = shape(A);
  const T = zeros(n, m);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) T[j][i] = A[i][j];
  return T;
}

export function matmul(A: Matrix, B: Matrix): Matrix {
  const [m, k] = shape(A);
  const [, n] = shape(B);
  const C = zeros(m, n);
  for (let i = 0; i < m; i++) {
    for (let p = 0; p < k; p++) {
      const a = A[i][p];
      if (a === 0) continue;
      for (let j = 0; j < n; j++) C[i][j] += a * B[p][j];
    }
  }
  return C;
}

// Jacobi eigendecomposition of a symmetric matrix S. Returns
// { values: number[], vectors: Matrix } where vectors columns are eigenvectors.
// Sorted by eigenvalue descending.
export function jacobiEigen(S: Matrix, maxSweeps = 60, tol = 1e-10): { values: number[]; vectors: Matrix } {
  const n = S.length;
  const A = clone(S);
  const V = zeros(n, n);
  for (let i = 0; i < n; i++) V[i][i] = 1;
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let off = 0;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < tol) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-14) continue;
        const app = A[p][p];
        const aqq = A[q][q];
        const theta = (aqq - app) / (2 * apq);
        const t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(1 + theta * theta));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;
        A[p][p] = app - t * apq;
        A[q][q] = aqq + t * apq;
        A[p][q] = 0;
        A[q][p] = 0;
        for (let i = 0; i < n; i++) {
          if (i !== p && i !== q) {
            const aip = A[i][p];
            const aiq = A[i][q];
            A[i][p] = c * aip - s * aiq;
            A[p][i] = A[i][p];
            A[i][q] = s * aip + c * aiq;
            A[q][i] = A[i][q];
          }
          const vip = V[i][p];
          const viq = V[i][q];
          V[i][p] = c * vip - s * viq;
          V[i][q] = s * vip + c * viq;
        }
      }
    }
  }
  const eigs: { v: number; vec: number[] }[] = [];
  for (let i = 0; i < n; i++) {
    eigs.push({ v: A[i][i], vec: V.map((row) => row[i]) });
  }
  eigs.sort((a, b) => b.v - a.v);
  const values = eigs.map((e) => e.v);
  const vectors = zeros(n, n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) vectors[i][j] = eigs[j].vec[i];
  return { values, vectors };
}

export type SVD = { U: Matrix; sigma: number[]; V: Matrix };

// Compute SVD A = U Σ V^T via eigendecomposition of A^T A (when n ≤ m) or A A^T.
// For Unit 12 vizes the matrices are small, so this is fine.
export function svd(A: Matrix): SVD {
  const [m, n] = shape(A);
  if (m >= n) {
    const At = transpose(A);
    const AtA = matmul(At, A); // n×n
    const { values, vectors: V } = jacobiEigen(AtA);
    const sigma = values.map((v) => Math.sqrt(Math.max(0, v)));
    const U = zeros(m, n);
    for (let j = 0; j < n; j++) {
      const s = sigma[j];
      if (s < 1e-12) {
        // Leave U[:,j] zero; will be filled later by orthonormal extension if needed.
        continue;
      }
      // U[:,j] = A V[:,j] / s
      for (let i = 0; i < m; i++) {
        let acc = 0;
        for (let p = 0; p < n; p++) acc += A[i][p] * V[p][j];
        U[i][j] = acc / s;
      }
    }
    return { U, sigma, V };
  } else {
    // Transpose strategy: SVD of A^T then swap.
    const { U: Vt, sigma, V: Ut } = svd(transpose(A));
    return { U: Ut, sigma, V: Vt };
  }
}

// Best rank-k approximation A_k = U_k Σ_k V_k^T.
export function truncatedSvd(A: Matrix, k: number): Matrix {
  const { U, sigma, V } = svd(A);
  const [m, n] = shape(A);
  const r = Math.min(k, sigma.length);
  const Ak = zeros(m, n);
  for (let p = 0; p < r; p++) {
    const s = sigma[p];
    if (s < 1e-12) break;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        Ak[i][j] += s * U[i][p] * V[j][p];
      }
    }
  }
  return Ak;
}

export function frobeniusNorm(A: Matrix): number {
  let s = 0;
  for (const row of A) for (const v of row) s += v * v;
  return Math.sqrt(s);
}

export function frobeniusError(A: Matrix, B: Matrix): number {
  const [m, n] = shape(A);
  let s = 0;
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
    const d = A[i][j] - B[i][j];
    s += d * d;
  }
  return Math.sqrt(s);
}

export function singularValues(A: Matrix): number[] {
  return svd(A).sigma;
}

// Map matrix entries to grayscale [0, 255]. Returns the mapping function bound
// to the given range. If range is omitted, auto-fits to [min, max].
export function scaleToGrayscale(A: Matrix, range?: [number, number]): { toGray: (v: number) => number; min: number; max: number } {
  let mn = Infinity, mx = -Infinity;
  if (range) { [mn, mx] = range; }
  else {
    for (const row of A) for (const v of row) { if (v < mn) mn = v; if (v > mx) mx = v; }
  }
  const span = mx - mn || 1;
  const toGray = (v: number) => Math.max(0, Math.min(255, Math.round(((v - mn) / span) * 255)));
  return { toGray, min: mn, max: mx };
}

// Diverging colormap centered at zero, returning rgb tuple.
export function divergingColor(v: number, maxAbs: number): [number, number, number] {
  const t = Math.max(-1, Math.min(1, v / (maxAbs || 1)));
  if (t >= 0) {
    // 0 → dark, 1 → red
    const intensity = Math.round(60 + t * 195);
    return [intensity, 60, 60];
  } else {
    const intensity = Math.round(60 + -t * 195);
    return [60, 80, intensity];
  }
}

// Simple matrix entry generators for the demos.
export function makeGradient(m: number, n: number): Matrix {
  const A = zeros(m, n);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) A[i][j] = (i + j) / (m + n);
  return A;
}

export function makeCheckerboard(m: number, n: number): Matrix {
  const A = zeros(m, n);
  const halfM = m / 2, halfN = n / 2;
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
    A[i][j] = ((i < halfM ? 0 : 1) + (j < halfN ? 0 : 1)) % 2 === 0 ? 0.2 : 0.8;
  }
  return A;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeNoise(m: number, n: number, seed = 1): Matrix {
  const rng = mulberry32(seed);
  const A = zeros(m, n);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) A[i][j] = rng();
  return A;
}

// Rank-r signal: outer-product sum, optionally with small Gaussian noise.
export function makeLowRank(m: number, n: number, r: number, noise = 0, seed = 1): Matrix {
  const rng = mulberry32(seed);
  const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-12, rng()))) * Math.cos(2 * Math.PI * rng());
  const U = Array.from({ length: r }, () => Array.from({ length: m }, () => gauss()));
  const V = Array.from({ length: r }, () => Array.from({ length: n }, () => gauss()));
  const A = zeros(m, n);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
    let s = 0;
    for (let p = 0; p < r; p++) s += U[p][i] * V[p][j];
    A[i][j] = s / Math.sqrt(r) + (noise > 0 ? noise * gauss() : 0);
  }
  return A;
}

// "Portrait"-like structured pattern; smooth radial gradient with rings, deterministic.
export function makePortrait(m: number, n: number): Matrix {
  const A = zeros(m, n);
  const cx = m / 2, cy = n / 2;
  const maxR = Math.hypot(cx, cy);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const dx = i - cx;
      const dy = j - cy;
      const r = Math.hypot(dx, dy);
      const ring = 0.5 + 0.4 * Math.cos((r / maxR) * 8);
      const tilt = 0.3 * Math.sin(((i + j) / (m + n)) * 6);
      A[i][j] = 0.5 + 0.3 * ring + 0.1 * tilt;
    }
  }
  return A;
}
