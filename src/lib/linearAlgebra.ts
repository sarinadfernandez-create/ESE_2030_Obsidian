export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Mat2 = [[number, number], [number, number]];

export const v2add = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];
export const v2sub = (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]];
export const v2scale = (v: Vec2, s: number): Vec2 => [v[0] * s, v[1] * s];
export const v2dot = (a: Vec2, b: Vec2): number => a[0] * b[0] + a[1] * b[1];
export const v2norm = (v: Vec2): number => Math.hypot(v[0], v[1]);
export const v2normalize = (v: Vec2): Vec2 => {
  const n = v2norm(v);
  if (n < 1e-10) return [0, 0];
  return [v[0] / n, v[1] / n];
};

export const v3add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const v3sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const v3scale = (v: Vec3, s: number): Vec3 => [v[0] * s, v[1] * s, v[2] * s];
export const v3dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const v3norm = (v: Vec3): number => Math.hypot(v[0], v[1], v[2]);
export const v3normalize = (v: Vec3): Vec3 => {
  const n = v3norm(v);
  if (n < 1e-10) return [0, 0, 0];
  return [v[0] / n, v[1] / n, v[2] / n];
};

export const v3project = (a: Vec3, b: Vec3): Vec3 => {
  const bDotB = v3dot(b, b);
  if (bDotB < 1e-10) return [0, 0, 0];
  const scale = v3dot(a, b) / bDotB;
  return v3scale(b, scale);
};

export const v3lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export const v2lerp = (a: Vec2, b: Vec2, t: number): Vec2 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

export const m2apply = (A: Mat2, v: Vec2): Vec2 => [
  A[0][0] * v[0] + A[0][1] * v[1],
  A[1][0] * v[0] + A[1][1] * v[1],
];

export const m2trace = (A: Mat2): number => A[0][0] + A[1][1];
export const m2det = (A: Mat2): number => A[0][0] * A[1][1] - A[0][1] * A[1][0];

export type Eigen2Result =
  | { kind: 'real'; values: [number, number]; vectors: [Vec2, Vec2] }
  | { kind: 'complex'; real: number; imag: number }
  | { kind: 'repeated'; value: number; vector: Vec2 | null; defective: boolean };

export function computeEigen2(A: Mat2): Eigen2Result {
  const tr = m2trace(A);
  const det = m2det(A);
  const discriminant = tr * tr - 4 * det;
  const EPSILON = 1e-7;

  if (discriminant < -EPSILON) {
    return {
      kind: 'complex',
      real: tr / 2,
      imag: Math.sqrt(-discriminant) / 2,
    };
  }

  if (Math.abs(discriminant) < EPSILON) {
    const lambda = tr / 2;
    const M: Mat2 = [
      [A[0][0] - lambda, A[0][1]],
      [A[1][0], A[1][1] - lambda],
    ];
    const v = nullSpaceVector(M);
    if (v === null) {
      return { kind: 'repeated', value: lambda, vector: [1, 0], defective: false };
    }
    const isZeroMatrix =
      Math.abs(M[0][0]) < EPSILON &&
      Math.abs(M[0][1]) < EPSILON &&
      Math.abs(M[1][0]) < EPSILON &&
      Math.abs(M[1][1]) < EPSILON;
    return {
      kind: 'repeated',
      value: lambda,
      vector: v,
      defective: !isZeroMatrix,
    };
  }

  const sqrtD = Math.sqrt(discriminant);
  const lambda1 = (tr + sqrtD) / 2;
  const lambda2 = (tr - sqrtD) / 2;

  const v1 = nullSpaceVector([
    [A[0][0] - lambda1, A[0][1]],
    [A[1][0], A[1][1] - lambda1],
  ]) || [1, 0];
  const v2 = nullSpaceVector([
    [A[0][0] - lambda2, A[0][1]],
    [A[1][0], A[1][1] - lambda2],
  ]) || [0, 1];

  return {
    kind: 'real',
    values: [lambda1, lambda2],
    vectors: [v1, v2],
  };
}

function nullSpaceVector(M: Mat2): Vec2 | null {
  const EPSILON = 1e-7;
  if (Math.abs(M[0][0]) > EPSILON || Math.abs(M[0][1]) > EPSILON) {
    return v2normalize([-M[0][1], M[0][0]]);
  }
  if (Math.abs(M[1][0]) > EPSILON || Math.abs(M[1][1]) > EPSILON) {
    return v2normalize([-M[1][1], M[1][0]]);
  }
  return null;
}

