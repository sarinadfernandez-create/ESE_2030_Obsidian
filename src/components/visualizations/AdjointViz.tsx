// 5.5 — Adjoint & Geometric FTLA (stationary).
// Sister figure to 3.9 FundamentalTheoremViz. Same four-piece structure,
// but with the orthogonality of row space ⟂ null space (in V) and column
// space ⟂ left null space (in W) — the geometric form.

import { InlineMath, BlockMath } from 'react-katex';

const COL_ROW = 'rgba(103, 169, 255, 0.18)';
const COL_ROW_BORDER = 'rgba(103, 169, 255, 0.6)';
const COL_NULL = 'rgba(255, 123, 107, 0.18)';
const COL_NULL_BORDER = 'rgba(255, 123, 107, 0.6)';
const COL_COL = 'rgba(103, 169, 255, 0.18)';
const COL_COL_BORDER = 'rgba(103, 169, 255, 0.6)';
const COL_LNULL = 'rgba(255, 217, 102, 0.18)';
const COL_LNULL_BORDER = 'rgba(255, 217, 102, 0.6)';

export function AdjointViz() {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: '32px 28px',
        maxWidth: 760,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 180px 1fr',
          gap: 0,
          alignItems: 'center',
          minHeight: 380,
        }}
      >
        {/* ── Domain box V ──────────────────────────────── */}
        <Box
          spaceLabel="V"
          dimLabel="\dim V = n"
          topLabel="row space"
          topSubLabel="\mathrm{im}\, T^* \subseteq V"
          topDim="r"
          topBg={COL_ROW}
          topBorder={COL_ROW_BORDER}
          bottomLabel="null space"
          bottomSubLabel="\ker T \subseteq V"
          bottomDim="n - r"
          bottomBg={COL_NULL}
          bottomBorder={COL_NULL_BORDER}
          orthoLabel="row space ⟂ null space"
        />

        {/* ── Center: arrows ────────────────────────────── */}
        <ArrowsColumn />

        {/* ── Codomain box W ────────────────────────────── */}
        <Box
          spaceLabel="W"
          dimLabel="\dim W = m"
          topLabel="column space"
          topSubLabel="\mathrm{im}\, T \subseteq W"
          topDim="r"
          topBg={COL_COL}
          topBorder={COL_COL_BORDER}
          bottomLabel="left null space"
          bottomSubLabel="\ker T^* \subseteq W"
          bottomDim="m - r"
          bottomBg={COL_LNULL}
          bottomBorder={COL_LNULL_BORDER}
          orthoLabel="column space ⟂ left null space"
        />
      </div>

      {/* ── Footer identities ───────────────────────────── */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: 13,
          color: 'var(--text-secondary)',
        }}
      >
        <FooterIdentity math="\ker T^* = (\mathrm{im}\, T)^\perp" caption="left null space ⟂ column space" />
        <FooterIdentity math="\mathrm{im}\, T^* = (\ker T)^\perp" caption="row space ⟂ null space" />
        <FooterIdentity math="T \,\big|_{\mathrm{im}\, T^*} : \mathrm{im}\, T^* \;\xrightarrow{\sim}\; \mathrm{im}\, T" caption="T is an isomorphism on the row space" />
      </div>

      <div
        style={{
          marginTop: 16,
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--text-tertiary)',
          textAlign: 'center',
        }}
      >
        T and T* are mutual inverses on the (row space, column space) pair.
      </div>
    </div>
  );
}

function Box({
  spaceLabel,
  dimLabel,
  topLabel,
  topSubLabel,
  topDim,
  topBg,
  topBorder,
  bottomLabel,
  bottomSubLabel,
  bottomDim,
  bottomBg,
  bottomBorder,
  orthoLabel,
}: {
  spaceLabel: string;
  dimLabel: string;
  topLabel: string;
  topSubLabel: string;
  topDim: string;
  topBg: string;
  topBorder: string;
  bottomLabel: string;
  bottomSubLabel: string;
  bottomDim: string;
  bottomBg: string;
  bottomBorder: string;
  orthoLabel: string;
}) {
  return (
    <div style={{ position: 'relative', padding: 8 }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 22,
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        {spaceLabel}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        <InlineMath math={dimLabel} />
      </div>

      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Half label={topLabel} subLabel={topSubLabel} dim={topDim} bg={topBg} border={topBorder} />
        <Half label={bottomLabel} subLabel={bottomSubLabel} dim={bottomDim} bg={bottomBg} border={bottomBorder} isBottom />
      </div>

      <div
        style={{
          marginTop: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'rgba(111, 212, 154, 1)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        {orthoLabel}
      </div>
    </div>
  );
}

function Half({
  label,
  subLabel,
  dim,
  bg,
  border,
  isBottom,
}: {
  label: string;
  subLabel: string;
  dim: string;
  bg: string;
  border: string;
  isBottom?: boolean;
}) {
  return (
    <div
      style={{
        background: bg,
        borderTop: isBottom ? `1px dashed ${border}` : undefined,
        padding: '22px 16px',
        textAlign: 'center',
        minHeight: 130,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 17,
          color: 'var(--text-primary)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <InlineMath math={subLabel} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>
        dim = <InlineMath math={dim} />
      </div>
    </div>
  );
}

function ArrowsColumn() {
  return (
    <svg viewBox="0 0 180 380" width="100%" height="380" style={{ overflow: 'visible' }}>
      <defs>
        <marker id="adj-arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(103,169,255,0.95)" />
        </marker>
        <marker id="adj-arrow-yellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,217,102,0.85)" />
        </marker>
      </defs>

      {/* T: row space → column space (top) */}
      <line x1={6} y1={130} x2={174} y2={130} stroke="rgba(103,169,255,0.95)" strokeWidth={2.4} markerEnd="url(#adj-arrow-cyan)" />
      <text x={90} y={118} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="var(--accent-bright, #67a9ff)">
        T (iso)
      </text>
      <text x={90} y={148} textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontSize={11} fill="var(--text-secondary)">
        bijective on row space
      </text>

      {/* T*: column space → row space (return) */}
      <line x1={174} y1={170} x2={6} y2={170} stroke="rgba(255,217,102,0.85)" strokeWidth={2.0} markerEnd="url(#adj-arrow-yellow)" />
      <text x={90} y={188} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="rgba(255, 217, 102, 0.95)">
        T*
      </text>

      {/* Kernel collapse */}
      <line x1={20} y1={280} x2={88} y2={280} stroke="rgba(255,123,107,0.6)" strokeWidth={1.4} strokeDasharray="3 3" markerEnd="url(#adj-arrow-yellow)" />
      <circle cx={88} cy={280} r={3} fill="rgba(255,123,107,0.9)" />
      <text x={50} y={300} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">
        ker T ↦ 0
      </text>

      {/* Left null space — what's missed */}
      <line x1={160} y1={320} x2={92} y2={320} stroke="rgba(255,217,102,0.6)" strokeWidth={1.2} strokeDasharray="2 4" markerStart="url(#adj-arrow-yellow)" />
      <text x={130} y={340} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--text-tertiary)">
        ker T*: unreached
      </text>
    </svg>
  );
}

function FooterIdentity({ math, caption }: { math: string; caption: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ minWidth: 280 }}>
        <BlockMath math={math} />
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 12, color: 'var(--text-tertiary)' }}>
        {caption}
      </span>
    </div>
  );
}
