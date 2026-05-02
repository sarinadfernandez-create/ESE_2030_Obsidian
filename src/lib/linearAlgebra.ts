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
