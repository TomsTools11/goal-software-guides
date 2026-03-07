'use client';

import { useState, useEffect } from 'react';

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

export function useHeadings() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Read headings after MDX content has mounted
    const id = requestAnimationFrame(() => {
      setHeadings(getHeadingsFromDOM());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return headings;
}
