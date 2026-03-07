'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ObjectionCardProps {
  id: string;
  objection: string;
  response: string;
  tip?: string;
}

export function ObjectionCard({ id, objection, response, tip }: ObjectionCardProps) {
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    setFlipped((f) => !f);
  }

  return (
    <div className="my-6" style={{ perspective: 1000 }}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`Objection card: ${objection}. ${flipped ? 'Showing response' : 'Click to reveal response'}`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="relative min-h-[200px] cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front — Objection */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-xl border border-white/10 bg-[#1e1e2e] p-6 shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <span className="mb-3 inline-block rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
              Objection
            </span>
            <p className="text-base font-semibold leading-relaxed text-white/90">
              &ldquo;{objection}&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/30">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            Click to flip
          </div>
        </div>

        {/* Back — Response */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-xl border border-primary/20 bg-primary/10 p-6 shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div>
            <span className="mb-3 inline-block rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              Response
            </span>
            <p className="text-sm leading-relaxed text-text">
              {response}
            </p>
            {tip && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-xs font-semibold text-primary">Coaching Tip</p>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                  {tip}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-muted/50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            Click to flip back
          </div>
        </div>
      </motion.div>
    </div>
  );
}
