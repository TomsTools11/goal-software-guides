'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentlyAccessed, type DashboardStats, type GuideProgress } from '@/lib/progress';
import { guides } from '@/lib/guides';

interface DashboardData {
  stats: DashboardStats;
  recentlyAccessed: Array<{ slug: string; progress: GuideProgress }>;
}

export function useDashboardStats(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    stats: { totalGuides: guides.length, completed: 0, inProgress: 0, notStarted: guides.length },
    recentlyAccessed: [],
  });

  useEffect(() => {
    setData({
      stats: getDashboardStats(guides.length),
      recentlyAccessed: getRecentlyAccessed(),
    });
  }, []);

  return data;
}
