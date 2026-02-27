'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { GuideSidebar } from './GuideSidebar';
import { ScrollProgress } from './ScrollProgress';
import { useHeadings } from '@/hooks/useHeadings';
import { useProgressTracker } from '@/hooks/useProgressTracker';
import type { GuideMetadata } from '@/lib/guides';

interface GuideLayoutProps {
  guide: GuideMetadata;
  children: React.ReactNode;
}

export function GuideLayout({ guide, children }: GuideLayoutProps) {
  const headings = useHeadings();
  const h2Ids = headings.filter((h) => h.level === 2).map((h) => h.id);
  const { percentComplete } = useProgressTracker(guide.slug, h2Ids);
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <>
      <ScrollProgress />

      <Container className="py-10">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <GuideSidebar guide={guide} progressPercent={percentComplete} />
            </div>
          </div>

          {/* Content */}
          <article className="min-w-0 max-w-none">{children}</article>
        </div>
      </Container>

      {/* Mobile FAB */}
      <button
        type="button"
        onClick={() => setTocOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-text-inverse shadow-lg transition-transform hover:scale-105 lg:hidden"
        aria-label="Open table of contents"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTocOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-text">Contents</h3>
                <button
                  type="button"
                  onClick={() => setTocOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-background-soft"
                  aria-label="Close table of contents"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <GuideSidebar guide={guide} progressPercent={percentComplete} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
