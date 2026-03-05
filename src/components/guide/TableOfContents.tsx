'use client';

import { useMemo } from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import type { Heading } from '@/hooks/useHeadings';

interface TableOfContentsProps {
  headings: Heading[];
  completedSections?: Set<string>;
  onNavigate?: () => void;
}

export function TableOfContents({ headings: allHeadings, completedSections, onNavigate }: TableOfContentsProps) {
  const headings = useMemo(() => allHeadings.filter((h) => h.level === 2), [allHeadings]);
  const headingIds = useMemo(() => headings.map((h) => h.id), [headings]);
  const activeId = useScrollSpy(headingIds);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Contents</p>
      <ul className="space-y-0.5 text-xs">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          const isCompleted = completedSections?.has(heading.id);
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                  onNavigate?.();
                }}
                className={`flex items-center gap-2 rounded px-2 py-1 leading-snug transition-colors ${
                  isActive
                    ? 'border-l-2 border-primary bg-primary/10 font-semibold text-primary'
                    : isCompleted
                      ? 'border-l-2 border-success/40 text-text-muted'
                      : 'border-l-2 border-transparent text-text-muted hover:bg-background-soft hover:text-text'
                }`}
              >
                {isCompleted && !isActive && (
                  <svg className="shrink-0 text-success" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span>{heading.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
