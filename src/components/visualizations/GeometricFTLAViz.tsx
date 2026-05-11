// 6.3 — Geometric Fundamental Theorem of Linear Algebra (stationary).
// Sister figure to 3.9 FundamentalTheoremViz. Same two-box structure with the
// orthogonality glyphs added: row space ⟂ null space (in V), column space ⟂
// left null space (in W).

import { InlineMath, BlockMath } from 'react-katex';

const COL_ROW = 'rgba(103, 169, 255, 0.18)';
const COL_ROW_BORDER = 'rgba(103, 169, 255, 0.6)';
const COL_NULL = 'rgba(255, 123, 107, 0.18)';
const COL_NULL_BORDER = 'rgba(255, 123, 107, 0.6)';
const COL_COL = 'rgba(103, 169, 255, 0.18)';
const COL_COL_BORDER = 'rgba(103, 169, 255, 0.6)';
const COL_LNULL = 'rgba(255, 217, 102, 0.18)';
const COL_LNULL_BORDER = 'rgba(255, 217, 102, 0.6)';

export function GeometricFTLAViz() {
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
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontStyle: 'italic',
          color: 'var(--text-primary)',
          marginBottom: 18,
        }}
      >
        Geometric Fundamental Theorem of Linear Algebra
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 180px 1fr',
          gap: 0,
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <Box
          spaceLabel="V = ℝⁿ"
          topLabel="row space"
          topSubLabel="\mathrm{im}\, A^T \subseteq V"
          topDim="r"
          topBg={COL_ROW}
          topBorder={COL_ROW_BORDER}
          bottomLabel="null space"
          bottomSubLabel="\ker A \subseteq V"
          bottomDim="n - r"
          bottomBg={COL_NULL}
          bottomBorder={COL_NULL_BORDER}
          orthoLabel="row space ⟂ null space in V"
          orthoTitle="Row space and null space are orthogonal complements within V"
        />

        <ArrowsColumn />

        <Box
          spaceLabel="W = ℝᵐ"
          topLabel="column space"
          topSubLabel="\mathrm{im}\, A \subseteq W"
          topDim="r"
          topBg={COL_COL}
          topBorder={COL_COL_BORDER}
          bottomLabel="left null space"
          bottomSubLabel="\ker A^T \subseteq W"
          bottomDim="m - r"
          bottomBg={COL_LNULL}
          bottomBorder={COL_LNULL_BORDER}
          orthoLabel="column space ⟂ left null space in W"
          orthoTitle="Column space and left null space are orthogonal complements within W"
        />
      </div>

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
        <FooterIdentity
          math="\dim(V) = \dim(\ker A) + \dim(\mathrm{im}\, A^T)"
          caption="rank-nullity in V"
        />
        <FooterIdentity
          math="\dim(W) = \dim(\mathrm{im}\, A) + \dim(\ker A^T)"
          caption="rank-nullity in W"
        />
        <FooterIdentity
          math="\ker A = (\mathrm{im}\, A^T)^\perp,\;\; \ker A^T = (\mathrm{im}\, A)^\perp"
          caption="the two perpendicular pairings"
        />
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
        Two pairs of orthogonal complements pin down the full structure of any linear transformation.
      </div>

      <div
        style={{
          marginTop: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-tertiary)',
          textAlign: 'right',
        }}
      >
        see also · 3.9 — algebraic Fundamental Theorem
      </div>
    </div>
  );
}

function Box({
  spaceLabel,
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
  orthoTitle,
}: {
  spaceLabel: string;
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
  orthoTitle: string;
}) {
  return (
    <div style={{ position: 'relative', padding: 8 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        {spaceLabel}
      </div>

      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Half
          label={topLabel}
          subLabel={topSubLabel}
          dim={topDim}
          bg={topBg}
          border={topBorder}
        />
        {/* Orthogonality divider with right-angle glyph */}
        <div
          style={{
            position: 'relative',
            height: 0,
            borderTop: '1px dashed var(--text-tertiary)',
          }}
          title={orthoTitle}
        >
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: -10,
              transform: 'translateX(-50%)',
              background: 'var(--bg-panel)',
              padding: '0 6px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(111, 212, 154, 1)',
              fontWeight: 600,
            }}
          >
            ⟂
          </span>
        </div>
        <Half
          label={bottomLabel}
          subLabel={bottomSubLabel}
          dim={bottomDim}
          bg={bottomBg}
          border={bottomBorder}
          isBottom
        />
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
        padding: '22px 16px',
        textAlign: 'center',
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        borderTop: isBottom ? `0` : undefined,
      }}
      title={`${label} (${border})`}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 18,
          color: 'var(--text-primary)',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
        <InlineMath math={subLabel} />
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-tertiary)',
          marginTop: 4,
        }}
      >
        dim = <InlineMath math={dim} />
      </div>
    </div>
  );
}

function ArrowsColumn() {
  return (
    <svg viewBox="0 0 180 400" width="100%" height="400" style={{ overflow: 'visible' }}>
      <defs>
        <marker
          id="gftla-arrow-cyan"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(103,169,255,0.95)" />
        </marker>
        <marker
          id="gftla-arrow-red"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,123,107,0.8)" />
        </marker>
        <marker
          id="gftla-arrow-yellow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,217,102,0.8)" />
        </marker>
      </defs>

      {/* Big cyan iso arrow — row space → column space */}
      <line
        x1={6}
        y1={140}
        x2={174}
        y2={140}
        stroke="rgba(103,169,255,0.95)"
        strokeWidth={2.6}
        markerEnd="url(#gftla-arrow-cyan)"
      />
      <text
        x={90}
        y={128}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fill="var(--accent-bright, #67a9ff)"
      >
        T (iso on row space)
      </text>
      <text
        x={90}
        y={158}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontSize={11}
        fill="var(--text-secondary)"
      >
        bijective restriction
      </text>

      {/* Red kernel-collapse */}
      <line
        x1={6}
        y1={280}
        x2={80}
        y2={280}
        stroke="rgba(255,123,107,0.8)"
        strokeWidth={1.4}
        strokeDasharray="3 3"
        markerEnd="url(#gftla-arrow-red)"
      />
      <circle cx={80} cy={280} r={3} fill="rgba(255,123,107,0.9)" />
      <text
        x={80}
        y={298}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={9}
        fill="var(--text-tertiary)"
      >
        kernel ↦ 0
      </text>

      {/* Yellow "unreached" indicator on the right */}
      <line
        x1={174}
        y1={330}
        x2={100}
        y2={330}
        stroke="rgba(255,217,102,0.7)"
        strokeWidth={1.2}
        strokeDasharray="2 4"
        markerStart="url(#gftla-arrow-yellow)"
      />
      <text
        x={137}
        y={348}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={9}
        fill="var(--text-tertiary)"
      >
        left null: unreached
      </text>
    </svg>
  );
}

function FooterIdentity({ math, caption }: { math: string; caption: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ minWidth: 260, flex: 1 }}>
        <BlockMath math={math} />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--text-tertiary)',
        }}
      >
        {caption}
      </span>
    </div>
  );
}
