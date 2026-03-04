'use client';

import { useState, useEffect, useCallback } from 'react';
import { getGuideProgress, updateSectionProgress } from '@/lib/progress';

interface ProgressState {
  completedSections: Set<string>;
  totalSections: number;
  percentComplete: number;
}

export function useProgressTracker(slug: string, sectionIds: string[]): ProgressState {
  const [completedSections, setCompletedSections] = useState<Set<string>>(() => {
    const existing = getGuideProgress(slug);
    return existing ? new Set(existing.completedSections) : new Set();
  });

  // Load existing progress and update lastAccessed
  useEffect(() => {
    const existing = getGuideProgress(slug);
    if (existing) {
      setCompletedSections(new Set(existing.completedSections));
    }
    // Touch lastAccessed
    if (sectionIds.length > 0) {
      updateSectionProgress(slug, existing?.completedSections ?? [], sectionIds.length);
    }
  }, [slug, sectionIds.length]);

  const markCompleted = useCallback(
    (id: string) => {
      setCompletedSections((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        updateSectionProgress(slug, [...next], sectionIds.length);
        return next;
      });
    },
    [slug, sectionIds.length]
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