export interface GSStep {
  inputVector: Vec3;
  projections: Vec3[];
  afterProjection: Vec3;
  normalized: Vec3 | null;
}

export function gramSchmidt3D(vectors: Vec3[]): {
  orthogonal: Vec3[];
  normalized: Vec3[];
  steps: GSStep[];
  failedAt: number | null;
} {
  const EPSILON = 1e-8;
  const orthogonal: Vec3[] = [];
  const normalized: Vec3[] = [];
  const steps: GSStep[] = [];
  let failedAt: number | null = null;

  for (let k = 0; k < vectors.length; k++) {
    const vk = vectors[k];

    if (!Number.isFinite(vk[0]) || !Number.isFinite(vk[1]) || !Number.isFinite(vk[2])) {
      steps.push({ inputVector: vk, projections: [], afterProjection: [0, 0, 0], normalized: null });
      if (failedAt === null) failedAt = k;
      continue;
    }

    const projections: Vec3[] = [];
    let uk: Vec3 = [vk[0], vk[1], vk[2]];

    for (let j = 0; j < normalized.length; j++) {
      const proj = v3project(vk, normalized[j]);
      projections.push(proj);
      uk = v3sub(uk, proj);
    }

    const ukNorm = v3norm(uk);
    if (ukNorm < EPSILON) {
      steps.push({
        inputVector: vk,
        projections,
        afterProjection: uk,
        normalized: null,
      });
      if (failedAt === null) failedAt = k;
      continue;
    }

    const ek = v3scale(uk, 1 / ukNorm);
    orthogonal.push(uk);
    normalized.push(ek);
    steps.push({
      inputVector: vk,
      projections,
      afterProjection: uk,
      normalized: ek,
    });
  }

  return { orthogonal, normalized, steps, failedAt };
}

export function isometricProject(v: Vec3, scale: number = 60): Vec2 {
  const cos30 = Math.cos(Math.PI / 6);
  const sin30 = Math.sin(Math.PI / 6);
  return [
    scale * (v[0] * cos30 - v[1] * cos30),
    scale * (v[0] * sin30 + v[1] * sin30 - v[2]),
  ];
}

// ── Unit 1 viz utilities ────────────────────────────────────────────────────

export function matVec(A: number[][], x: number[]): number[] {
  const m = A.length;
  const n = A[0].length;
  if (x.length !== n) throw new Error('Dimension mismatch');
  const out = new Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) out[i] += A[i][j] * x[j];
  }
  return out;
}

export function matMat(A: number[][], B: number[][]): number[][] {
  const m = A.length;
  const k = A[0].length;
  const n = B[0].length;
  if (B.length !== k) throw new Error('Dimension mismatch');
  const out: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let p = 0; p < k; p++) s += A[i][p] * B[p][j];
      out[i][j] = s;
    }
  }
  return out;
}

export function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

export interface RowOp {
  type: 'swap' | 'scale' | 'add';
  i: number;
  j?: number;
  scalar?: number;
}

export interface RREFResult {
  rref: number[][];
  ops: RowOp[];
  pivots: { row: number; col: number }[];
  rank: number;
  // Snapshots after each op (for steppers). snapshots[0] = original; snapshots[k] = state after ops[k-1].
  snapshots: number[][][];
}

export function computeRREF(
  matrix: number[][],
  opts: { partialPivot?: boolean } = {}
): RREFResult {
  const EPSILON = 1e-9;
  const partialPivot = opts.partialPivot ?? true;
  if (matrix.length === 0)
    return { rref: [], ops: [], pivots: [], rank: 0, snapshots: [[]] };
  const M = deepClone(matrix);
  const m = M.length;
  const n = M[0].length;
  const ops: RowOp[] = [];
  const pivots: { row: number; col: number }[] = [];
  const snapshots: number[][][] = [deepClone(M)];

  let r = 0;
  for (let c = 0; c < n && r < m; c++) {
    let pivotRow = r;
    if (partialPivot) {
      let bestVal = Math.abs(M[r][c]);
      for (let i = r + 1; i < m; i++) {
        if (Math.abs(M[i][c]) > bestVal) {
          bestVal = Math.abs(M[i][c]);
          pivotRow = i;
        }
      }
    } else {
      while (pivotRow < m && Math.abs(M[pivotRow][c]) < EPSILON) pivotRow++;
    }
    if (pivotRow >= m || Math.abs(M[pivotRow][c]) < EPSILON) continue;

    if (pivotRow !== r) {
      [M[r], M[pivotRow]] = [M[pivotRow], M[r]];
      ops.push({ type: 'swap', i: r, j: pivotRow });
      snapshots.push(deepClone(M));
    }

    const pivotVal = M[r][c];
    if (Math.abs(pivotVal - 1) > EPSILON) {
      for (let j = 0; j < n; j++) M[r][j] /= pivotVal;
      ops.push({ type: 'scale', i: r, scalar: 1 / pivotVal });
      snapshots.push(deepClone(M));
    }

    for (let i = 0; i < m; i++) {
      if (i === r) continue;
      const factor = M[i][c];
      if (Math.abs(factor) < EPSILON) continue;
      for (let j = 0; j < n; j++) M[i][j] -= factor * M[r][j];
      ops.push({ type: 'add', i, j: r, scalar: -factor });
      snapshots.push(deepClone(M));
    }

    pivots.push({ row: r, col: c });
    r++;
  }

  return { rref: M, ops, pivots, rank: pivots.length, snapshots };
}

