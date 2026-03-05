'use client';

import { useState, useEffect } from 'react';
import { getAllProgress, computeStatsFromStore, sortByRecentlyAccessed, type DashboardStats, type GuideProgress } from '@/lib/progress';
import { getAllProgressRemote } from '@/lib/progress-sync';
import { guides } from '@/lib/guides';
import { useAuth } from '@/hooks/useAuth';

type ProgressStore = Record<string, GuideProgress>;

interface DashboardData {
  stats: DashboardStats;
  recentlyAccessed: Array<{ slug: string; progress: GuideProgress }>;
  progress: ProgressStore;
}

export function useDashboardStats(): DashboardData {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData>({
    stats: { totalGuides: guides.length, completed: 0, inProgress: 0, notStarted: guides.length },
    recentlyAccessed: [],
    progress: {},
  });

  useEffect(() => {
    if (authLoading) return;

    function applyStore(store: ProgressStore) {
      setData({
        stats: computeStatsFromStore(store, guides.length),
        recentlyAccessed: sortByRecentlyAccessed(store),
        progress: store,
      });
    }

    if (user) {
      getAllProgressRemote().then(applyStore).catch(() => applyStore(getAllProgress()));
    } else {
      applyStore(getAllProgress());
    }
  }, [user, authLoading]);

  return data;
}
