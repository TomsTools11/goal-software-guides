import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { computeStatsFromStore, sortByRecentlyAccessed } from '@/lib/progress';
import type { GuideProgress, DashboardStats } from '@/lib/progress';

type ProgressStore = Record<string, GuideProgress>;

interface SupabaseProgressRow {
  user_id: string;
  guide_slug: string;
  completed_sections: string[];
  total_sections: number;
  percent_complete: number;
  last_accessed: number;
  started_at: number;
  completed_at: number | null;
}

function rowToGuideProgress(row: SupabaseProgressRow): GuideProgress {
  return {
    completedSections: row.completed_sections,
    totalSections: row.total_sections,
    percentComplete: row.percent_complete,
    lastAccessed: row.last_accessed,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

export async function getAllProgressRemote(): Promise<ProgressStore> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase
    .from('user_progress')
    .select('*');

  if (!data) return {};

  const store: ProgressStore = {};
  for (const row of data as SupabaseProgressRow[]) {
    store[row.guide_slug] = rowToGuideProgress(row);
  }
  return store;
}

export async function updateSectionProgressRemote(
  slug: string,
  completedSections: string[],
  totalSections: number
): Promise<GuideProgress | null> {
  const supabase = getSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const percent = totalSections > 0
    ? Math.round((completedSections.length / totalSections) * 100)
    : 0;

  const now = Date.now();

  const { data: existing } = await supabase
    .from('user_progress')
    .select('started_at, completed_at')
    .eq('guide_slug', slug)
    .single();

  const row = {
    user_id: user.id,
    guide_slug: slug,
    completed_sections: completedSections,
    total_sections: totalSections,
    percent_complete: percent,
    last_accessed: now,
    started_at: existing?.started_at ?? now,
    completed_at: percent >= 100 ? (existing?.completed_at ?? now) : null,
    updated_at: new Date().toISOString(),
  };

  const { data: upserted } = await supabase
    .from('user_progress')
    .upsert(row, { onConflict: 'user_id,guide_slug' })
    .select()
    .single();

  if (!upserted) return null;
  return rowToGuideProgress(upserted as SupabaseProgressRow);
}

export async function resetAllProgressRemote(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', user.id);
}

export async function getDashboardStatsRemote(
  totalGuides: number
): Promise<DashboardStats> {
  const store = await getAllProgressRemote();
  return computeStatsFromStore(store, totalGuides);
}

export async function getRecentlyAccessedRemote(): Promise<
  Array<{ slug: string; progress: GuideProgress }>
> {
  const store = await getAllProgressRemote();
  return sortByRecentlyAccessed(store);
}

export async function migrateLocalProgressToRemote(
  localProgress: ProgressStore
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Get existing remote progress to avoid overwriting
  const { data: existing } = await supabase
    .from('user_progress')
    .select('guide_slug');

  const existingSlugs = new Set((existing ?? []).map((r: { guide_slug: string }) => r.guide_slug));

  const rowsToInsert = Object.entries(localProgress)
    .filter(([slug]) => !existingSlugs.has(slug))
    .map(([slug, progress]) => ({
      user_id: user.id,
      guide_slug: slug,
      completed_sections: progress.completedSections,
      total_sections: progress.totalSections,
      percent_complete: progress.percentComplete,
      last_accessed: progress.lastAccessed,
      started_at: progress.startedAt,
      completed_at: progress.completedAt,
    }));

  if (rowsToInsert.length > 0) {
    await supabase.from('user_progress').insert(rowsToInsert);
  }
}
