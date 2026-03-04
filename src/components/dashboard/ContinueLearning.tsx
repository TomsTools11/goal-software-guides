'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { getGuideBySlug } from '@/lib/guides';
import { CourseCard } from './CourseCard';
import { guideIcons } from './guideIcons';

export function ContinueLearning() {
  const { recentlyAccessed } = useDashboardStats();

  const inProgress = recentlyAccessed.filter(
    (r) => r.progress.percentComplete > 0 && r.progress.percentComplete < 100
  );

  if (inProgress.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-text">Continue Learning</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inProgress.map(({ slug, progress }) => {
          const guide = getGuideBySlug(slug);
          if (!guide) return null;
          return (
            <CourseCard
              key={slug}
              guide={guide}
              icon={guideIcons[slug]}
              progress={progress}
            />
          );
        })}
      </div>
    </section>
  );
}
