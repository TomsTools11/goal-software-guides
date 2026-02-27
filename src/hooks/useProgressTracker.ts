'use client';

import { useState, useEffect, useCallback } from 'react';

interface ProgressState {
  completedSections: Set<string>;
  totalSections: number;
  percentComplete: number;
}

export function useProgressTracker(slug: string, sectionIds: string[]): ProgressState {
  const storageKey = `goal-guide-progress-${slug}`;

  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Reset progress on mount so each visit starts fresh at 0%
  useEffect(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore storage errors
    }
    setCompletedSections(new Set());
  }, [storageKey]);

  // Track sections as user scrolls past them
  const markCompleted = useCallback(
    (id: string) => {
      setCompletedSections((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        try {
          localStorage.setItem(storageKey, JSON.stringify([...next]));
        } catch {
          // storage full — ignore
        }
        return next;
      });
    },
    [storageKey]
  );

  // Observe sections passing viewport
  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            markCompleted(entry.target.id);
          }
        }
      },
      { rootMargin: '0px 0px -40% 0px', threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds, markCompleted]);

  const total = sectionIds.length;
  const percent = total > 0 ? Math.round((completedSections.size / total) * 100) : 0;

  return {
    completedSections,
    totalSections: total,
    percentComplete: percent,
  };
}
