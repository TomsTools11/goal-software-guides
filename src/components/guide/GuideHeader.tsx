'use client';

import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { GuideMetadata } from '@/lib/guides';

interface GuideHeaderProps {
  guide: GuideMetadata;
  progressPercent: number;
}

export function GuideHeader({ guide, progressPercent }: GuideHeaderProps) {
  return (
    <div className="mb-8 rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">{guide.title}</h1>
          <p className="mt-1 text-sm text-text-muted">{guide.description}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge variant="primary">{guide.difficulty}</Badge>
        <span className="text-xs text-text-muted">{guide.estimatedTime}</span>
        <span className="text-xs text-text-muted">
          {guide.chapters} {guide.category === 'sop' ? 'sections' : 'chapters'}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} />
      </div>
    </div>
  );
}
