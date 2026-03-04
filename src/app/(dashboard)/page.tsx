'use client';

import { useState } from 'react';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ContinueLearning } from '@/components/dashboard/ContinueLearning';
import { CategoryTabs, type CategoryFilter } from '@/components/dashboard/CategoryTabs';
import { CourseGrid } from '@/components/dashboard/CourseGrid';

export default function DashboardPage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">
          Track your progress across all GOAL guides and SOPs.
        </p>
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
