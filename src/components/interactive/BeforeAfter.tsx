'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdCopy {
  headline: string;
  subhead?: string;
  bullets?: string[];
  badge?: string;
}

interface BeforeAfterProps {
  id: string;
  before: AdCopy;
  after: AdCopy;
}

function AdCard({ ad, variant }: { ad: AdCopy; variant: 'before' | 'after' }) {
  const isBefore = variant === 'before';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={`rounded-xl border-2 p-5 ${
        isBefore
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-green-500/30 bg-green-500/5'
      }`}
    >
      <span
        className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          isBefore
            ? 'bg-red-500/15 text-red-600 dark:text-red-400'
            : 'bg-green-500/15 text-green-600 dark:text-green-400'
        }`}
      >
        {isBefore ? 'Before' : 'After'}
      </span>

      <h4 className="mb-1 text-base font-bold text-text">{ad.headline}</h4>

      {ad.subhead && (
        <p className="mb-3 text-sm text-text-muted">{ad.subhead}</p>
      )}

      {ad.bullets && ad.bullets.length > 0 && (
        <ul className="mb-3 space-y-1">
          {ad.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-text-muted"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {ad.badge && (
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {ad.badge}
        </span>
      )}
    </motion.div>
  );
}

export function BeforeAfter({ id, before, after }: BeforeAfterProps) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className="my-6">
      {/* Mobile toggle */}
      <div className="mb-4 flex items-center justify-center gap-3 md:hidden">
        <span
          className={`text-xs font-semibold transition-colors ${
            !showAfter ? 'text-red-500' : 'text-text-muted'
          }`}
        >
          Before
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={showAfter}
          aria-label={`Toggle ${id} comparison`}
          onClick={() => setShowAfter(!showAfter)}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            showAfter ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <motion.span
            className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm"
            animate={{ x: showAfter ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <span
          className={`text-xs font-semibold transition-colors ${
            showAfter ? 'text-green-500' : 'text-text-muted'
          }`}
        >
          After
        </span>
      </div>

      {/* Mobile: toggle view */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          {showAfter ? (
            <AdCard key="after" ad={after} variant="after" />
          ) : (
            <AdCard key="before" ad={before} variant="before" />
          )}
        </AnimatePresence>
      </div>

      {/* Desktop: side by side */}
      <div className="hidden gap-4 md:grid md:grid-cols-2">
        <AdCard ad={before} variant="before" />
        <AdCard ad={after} variant="after" />
      </div>
    </div>
  );
}
