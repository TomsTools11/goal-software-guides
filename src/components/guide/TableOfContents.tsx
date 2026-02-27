'use client';

import { useHeadings } from '@/hooks/useHeadings';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export function TableOfContents() {
  const headings = useHeadings();
  const activeId = useScrollSpy(headings.map((h) => h.id));

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <ul className="space-y-1 text-sm">
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
                className={`block rounded-md px-3 py-1.5 transition-colors ${
                  heading.level === 3 ? 'pl-6' : ''
                } ${
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
