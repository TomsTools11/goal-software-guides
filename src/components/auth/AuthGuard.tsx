'use client';

import { useEffect, useRef } from 'react';
import { useConvexAuth, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { getAllProgress } from '@/lib/progress';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const getOrCreate = useMutation(api.users.getOrCreate);
  const migrateLocalProgress = useMutation(api.progress.migrateLocalProgress);
  const didInit = useRef(false);

  // Ensure Convex user exists + migrate localStorage on first authenticated load
  useEffect(() => {
    if (!isAuthenticated || didInit.current) return;
    didInit.current = true;

    async function init() {
      await getOrCreate();

      const localProgress = getAllProgress();
      const entries = Object.entries(localProgress);
      if (entries.length > 0) {
        await migrateLocalProgress({
          entries: entries.map(([guideSlug, p]) => ({
            guideSlug,
            completedSections: p.completedSections,
            totalSections: p.totalSections,
            percentComplete: p.percentComplete,
            lastAccessed: p.lastAccessed,
            startedAt: p.startedAt,
            completedAt: p.completedAt ?? undefined,
          })),
        });
      }
    }

    init();
  }, [isAuthenticated, getOrCreate, migrateLocalProgress]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