export interface ForwardElimResult {
  ref: number[][];
  L: number[][];
  P: number[][];
  ops: RowOp[];
  multipliers: { row: number; col: number; value: number }[];
  pivotedAt: number[];
  swappedSteps: number[];
  failedAt: number | null;
  snapshots: number[][][];
}

export function forwardEliminate(
  matrix: number[][],
  opts: { partialPivot?: boolean } = {}
): ForwardElimResult {
  const EPSILON = 1e-9;
  const partialPivot = opts.partialPivot ?? false;
  if (matrix.length === 0)
    return {
      ref: [],
      L: [],
      P: [],
      ops: [],
      multipliers: [],
      pivotedAt: [],
      swappedSteps: [],
      failedAt: null,
      snapshots: [[]],
    };
  const M = deepClone(matrix);
  const m = M.length;
  const n = M[0].length;
  const size = Math.min(m, n);

  const L: number[][] = Array.from({ length: m }, (_, i) =>
    Array.from({ length: m }, (_, j) => (i === j ? 1 : 0))
  );
  const P: number[][] = Array.from({ length: m }, (_, i) =>
    Array.from({ length: m }, (_, j) => (i === j ? 1 : 0))
  );
  const ops: RowOp[] = [];
  const multipliers: { row: number; col: number; value: number }[] = [];
  const pivotedAt: number[] = [];
  const swappedSteps: number[] = [];
  let failedAt: number | null = null;
  const snapshots: number[][][] = [deepClone(M)];

  for (let c = 0; c < size; c++) {
    let pivotRow = c;
    if (partialPivot) {
      let bestVal = Math.abs(M[c][c]);
      for (let i = c + 1; i < m; i++) {
        if (Math.abs(M[i][c]) > bestVal) {
          bestVal = Math.abs(M[i][c]);
          pivotRow = i;
        }
      }
    } else {
      while (pivotRow < m && Math.abs(M[pivotRow][c]) < EPSILON) pivotRow++;
    }
    if (pivotRow >= m || Math.abs(M[pivotRow][c]) < EPSILON) {
      failedAt = c;
      break;
    }
    if (pivotRow !== c) {
      [M[c], M[pivotRow]] = [M[pivotRow], M[c]];
      [P[c], P[pivotRow]] = [P[pivotRow], P[c]];
      for (let j = 0; j < c; j++) {
        [L[c][j], L[pivotRow][j]] = [L[pivotRow][j], L[c][j]];
      }
      ops.push({ type: 'swap', i: c, j: pivotRow });
      swappedSteps.push(c);
      snapshots.push(deepClone(M));
    }
    pivotedAt.push(c);

    for (let i = c + 1; i < m; i++) {
      const factor = M[i][c] / M[c][c];
      if (Math.abs(factor) < EPSILON) continue;
      for (let j = c; j < n; j++) M[i][j] -= factor * M[c][j];
      L[i][c] = factor;
      ops.push({ type: 'add', i, j: c, scalar: -factor });
      multipliers.push({ row: i, col: c, value: factor });
      snapshots.push(deepClone(M));
    }
  }
  return { ref: M, L, P, ops, multipliers, pivotedAt, swappedSteps, failedAt, snapshots };
}

export function fmtCell(x: number): string {
  if (!Number.isFinite(x)) return '—';
  const EPSILON = 1e-7;
  if (Math.abs(x) < EPSILON) return '0';
  if (Math.abs(x - Math.round(x)) < EPSILON) return String(Math.round(x));
  return (Math.round(x * 100) / 100).toFixed(2);
}

