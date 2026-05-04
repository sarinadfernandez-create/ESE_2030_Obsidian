// 3.9 — Fundamental Theorem of Linear Algebra (stationary).
// Two boxes (V and W), each split into two pieces. The cyan "isomorphism" arrow
// between coimage and image is the centerpiece.

import { InlineMath, BlockMath } from 'react-katex';

const COL_KER = 'rgba(255, 123, 107, 0.18)';     // viz-red tint
const COL_KER_BORDER = 'rgba(255, 123, 107, 0.6)';
const COL_COIM = 'rgba(103, 169, 255, 0.18)';    // viz-blue tint
const COL_COIM_BORDER = 'rgba(103, 169, 255, 0.6)';
const COL_IMG = 'rgba(103, 169, 255, 0.18)';
const COL_IMG_BORDER = 'rgba(103, 169, 255, 0.6)';
const COL_COKER = 'rgba(255, 217, 102, 0.18)';   // viz-yellow tint
const COL_COKER_BORDER = 'rgba(255, 217, 102, 0.6)';

export function FundamentalTheoremViz() {
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
          gridTemplateColumns: '1fr 160px 1fr',
          gap: 0,
          alignItems: 'center',
          minHeight: 360,
        }}
      >
        {/* ── Domain box V ───────────────────────────────────────── */}
        <Box
          spaceLabel="V"
          dimLabel="\dim V = n"
          topLabel="coimage"
          topSubLabel="V \,/\, \ker T"
          topDim="r"
          topBg={COL_COIM}
          topBorder={COL_COIM_BORDER}
          bottomLabel="kernel"
          bottomSubLabel="\ker T"
          bottomDim="n - r"
          bottomBg={COL_KER}
          bottomBorder={COL_KER_BORDER}
        />

        {/* ── Center: arrows ─────────────────────────────────────── */}
        <ArrowsColumn />

        {/* ── Codomain box W ─────────────────────────────────────── */}
        <Box
          spaceLabel="W"
          dimLabel="\dim W = m"
          topLabel="image"
          topSubLabel="\mathrm{im}\, T"
          topDim="r"
          topBg={COL_IMG}
          topBorder={COL_IMG_BORDER}
          bottomLabel="cokernel"
          bottomSubLabel="W \,/\, \mathrm{im}\, T"
          bottomDim="m - r"
          bottomBg={COL_COKER}
          bottomBorder={COL_COKER_BORDER}
        />
      </div>

      {/* ── Footer: the three structural identities ─────────────── */}
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
        <FooterIdentity math="V \cong \ker T \,\oplus\, \mathrm{coim}\, T" caption="domain decomposition" />
        <FooterIdentity math="W \cong \mathrm{im}\, T \,\oplus\, \mathrm{coker}\, T" caption="codomain decomposition" />
        <FooterIdentity math="\mathrm{coim}\, T \,\cong\, \mathrm{im}\, T" caption="isomorphism on the &ldquo;active&rdquo; part" />
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
        Every linear transformation factors through this four-piece structure.
      </div>
    </div>
  );
}

// A vertical box representing V or W, split top/bottom into two labeled regions.
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
        title={`The ambient space ${spaceLabel}`}
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
        <Half
          label={topLabel}
          subLabel={topSubLabel}
          dim={topDim}
          bg={topBg}
          border={topBorder}
        />
        <Half
          label={bottomLabel}
          subLabel={bottomSubLabel}
          dim={bottomDim}
          bg={bottomBg}
          border={bottomBorder}
          isBottom
        />
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
          fontSize: 18,
          color: 'var(--text-primary)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}
      >
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

// SVG arrows column between the two boxes.
function ArrowsColumn() {
  // Big iso arrow at top connecting coimage → image, small "collapse" arrow
  // from kernel down to the bottom-mid.
  return (
    <svg viewBox="0 0 160 360" width="100%" height="360" style={{ overflow: 'visible' }}>
      <defs>
        <marker
          id="ftla-arrow-cyan"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--viz-blue, #67a9ff)" />
        </marker>
        <marker
          id="ftla-arrow-red"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 123, 107, 0.8)" />
        </marker>
        <marker
          id="ftla-arrow-yellow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 217, 102, 0.8)" />
        </marker>
      </defs>

      {/* Big cyan iso arrow — top half (coimage → image) */}
      <line
        x1={6}
        y1={120}
        x2={154}
        y2={120}
        stroke="var(--viz-blue, #67a9ff)"
        strokeWidth={2.4}
        markerEnd="url(#ftla-arrow-cyan)"
      />
      <text
        x={80}
        y={108}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fill="var(--accent-bright, #67a9ff)"
      >
        T (iso)
      </text>
      <text
        x={80}
        y={138}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontSize={11}
        fill="var(--text-secondary)"
      >
        bijective on coimage
      </text>

      {/* Small red collapse arrow — kernel → 0 */}
      <line
        x1={6}
        y1={250}
        x2={80}
        y2={250}
        stroke="rgba(255, 123, 107, 0.8)"
        strokeWidth={1.4}
        strokeDasharray="3 3"
        markerEnd="url(#ftla-arrow-red)"
      />
      <circle cx={80} cy={250} r={3} fill="rgba(255, 123, 107, 0.9)" />
      <text
        x={80}
        y={268}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={9}
        fill="var(--text-tertiary)"
      >
        kernel ↦ 0
      </text>

      {/* Small yellow "missed" indicator — cokernel ← (nothing reaches it) */}
      <line
        x1={154}
        y1={300}
        x2={80}
        y2={300}
        stroke="rgba(255, 217, 102, 0.7)"
        strokeWidth={1.2}
        strokeDasharray="2 4"
        markerStart="url(#ftla-arrow-yellow)"
      />
      <text
        x={80}
        y={318}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={9}
        fill="var(--text-tertiary)"
      >
        cokernel: unreached
      </text>
    </svg>
  );
}

function FooterIdentity({ math, caption }: { math: string; caption: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ minWidth: 240 }}>
        <BlockMath math={math} />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'var(--text-tertiary)',
        }}
        dangerouslySetInnerHTML={{ __html: caption }}
      />
    </div>
  );
}
