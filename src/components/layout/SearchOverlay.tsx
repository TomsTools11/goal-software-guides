'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { SearchResult } from '@/hooks/useSearch';

interface SearchOverlayProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  onClose: () => void;
}

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-500/15 text-green-600 dark:text-green-400',
  Intermediate: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Advanced: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

function getSnippet(content: string, query: string, maxLen = 120): string {
  const lower = content.toLowerCase();
  const qLower = query.toLowerCase().split(/\s+/)[0] || '';
  const idx = qLower ? lower.indexOf(qLower) : -1;

  if (idx === -1) {
    return content.slice(0, maxLen) + (content.length > maxLen ? '…' : '');
  }

  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + maxLen - 40);
  let snippet = content.slice(start, end);
  if (start > 0) snippet = '…' + snippet;
  if (end < content.length) snippet += '…';
  return snippet;
}

export function SearchOverlay({ results, isLoading, query, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeIndexRef = useRef(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const show = query.trim().length > 0;

  const navigate = useCallback(
    (result: SearchResult) => {
      const targetPath = `/guides/${result.entry.guideSlug}`;
      const anchor = result.entry.sectionAnchor;

      if (pathname === targetPath && anchor) {
        // Same page — scroll to anchor
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          onClose();
          return;
        }
      }

      const url = anchor ? `${targetPath}#${anchor}` : targetPath;
      router.push(url);
      onClose();
    },
    [pathname, router, onClose]
  );

  useEffect(() => {
    activeIndexRef.current = -1;
  }, [results]);

  useEffect(() => {
    if (!show) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndexRef.current = Math.min(activeIndexRef.current + 1, results.length - 1);
        updateActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndexRef.current = Math.max(activeIndexRef.current - 1, 0);
        updateActive();
      } else if (e.key === 'Enter' && activeIndexRef.current >= 0) {
        e.preventDefault();
        navigate(results[activeIndexRef.current]);
      }
    }

    function updateActive() {
      const items = listRef.current?.querySelectorAll('[data-search-item]');
      items?.forEach((item, i) => {
        if (i === activeIndexRef.current) {
          item.classList.add('bg-background-soft');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('bg-background-soft');
        }
      });
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, results, navigate, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[420px] overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
          ref={listRef}
        >
          {isLoading && (
            <div className="px-4 py-3 text-sm text-text-muted">Loading search index…</div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-text-muted">No results found</div>
          )}

          {results.map((result, i) => (
            <div
              key={`${result.entry.guideSlug}-${result.entry.sectionAnchor}`}
              data-search-item
              className="cursor-pointer border-b border-border/50 px-4 py-3 transition-colors last:border-0 hover:bg-background-soft"
              onMouseEnter={() => {
                activeIndexRef.current = i;
                const items = listRef.current?.querySelectorAll('[data-search-item]');
                items?.forEach((item, j) => {
                  item.classList.toggle('bg-background-soft', j === i);
                });
              }}
              onClick={() => navigate(result)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text">{result.entry.guideTitle}</span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[result.entry.difficulty] || ''}`}>
                  {result.entry.difficulty}
                </span>
              </div>
              {result.entry.sectionHeading !== 'Introduction' && (
                <div className="mt-0.5 text-xs font-medium text-primary">
                  {result.entry.sectionHeading}
                </div>
              )}
              <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                {getSnippet(result.entry.content, query)}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
