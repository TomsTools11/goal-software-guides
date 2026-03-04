'use client';

import { useState } from 'react';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ContinueLearning } from '@/components/dashboard/ContinueLearning';
import { CategoryTabs, type CategoryFilter } from '@/components/dashboard/CategoryTabs';
import { CourseGrid } from '@/components/dashboard/CourseGrid';
import { resetAllProgress } from '@/lib/progress';

export default function DashboardPage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  function handleReset() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetAllProgress();
      window.location.reload();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">
            Track your progress across all GOAL guides and SOPs.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-error hover:text-error"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Reset Progress
        </button>
      </div>

      <StatsOverview />
      <ContinueLearning />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">All Courses</h2>
          <CategoryTabs active={filter} onChange={setFilter} />
        </div>
        <CourseGrid filter={filter} />
      </div>
    </div>
  );
}
