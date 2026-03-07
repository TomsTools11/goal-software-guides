'use client';

export type CategoryFilter = 'all' | 'software' | 'account-management' | 'sales';

interface CategoryTabsProps {
  active: CategoryFilter;
  onChange: (tab: CategoryFilter) => void;
}

const tabs: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'software', label: 'Software' },
  { value: 'account-management', label: 'Account Management' },
  { value: 'sales', label: 'Sales' },
];

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === tab.value
              ? 'bg-primary text-white'
              : 'bg-surface text-text-muted border border-border hover:bg-background-soft'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
