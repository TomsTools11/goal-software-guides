'use client';

import { guides } from '@/lib/guides';
import { getAllProgress } from '@/lib/progress';
import { CourseCard } from './CourseCard';
import { getGuideIcon } from './guideIcons';
import type { CategoryFilter } from './CategoryTabs';
import { useEffect, useState } from 'react';
import type { GuideProgress } from '@/lib/progress';

interface CourseGridProps {
  filter: CategoryFilter;
}

export function CourseGrid({ filter }: CourseGridProps) {
  const [progress, setProgress] = useState<Record<string, GuideProgress>>({});

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  const filtered = filter === 'all' ? guides : guides.filter((g) => g.category === filter);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map((guide) => (
        <CourseCard
          key={guide.slug}
          guide={guide}
          icon={getGuideIcon(guide.slug)}
          progress={progress[guide.slug] ?? null}
        />
      ))}
    </div>
  );
}
