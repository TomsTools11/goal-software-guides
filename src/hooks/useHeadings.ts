'use client';

import { useSyncExternalStore, useCallback } from 'react';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

function getHeadingsFromDOM(): Heading[] {
  return Array.from(
    document.querySelectorAll<HTMLHeadingElement>('article h2, article h3')
  )
    .filter((el) => el.id)
    .map((el) => ({
      id: el.id,
      text: el.textContent ?? '',
      level: Number(el.tagName[1]),
    }));
}

const emptyHeadings: Heading[] = [];

export function useHeadings() {
  // Subscribe to nothing — headings are static after render.
  // useSyncExternalStore with a no-op subscribe re-reads on each render,
  // which captures headings once the MDX content mounts.
  const subscribe = useCallback((cb: () => void) => {
    // Re-check after a microtask to pick up headings rendered in the same cycle
    const id = requestAnimationFrame(cb);
    return () => cancelAnimationFrame(id);
  }, []);

  return useSyncExternalStore(
    subscribe,
    getHeadingsFromDOM,
    () => emptyHeadings
  );
}
