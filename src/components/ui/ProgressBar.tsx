'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, className = '', showLabel = false, size = 'md' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${heightClass} w-full overflow-hidden rounded-full bg-primary/15`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs font-medium text-text-muted">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
