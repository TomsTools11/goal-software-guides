'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getGuideProgress, updateSectionProgress } from '@/lib/progress';
import { updateSectionProgressRemote } from '@/lib/progress-sync';
import { useAuth } from '@/hooks/useAuth';

interface ProgressState {
  completedSections: Set<string>;
  totalSections: number;
  percentComplete: number;
}

export function useProgressTracker(slug: string, sectionIds: string[]): ProgressState {
  const { user } = useAuth();
  const [completedSections, setCompletedSections] = useState<Set<string>>(() => {
    const existing = getGuideProgress(slug);
    return existing ? new Set(existing.completedSections) : new Set();
  });
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const syncToRemote = useCallback(
    (sections: string[], total: number) => {
      if (!user) return;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        updateSectionProgressRemote(slug, sections, total);
      }, 1500);
    },
    [user, slug]
  );

  const markCompleted = useCallback(
    (id: string) => {
      setCompletedSections((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        const sectionsArr = [...next];
        // Always write to localStorage (works for both guest and logged-in)
        updateSectionProgress(slug, sectionsArr, sectionIds.length);
        // Also sync to Supabase if logged in (debounced)
        syncToRemote(sectionsArr, sectionIds.length);
        return next;
      });
    },
    [slug, sectionIds.length, syncToRemote]
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

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const total = sectionIds.length;
  const percent = total > 0 ? Math.round((completedSections.size / total) * 100) : 0;

  return {
    completedSections,
    totalSections: total,
    percentComplete: percent,
  };
}
