'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Step {
  title: string;
  content: React.ReactNode;
}

interface StepByStepProps {
  steps: Step[];
}

function formatContent(content: React.ReactNode): React.ReactNode {
  if (typeof content !== 'string') return content;

  const blocks = content.split('\n\n');
  const elements: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];

  function flushBullets() {
    if (bulletBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="mt-2 space-y-2">
        {bulletBuffer.map((item, j) => {
          const dashIdx = item.indexOf(' — ');
          if (dashIdx !== -1) {
            return (
              <li key={j} className="flex gap-1.5 before:mt-1.5 before:block before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-primary/40">
                <span><strong className="text-text">{item.slice(0, dashIdx)}</strong> — {item.slice(dashIdx + 3)}</span>
              </li>
            );
          }
          return (
            <li key={j} className="flex gap-1.5 before:mt-1.5 before:block before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-primary/40">
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    );
    bulletBuffer = [];
  }

  for (const block of blocks) {
    const trimmed = block.trim();
    if (trimmed.startsWith('• ')) {
      bulletBuffer.push(trimmed.slice(2));
    } else {
      flushBullets();
      elements.push(<p key={`p-${elements.length}`} className="mt-2 first:mt-0">{trimmed}</p>);
    }
  }
  flushBullets();

  return <>{elements}</>;
}

export function StepByStep({ steps }: StepByStepProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="my-6">
      <div className="space-y-0">
        {steps.map((step, i) => {
          const isActive = i === activeIndex;
          const isCompleted = i < activeIndex;
          return (
            <motion.div
              key={i}
              className="relative flex gap-4"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-primary text-text-inverse'
                      : isCompleted
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-background-soft text-text-muted'
                  }`}
                  aria-label={`Step ${i + 1}: ${step.title}`}
                >
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </button>
                {i < steps.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 ${
                      isCompleted ? 'bg-primary-200' : 'bg-border'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="mb-1 text-left text-sm font-semibold text-text"
                >
                  {step.title}
                </button>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="text-sm leading-relaxed text-text-muted"
                  >
                    {formatContent(step.content)}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
