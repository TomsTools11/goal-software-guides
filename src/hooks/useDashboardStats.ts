'use client';

import { useConvexAuth, useQuery } from 'convex/react';
import { getAllProgress, computeStatsFromStore, sortByRecentlyAccessed, type DashboardStats, type GuideProgress, type ProgressStore } from '@/lib/progress';
import { guides } from '@/lib/guides';
import { api } from '../../convex/_generated/api';

interface DashboardData {
  stats: DashboardStats;
  recentlyAccessed: Array<{ slug: string; progress: GuideProgress }>;
  progress: ProgressStore;
}

export function useDashboardStats(): DashboardData {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const remoteProgress = useQuery(
    api.progress.getAllProgress,
    isAuthenticated ? {} : "skip"
  );

  // If authenticated and data loaded, use remote data
  if (isAuthenticated && remoteProgress && !isLoading) {
    const store = remoteProgress as ProgressStore;
    return {
      stats: computeStatsFromStore(store, guides.length),
      recentlyAccessed: sortByRecentlyAccessed(store),
      progress: store,
    };
  }

  // Fallback to localStorage for guests or while loading
  if (!isAuthenticated && !isLoading) {
    const store = getAllProgress();
    return {
      stats: computeStatsFromStore(store, guides.length),
      recentlyAccessed: sortByRecentlyAccessed(store),
      progress: store,
    };
  }

  // Default loading state
  return {
    stats: { totalGuides: guides.length, completed: 0, inProgress: 0, notStarted: guides.length },
    recentlyAccessed: [],
    progress: {},
  };
}
