'use client';

import { useHeadings } from '@/hooks/useHeadings';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export function TableOfContents() {
  const allHeadings = useHeadings();
  // Only show h2 headings for a compact sidebar TOC
  const headings = allHeadings.filter((h) => h.level === 2);
  const activeId = useScrollSpy(headings.map((h) => h.id));

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Contents</p>
      <ul className="space-y-0.5 text-xs">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block rounded px-2 py-1 leading-snug transition-colors ${
                  isActive
                    ? 'border-l-2 border-primary bg-primary-50 font-semibold text-primary'
                    : 'border-l-2 border-transparent text-text-muted hover:bg-background-soft hover:text-text'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
