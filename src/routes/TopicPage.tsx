import { useParams, useSearchParams, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { getConceptById, getUnitById } from '../content/concepts.index';
import type { TabId, Concept } from '../content/types';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { TopicHeader } from '../components/topic/TopicHeader';
import { TabBar } from '../components/topic/TabBar';
import { NotesSidebar } from '../components/notes/NotesSidebar';
import { LearnTab } from '../components/topic/LearnTab';
import { ExploreTab } from '../components/topic/ExploreTab';
import { PracticeTab } from '../components/topic/PracticeTab';
import { AnimatedSolutionDrawer } from '../components/topic/AnimatedSolutionDrawer';

function StubContent({ concept }: { concept: Concept }) {
  return (
    <div className="flex flex-col items-center py-16 gap-4 text-center max-w-md mx-auto">
      <BookOpen size={32} className="text-text-muted" />
      <p className="text-text-secondary font-sans text-base leading-relaxed">
        <span className="font-display italic">{concept.title}</span> is part of
        the full graph but doesn't yet have a deep-dive page.
      </p>
      <p className="text-text-tertiary text-sm leading-relaxed">{concept.blurb}</p>
    </div>
  );
}

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

  const isStub = concept.tier === 'stub';

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-8 py-8">
        <div className="flex gap-12">
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
              className="min-h-[40vh] pt-6"
            >
              {isStub ? (
                <StubContent concept={concept} />
              ) : (
                <>
                  {activeTab === 'learn' && <LearnTab concept={concept} />}
                  {activeTab === 'explore' && <ExploreTab concept={concept} />}
                  {activeTab === 'practice' && <PracticeTab concept={concept} />}
                </>
              )}
            </div>
          </div>

          <NotesSidebar conceptId={concept.id} />
        </div>
      </div>
      <AnimatedSolutionDrawer />
    </>
  );
}
