'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch, type SearchResult } from '@/hooks/useSearch';

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
    return content.slice(0, maxLen) + (content.length > maxLen ? '...' : '');
  }

  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + maxLen - 40);
  let snippet = content.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet += '...';
  return snippet;
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { query, setQuery, results, isLoading, loadIndex } = useSearch();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
  }, [setQuery]);

  const navigate = useCallback(
    (result: SearchResult) => {
      const targetPath = `/guides/${result.entry.guideSlug}`;
      const anchor = result.entry.sectionAnchor;

      if (pathname === targetPath && anchor) {
        const el = document.getElementById(anchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          close();
          return;
        }
      }

      const url = anchor ? `${targetPath}#${anchor}` : targetPath;
      router.push(url);
      close();
    },
    [pathname, router, close]
  );

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  // Cmd+K to open/close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            loadIndex();
            return true;
          }
          // If already open, close
          setQuery('');
          setActiveIndex(-1);
          return false;
        });
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [loadIndex, setQuery]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      // Small delay so the DOM is ready
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          navigate(results[activeIndex]);
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, results, activeIndex, navigate, close]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0) return;
    const items = listRef.current?.querySelectorAll('[data-cmd-item]');
    items?.[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={close}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[12vh] z-[101] mx-auto w-[calc(100%-2rem)] max-w-xl"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border px-4">
                <svg
                  className="shrink-0 text-text-muted"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search guides..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 flex-1 bg-transparent text-sm text-text placeholder:text-text-muted/60 focus:outline-none"
                />
                <kbd className="hidden select-none items-center rounded border border-border bg-background-soft px-1.5 py-0.5 text-[10px] font-medium text-text-muted sm:inline-flex">
                  ESC
                </kbd>
              </div>

              {/* Results feed */}
              <div ref={listRef} className="max-h-[min(60vh,420px)] overflow-y-auto">
                {isLoading && (
                  <div className="px-4 py-8 text-center text-sm text-text-muted">
                    Loading search index...
                  </div>
                )}

                {!isLoading && query.trim().length > 0 && results.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-text-muted">
                    No results found for &quot;{query}&quot;
                  </div>
                )}

                {!isLoading && query.trim().length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-text-muted">
                    Type to search across all guides and SOPs
                  </div>
                )}

                {results.map((result, i) => (
                  <div
                    key={`${result.entry.guideSlug}-${result.entry.sectionAnchor}`}
                    data-cmd-item
                    className={`cursor-pointer border-b border-border/40 px-4 py-3 transition-colors last:border-0 ${
                      i === activeIndex
                        ? 'bg-primary/10'
                        : 'hover:bg-background-soft'
                    }`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => navigate(result)}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="shrink-0 text-text-muted"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      <span className="text-sm font-semibold text-text">
                        {result.entry.guideTitle}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          difficultyColors[result.entry.difficulty] || ''
                        }`}
                      >
                        {result.entry.difficulty}
                      </span>
                    </div>
                    {result.entry.sectionHeading !== 'Introduction' && (
                      <div className="mt-0.5 pl-[22px] text-xs font-medium text-primary">
                        {result.entry.sectionHeading}
                      </div>
                    )}
                    <p className="mt-1 line-clamp-2 pl-[22px] text-xs text-text-muted">
                      {getSnippet(result.entry.content, query)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-border bg-background-soft px-1 py-px text-[10px]">&uarr;</kbd>
                    <kbd className="rounded border border-border bg-background-soft px-1 py-px text-[10px]">&darr;</kbd>
                    navigate
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-border bg-background-soft px-1 py-px text-[10px]">&crarr;</kbd>
                    open
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-border bg-background-soft px-1 py-px text-[10px]">esc</kbd>
                    close
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
