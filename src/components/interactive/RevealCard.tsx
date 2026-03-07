'use client';

import { useState } from 'react';
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

export function RevealCard({ id, title, stages }: RevealCardProps) {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      {/* Header */}
      <div className="border-b border-border bg-background-soft px-5 py-3">
        <span className="text-sm font-semibold text-text">{title}</span>
      </div>

      <div className="p-5">
        {/* Stage indicators */}
        <div className="relative mb-6 flex items-center justify-between">
          {/* Connecting line */}
          <div className="absolute top-4 right-4 left-4 h-0.5 bg-border" />

          {stages.map((stage, i) => {
            const isActive = activeStage === i;

            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveStage((prev) => (prev === i ? null : i))}
                className="relative z-10 flex flex-col items-center gap-2"
                aria-label={`Stage ${i + 1}: ${stage.label}`}
              >
                <motion.div
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'border-2 border-primary bg-surface text-primary'
                  }`}
                  whileTap={{ scale: 0.92 }}
                >
                  {stage.icon || i + 1}
                </motion.div>
                <span
                  className={`max-w-[80px] text-center text-[11px] leading-tight ${
                    isActive
                      ? 'font-semibold text-text'
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
      </div>
    </div>
  );
}
