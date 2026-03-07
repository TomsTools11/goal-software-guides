'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { BrowserChrome } from './BrowserChrome';

interface FunnelStep {
  label: string;
  description: string;
  icon?: string;
}

interface FunnelVisualizationProps {
  steps: FunnelStep[];
  title?: string;
}

const WIDTH_PERCENTAGES = [100, 85, 70, 55, 40];

export function FunnelVisualization({ steps, title = 'GOAL Exclusive Funnel' }: FunnelVisualizationProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const prefersReduced = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );

  return (
    <div className="my-6">
      <BrowserChrome title={title} variant="dark">
        <div className="flex flex-col items-center gap-2 p-6">
          {steps.map((step, i) => {
            const widthPct = WIDTH_PERCENTAGES[i] ?? Math.max(30, 100 - i * 15);
            const isExpanded = expandedIndex === i;

            return (
              <div key={i} className="flex w-full flex-col items-center">
                <motion.button
                  type="button"
                  className="relative cursor-pointer rounded-lg px-4 py-3 text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  style={{
                    width: `max(${widthPct}%, 200px)`,
                    background: `linear-gradient(135deg, var(--color-primary-300), var(--color-primary-700))`,
                    opacity: 0.85 + (i * 0.03),
                  }}
                  initial={prefersReduced ? false : { opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.15, duration: 0.4, ease: 'easeOut' }}
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2">
                    {step.icon && <span className="text-lg">{step.icon}</span>}
                    <span className="text-xs font-semibold text-white sm:text-sm">
                      Step {i + 1}: {step.label}
                    </span>
                    <span className="ml-auto text-[10px] text-white/50">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>
                </motion.button>

                {isExpanded && (
                  <motion.div
                    initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-1 rounded-md bg-white/10 px-4 py-2.5"
                    style={{ width: `max(${widthPct}%, 200px)` }}
                  >
                    <p className="text-xs leading-relaxed text-white/80">{step.description}</p>
                  </motion.div>
                )}

                {i < steps.length - 1 && (
                  <div className="my-0.5 h-2 w-px bg-white/20" />
                )}
              </div>
            );
          })}
        </div>
      </BrowserChrome>
    </div>
  );
}