// 2x2 singular-value helpers.
export function operatorNorm2x2(A: Mat2): number {
  const [a, b] = A[0];
  const [c, d] = A[1];
  const ata00 = a * a + c * c;
  const ata11 = b * b + d * d;
  const ata01 = a * b + c * d;
  const tr = ata00 + ata11;
  const det = ata00 * ata11 - ata01 * ata01;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambdaMax = (tr + Math.sqrt(disc)) / 2;
  return Math.sqrt(Math.max(0, lambdaMax));
}

export function smallestSV2x2(A: Mat2): number {
  const [a, b] = A[0];
  const [c, d] = A[1];
  const ata00 = a * a + c * c;
  const ata11 = b * b + d * d;
  const ata01 = a * b + c * d;
  const tr = ata00 + ata11;
  const det = ata00 * ata11 - ata01 * ata01;
  const disc = Math.max(0, tr * tr - 4 * det);
  const lambdaMin = (tr - Math.sqrt(disc)) / 2;
  return Math.sqrt(Math.max(0, lambdaMin));
}

export function conditionNumber2x2(A: Mat2): number {
  const sigMin = smallestSV2x2(A);
  const sigMax = operatorNorm2x2(A);
  if (sigMin < 1e-12) return Infinity;
  return sigMax / sigMin;
}

// SVD-derived ellipse for the image of the unit circle under A. Returns the
// rotation angle of the major axis and the two semi-axis lengths.
export function ellipseFromMatrix2x2(A: Mat2): {
  semiMajor: number;
  semiMinor: number;
  angle: number; // radians, rotation of major axis from x-axis
} {
  const [a, b] = A[0];
  const [c, d] = A[1];
  // M = A A^T eigenvectors are the major/minor axis directions of the image ellipse.
  const m00 = a * a + b * b;
  const m11 = c * c + d * d;
  const m01 = a * c + b * d;
  const tr = m00 + m11;
  const det = m00 * m11 - m01 * m01;
  const disc = Math.max(0, tr * tr - 4 * det);
  const sqrtD = Math.sqrt(disc);
  const lambda1 = (tr + sqrtD) / 2;
  const lambda2 = Math.max(0, (tr - sqrtD) / 2);
  const semiMajor = Math.sqrt(lambda1);
  const semiMinor = Math.sqrt(lambda2);
  // Eigenvector for lambda1: solve (m00 - lambda1) x + m01 y = 0
  let angle = 0;
  if (Math.abs(m01) > 1e-12) {
    angle = Math.atan2(lambda1 - m00, m01);
  } else if (m11 > m00) {
    angle = Math.PI / 2;
  } else {
    angle = 0;
  }
  return { semiMajor, semiMinor, angle };
}

// ── Null space and image basis ─────────────────────────────────────────────

/**
 * Compute a basis for the null space of `A` from its RREF.
 * Returns column vectors (each of length n) that span ker(A).
 */
export function nullSpaceBasis(matrix: number[][]): number[][] {
  if (matrix.length === 0) return [];
  const n = matrix[0].length;
  const { rref, pivots } = computeRREF(matrix, { partialPivot: true });
  const pivotCols = new Set(pivots.map((p) => p.col));
  const freeCols: number[] = [];
  for (let j = 0; j < n; j++) if (!pivotCols.has(j)) freeCols.push(j);
  // For each free column f: v = e_f - sum over pivots p (rref[p.row][f]) * e_{p.col}
  return freeCols.map((f) => {
    const v = new Array(n).fill(0);
    v[f] = 1;
    for (const p of pivots) {
      v[p.col] = -rref[p.row][f];
    }
    return v;
  });
}

/**
 * Image basis = the original columns of `A` at pivot positions.
 * (Crucially, NOT the RREF columns themselves.)
 */
export function imageBasisFromPivots(matrix: number[][]): { cols: number[][]; pivotCols: number[] } {
  if (matrix.length === 0) return { cols: [], pivotCols: [] };
  const m = matrix.length;
  const { pivots } = computeRREF(matrix, { partialPivot: true });
  const pivotCols = pivots.map((p) => p.col);
  const cols = pivotCols.map((j) => {
    const col = new Array(m);
    for (let i = 0; i < m; i++) col[i] = matrix[i][j];
    return col;
  });
  return { cols, pivotCols };
}
