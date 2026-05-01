import type { TabId } from '../../content/types';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'learn',    label: 'Learn' },
  { id: 'explore',  label: 'Explore' },
  { id: 'practice', label: 'Practice' },
];

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Topic sections"
      className="flex border-b border-border-subtle mt-8"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`
              px-6 py-3
              font-mono text-xs tracking-widest uppercase
              border-b-2 -mb-px
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-inset
              ${isActive
                ? 'text-accent border-accent'
                : 'text-text-tertiary border-transparent hover:text-text-secondary hover:border-border-default'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
