'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentlyAccessed, type DashboardStats, type GuideProgress } from '@/lib/progress';
import { getDashboardStatsRemote, getRecentlyAccessedRemote } from '@/lib/progress-sync';
import { guides } from '@/lib/guides';
import { useAuth } from '@/hooks/useAuth';

interface DashboardData {
  stats: DashboardStats;
  recentlyAccessed: Array<{ slug: string; progress: GuideProgress }>;
}

export function useDashboardStats(): DashboardData {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData>({
    stats: { totalGuides: guides.length, completed: 0, inProgress: 0, notStarted: guides.length },
    recentlyAccessed: [],
  });

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // Logged in — fetch from Supabase
      Promise.all([
        getDashboardStatsRemote(guides.length),
        getRecentlyAccessedRemote(),
      ]).then(([stats, recentlyAccessed]) => {
        setData({ stats, recentlyAccessed });
      });
    } else {
      // Guest — use localStorage
      setData({
        stats: getDashboardStats(guides.length),
        recentlyAccessed: getRecentlyAccessed(),
      });
    }
  }, [user, authLoading]);

  return data;
}
