'use client';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { TableOfContents } from './TableOfContents';

interface GuideSidebarProps {
  progressPercent: number;
  completedSections: Set<string>;
  onNavigate?: () => void;
}

export function GuideSidebar({ progressPercent, completedSections, onNavigate }: GuideSidebarProps) {
  return (
    <aside className="flex flex-col gap-5">
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} />
      </div>

      <div className="border-t border-border pt-4">
        <TableOfContents completedSections={completedSections} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}
