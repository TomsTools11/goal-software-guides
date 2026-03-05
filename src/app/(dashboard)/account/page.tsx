'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getAllProgressRemote, resetAllProgressRemote } from '@/lib/progress-sync';
import { resetAllProgress } from '@/lib/progress';
import { guides } from '@/lib/guides';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { GuideProgress } from '@/lib/progress';

type ProgressStore = Record<string, GuideProgress>;

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressStore>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getAllProgressRemote().then(setProgress);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  const completedCourses = guides.filter(
    (g) => progress[g.slug]?.percentComplete === 100
  );
  const remainingCourses = guides.filter(
    (g) => !progress[g.slug] || progress[g.slug].percentComplete < 100
  );

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown';

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  async function handleReset() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      await resetAllProgressRemote();
      resetAllProgress();
      setProgress({});
    }
  }

  function formatDate(timestamp: number | null | undefined) {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-text">Account</h1>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            {user.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text">{user.email}</p>
            <p className="text-sm text-text-muted">Member since {memberSince}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-error hover:text-error"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Completed Courses */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-text">
          Completed Courses ({completedCourses.length})
        </h2>
        {completedCourses.length === 0 ? (
          <p className="text-sm text-text-muted">No courses completed yet.</p>
        ) : (
          <div className="space-y-2">
            {completedCourses.map((guide) => (
              <div
                key={guide.slug}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
              >
                <div>
                  <p className="font-medium text-text">{guide.title}</p>
                  <p className="text-xs text-text-muted">
                    Completed {formatDate(progress[guide.slug]?.completedAt)}
                  </p>
                </div>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  Complete
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remaining Courses */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-text">
          Remaining Courses ({remainingCourses.length})
        </h2>
        <div className="space-y-2">
          {remainingCourses.map((guide) => {
            const p = progress[guide.slug];
            const percent = p?.percentComplete ?? 0;
            return (
              <div
                key={guide.slug}
                className="rounded-lg border border-border bg-surface px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-text">{guide.title}</p>
                  <span className="text-xs text-text-muted">{percent}%</span>
                </div>
                {percent > 0 && (
                  <div className="mt-2">
                    <ProgressBar value={percent} size="sm" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress */}
      <div className="rounded-xl border border-error/20 bg-error/5 p-6">
        <h2 className="mb-2 text-lg font-bold text-text">Reset Progress</h2>
        <p className="mb-4 text-sm text-text-muted">
          This will permanently clear all your course progress. This action cannot be undone.
        </p>
        <button
          onClick={handleReset}
          className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
}
