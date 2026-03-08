'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';

export interface SearchEntry {
  guideSlug: string;
  guideTitle: string;
  guideDescription: string;
  sectionHeading: string;
  sectionAnchor: string;
  content: string;
  difficulty: string;
  categories: string[];
}

export interface SearchResult {
  entry: SearchEntry;
  score: number;
}

const FUSE_OPTIONS: IFuseOptions<SearchEntry> = {
  keys: [
    { name: 'guideTitle', weight: 1.0 },
    { name: 'sectionHeading', weight: 0.8 },
    { name: 'guideDescription', weight: 0.6 },
    { name: 'content', weight: 0.4 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fuseRef = useRef<Fuse<SearchEntry> | null>(null);
  const indexLoadedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadIndex = useCallback(async () => {
    if (indexLoadedRef.current) return;
    indexLoadedRef.current = true;
    setIsLoading(true);
    try {
      const res = await fetch('/search-index.json');
      const data: SearchEntry[] = await res.json();
      fuseRef.current = new Fuse(data, FUSE_OPTIONS);
    } catch (e) {
      console.error('Failed to load search index:', e);
      indexLoadedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      if (!fuseRef.current) return;
      const raw = fuseRef.current.search(query, { limit: 20 });

      // Deduplicate: keep best-scoring section per guide
      const bestByGuide = new Map<string, SearchResult>();
      for (const r of raw) {
        const key = r.item.guideSlug;
        const score = r.score ?? 1;
        const existing = bestByGuide.get(key);
        if (!existing || score < existing.score) {
          bestByGuide.set(key, { entry: r.item, score });
        }
      }

      const sorted = Array.from(bestByGuide.values())
        .sort((a, b) => a.score - b.score)
        .slice(0, 8);

      setResults(sorted);
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return { query, setQuery, results, isLoading, loadIndex };
}
