'use client';

import { useState, useEffect } from 'react';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function useHeadings() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLHeadingElement>('article h2, article h3')
    );
    setHeadings(
      elements
        .filter((el) => el.id)
        .map((el) => ({
          id: el.id,
          text: el.textContent ?? '',
          level: Number(el.tagName[1]),
        }))
    );
  }, []);

  return headings;
}
