'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stage {
  label: string;
  content: string;
  icon?: string;
}

interface RevealCardProps {
  id: string;
  title: string;
  stages: Stage[];
}

let listeners: Array<() => void> = [];
function emitChange() {
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function readProgress(key: string): number {
  try {
    const val = localStorage.getItem(key);
    if (val) {
      const n = parseInt(val, 10);
      if (!isNaN(n)) return n;
    }
  } catch {
    // ignore
  }
  return 0;
}

export function RevealCard({ id, title, stages }: RevealCardProps) {
  const storageKey = `goal-reveal-${id}`;

  const completedCount = useSyncExternalStore(
    subscribe,
    () => readProgress(storageKey),
    () => 0
  );

  const [activeStage, setActiveStage] = useState<number | null>(null);

  const handleStageClick = useCallback(
    (index: number) => {
      if (index > completedCount) return; // locked
      setActiveStage((prev) => (prev === index ? null : index));

      // Mark as completed if this is the next stage
      if (index === completedCount) {
        try {
          localStorage.setItem(storageKey, String(completedCount + 1));
        } catch {
          // ignore
        }
        emitChange();
      }
    },
    [completedCount, storageKey]
  );

  const handleReset = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setActiveStage(null);
    emitChange();
  }, [storageKey]);

  const allComplete = completedCount >= stages.length;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background-soft px-5 py-3">
        <span className="text-sm font-semibold text-text">{title}</span>
        {allComplete && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-text-muted hover:text-text"
          >
            Reset
          </button>
        )}
      </div>

      <div className="p-5">
        {/* Progress bar with stage indicators */}
        <div className="relative mb-6 flex items-center justify-between">
          {/* Connecting line */}
          <div className="absolute top-4 right-4 left-4 h-0.5 bg-border" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-500"
            style={{
              width: `${stages.length > 1 ? (Math.min(completedCount, stages.length - 1) / (stages.length - 1)) * (100 - (8 / 1) * 0) : 0}%`,
              maxWidth: 'calc(100% - 2rem)',
            }}
          />

          {stages.map((stage, i) => {
            const isCompleted = i < completedCount;
            const isCurrent = i === completedCount;
            const isLocked = i > completedCount;
            const isActive = activeStage === i;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleStageClick(i)}
                disabled={isLocked}
                className="relative z-10 flex flex-col items-center gap-2"
                aria-label={`Stage ${i + 1}: ${stage.label}${isLocked ? ' (locked)' : ''}`}
              >
                <motion.div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : isCurrent
                        ? 'border-2 border-primary bg-surface text-primary'
                        : 'border-2 border-border bg-surface text-text-muted'
                  } ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  whileTap={!isLocked ? { scale: 0.92 } : undefined}
                >
                  {isCompleted ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    stage.icon || i + 1
                  )}
                </motion.div>
                <span
                  className={`max-w-[80px] text-center text-[11px] leading-tight ${
                    isActive || isCurrent
                      ? 'font-semibold text-text'
                      : isLocked
                        ? 'text-text-muted/50'
                        : 'text-text-muted'
                  }`}
                >
                  {stage.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          {activeStage !== null && (
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-border bg-background-soft px-5 py-4 text-sm leading-relaxed text-text-muted">
                {stages[activeStage].content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success banner */}
        <AnimatePresence>
          {allComplete && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 rounded-lg bg-green-500/10 px-4 py-3 text-center text-sm font-medium text-green-600 dark:text-green-400"
            >
              All stages complete! You've mastered the full motion.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
