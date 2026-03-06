'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import type { GuideMetadata } from '@/lib/guides';
import type { GuideProgress } from '@/lib/progress';

interface CourseCardProps {
  guide: GuideMetadata;
  icon: React.ReactNode;
  progress: GuideProgress | null;
}

function relativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function CourseCard({ guide, icon, progress }: CourseCardProps) {
  const percent = progress?.percentComplete ?? 0;
  const isInProgress = percent > 0 && percent < 100;
  const isCompleted = percent >= 100;

  return (
    <motion.div
      className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3 flex items-start justify-between">
        {icon}
        <Badge variant={guide.category === 'sop' ? 'success' : 'primary'}>
          {guide.category === 'sop' ? 'SOP' : 'Guide'}
        </Badge>
      </div>

      <h3 className="mb-1 text-base font-bold text-text">{guide.title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-text-muted line-clamp-2">
        {guide.description}
      </p>

      {/* Meta info */}
      <div className="mb-3 flex items-center gap-3 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {guide.chapters} {guide.category === 'sop' ? 'sections' : 'chapters'}
        </span>
        <span>{guide.estimatedTime}</span>
        <Badge variant="default" className="!py-0 !text-[10px]">{guide.difficulty}</Badge>
      </div>

      {/* Progress */}
      {(isInProgress || isCompleted) && (
        <div className="mb-3">
          <ProgressBar value={percent} size="sm" />
          <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
            <span>{percent}% complete</span>
            {isInProgress && progress && (
              <span>{relativeTime(progress.lastAccessed)}</span>
            )}
          </div>
        </div>
      )}

      <Button
        href={`/guides/${guide.slug}`}
        variant={isCompleted ? 'secondary' : 'primary'}
        className="mt-auto w-full !py-2 !text-sm"
      >
        {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
      </Button>
    </motion.div>
  );
}
