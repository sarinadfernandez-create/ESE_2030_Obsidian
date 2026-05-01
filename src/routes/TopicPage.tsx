import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, BookOpen, FlaskConical, PenLine } from 'lucide-react';
import { getConceptById, getUnitById } from '../content/concepts.index';
import type { TabId } from '../content/types';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { TopicHeader } from '../components/topic/TopicHeader';
import { TabBar } from '../components/topic/TabBar';
import { NotesSidebar } from '../components/notes/NotesSidebar';

// ── Tab content panels ────────────────────────────────────────────────────────

function StubContent() {
  return (
    <div className="flex flex-col items-center py-16 gap-4 text-center max-w-md mx-auto">
      <BookOpen size={32} className="text-text-muted" />
      <p className="text-text-secondary font-sans text-base leading-relaxed">
        This concept is part of the full graph but doesn&apos;t yet have a
        deep-dive page. Coming soon.
      </p>
    </div>
  );
}

interface FlagshipPlaceholderProps {
  tab: TabId;
  conceptId: string;
}

const TAB_ICONS = {
  learn: BookOpen,
  explore: FlaskConical,
  practice: PenLine,
} as const;

const TAB_COMING = {
  learn: 'Definitions, theorems, worked overview, and key formulas.',
  explore: 'Interactive SVG visualization with real-time parameter controls.',
  practice: 'Worked examples with animated solution walkthroughs and problem sets.',
} as const;

function FlagshipPlaceholder({ tab, conceptId }: FlagshipPlaceholderProps) {
  const Icon = TAB_ICONS[tab];
  return (
    <div className="flex flex-col items-center py-14 gap-4 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center">
        <Sparkles size={20} className="text-accent" />
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Flagship · {conceptId}
      </p>
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon size={16} className="flex-shrink-0" />
        <p className="font-sans text-sm leading-relaxed text-left">
          {TAB_COMING[tab]}
        </p>
      </div>
      <p className="text-text-muted font-sans text-xs mt-2">
        Full content arrives in the next deliverable.
      </p>
    </div>
  );
}

// ── Learn tab ─────────────────────────────────────────────────────────────────

function LearnTab({ tier, conceptId }: { tier: string; conceptId: string }) {
  if (tier === 'stub') return <StubContent />;
  return <FlagshipPlaceholder tab="learn" conceptId={conceptId} />;
}

// ── Explore tab ───────────────────────────────────────────────────────────────

function ExploreTab({ tier, conceptId }: { tier: string; conceptId: string }) {
  if (tier === 'stub') return <StubContent />;
  return <FlagshipPlaceholder tab="explore" conceptId={conceptId} />;
}

// ── Practice tab ──────────────────────────────────────────────────────────────

function PracticeTab({ tier, conceptId }: { tier: string; conceptId: string }) {
  if (tier === 'stub') return <StubContent />;
  return <FlagshipPlaceholder tab="practice" conceptId={conceptId} />;
}

// ── 404 ───────────────────────────────────────────────────────────────────────

function NotFound({ id }: { id: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-4">
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
        404 · Concept not found
      </p>
      <h1 className="font-display text-4xl text-text-primary">{id}</h1>
      <p className="text-text-tertiary text-sm">
        No concept with this ID exists in the graph.
      </p>
      <Link
        to="/graph"
        className="font-mono text-xs text-accent hover:text-accent-bright transition-colors mt-4"
      >
        ← Back to graph
      </Link>
    </div>
  );
}

// ── TopicPage ─────────────────────────────────────────────────────────────────

const VALID_TABS: TabId[] = ['learn', 'explore', 'practice'];

function isValidTab(value: string | null): value is TabId {
  return VALID_TABS.includes(value as TabId);
}

export function TopicPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTab = searchParams.get('tab');
  const activeTab: TabId = isValidTab(rawTab) ? rawTab : 'learn';

  const concept = getConceptById(id);
  const unit = concept ? getUnitById(concept.unitId) : undefined;

  if (!concept || !unit) return <NotFound id={id} />;

  const handleTabChange = (tab: TabId) => {
    setSearchParams({ tab }, { replace: true });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 py-8">
      <div className="flex gap-12">
        {/* ── Main content column ── */}
        <div className="flex-1 min-w-0">
          <Breadcrumb
            items={[
              { label: 'Graph', href: '/graph' },
              { label: `Ch.${unit.number} · ${unit.short}` },
              { label: concept.title },
            ]}
          />

          <TopicHeader concept={concept} unit={unit} />

          <TabBar active={activeTab} onChange={handleTabChange} />

          <div
            role="tabpanel"
            aria-label={`${activeTab} tab content`}
            className="min-h-[40vh]"
          >
            {activeTab === 'learn' && (
              <LearnTab tier={concept.tier} conceptId={concept.id} />
            )}
            {activeTab === 'explore' && (
              <ExploreTab tier={concept.tier} conceptId={concept.id} />
            )}
            {activeTab === 'practice' && (
              <PracticeTab tier={concept.tier} conceptId={concept.id} />
            )}
          </div>
        </div>

        {/* ── Notes sidebar ── */}
        <NotesSidebar conceptId={concept.id} />
      </div>
    </div>
  );
}
