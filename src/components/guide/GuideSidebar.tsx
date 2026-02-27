'use client';

import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TableOfContents } from './TableOfContents';
import type { GuideMetadata } from '@/lib/guides';

interface GuideSidebarProps {
  guide: GuideMetadata;
  progressPercent: number;
  onNavigate?: () => void;
}

export function GuideSidebar({ guide, progressPercent, onNavigate }: GuideSidebarProps) {
  return (
    <aside className="flex flex-col gap-5">
      <div>
        <h2 className="mb-1 text-sm font-bold text-text">{guide.title}</h2>
        <div className="flex items-center gap-2">
          <Badge variant="primary">{guide.difficulty}</Badge>
          <span className="text-xs text-text-muted">{guide.estimatedTime}</span>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} />
      </div>

      <div className="border-t border-border pt-4">
        <TableOfContents onNavigate={onNavigate} />
      </div>
    </aside>
  );
}
