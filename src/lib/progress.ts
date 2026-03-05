const STORAGE_KEY = 'goal-progress-v2';

export interface GuideProgress {
  completedSections: string[];
  totalSections: number;
  percentComplete: number;
  lastAccessed: number;
  startedAt: number;
  completedAt: number | null;
}

export interface DashboardStats {
  totalGuides: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

type ProgressStore = Record<string, GuideProgress>;

function readStore(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: ProgressStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage full — ignore
  }
}

export function getAllProgress(): ProgressStore {
  return readStore();
}

export function getGuideProgress(slug: string): GuideProgress | null {
  const store = readStore();
  return store[slug] ?? null;
}

export function updateSectionProgress(
  slug: string,
  completedSections: string[],
  totalSections: number
) {
  const store = readStore();
  const existing = store[slug];
  const percent = totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0;

  store[slug] = {
    completedSections,
    totalSections,
    percentComplete: percent,
    lastAccessed: Date.now(),
    startedAt: existing?.startedAt ?? Date.now(),
    completedAt: percent >= 100 ? (existing?.completedAt ?? Date.now()) : null,
  };

  writeStore(store);
  return store[slug];
}

export function computeStatsFromStore(
  store: ProgressStore,
  totalGuides: number
): DashboardStats {
  let completed = 0;
  let inProgress = 0;

  for (const progress of Object.values(store)) {
    if (progress.percentComplete >= 100) {
      completed++;
    } else if (progress.completedSections.length > 0) {
      inProgress++;
    }
  }

  return {
    totalGuides,
    completed,
    inProgress,
    notStarted: totalGuides - completed - inProgress,
  };
}

export function sortByRecentlyAccessed(
  store: ProgressStore
): Array<{ slug: string; progress: GuideProgress }> {
  return Object.entries(store)
    .map(([slug, progress]) => ({ slug, progress }))
    .sort((a, b) => b.progress.lastAccessed - a.progress.lastAccessed);
}

export function getDashboardStats(totalGuides: number): DashboardStats {
  return computeStatsFromStore(readStore(), totalGuides);
}

export function getRecentlyAccessed(): Array<{ slug: string; progress: GuideProgress }> {
  return sortByRecentlyAccessed(readStore());
}

export function resetAllProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
