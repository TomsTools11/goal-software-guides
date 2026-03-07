'use client';

import Link from 'next/link';
import { guides } from '@/lib/guides';
import type { GuideMetadata } from '@/lib/guides';

interface GuideNavigationProps {
  currentSlug: string;
}

export function GuideNavigation({ currentSlug }: GuideNavigationProps) {
  const currentGuide = guides.find((g) => g.slug === currentSlug);
  if (!currentGuide) return null;

  // Navigate within same category
  const sameCategory = guides.filter((g) =>
    g.categories.some((c) => currentGuide.categories.includes(c))
  );
  const currentIndex = sameCategory.findIndex((g) => g.slug === currentSlug);
  const prev: GuideMetadata | undefined = sameCategory[currentIndex - 1];
  const next: GuideMetadata | undefined = sameCategory[currentIndex + 1];

  if (!prev && !next) return null;

  return (
    <nav className="mt-12 flex items-stretch gap-4 border-t border-border pt-8" aria-label="Guide navigation">
      {prev ? (
        <Link
          href={`/guides/${prev.slug}`}
          className="flex flex-1 flex-col items-start rounded-lg border border-border p-4 transition-colors hover:bg-background-soft"
        >
          <span className="text-xs text-text-muted">Previous</span>
          <span className="mt-1 text-sm font-semibold text-primary">{prev.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/guides/${next.slug}`}
          className="flex flex-1 flex-col items-end rounded-lg border border-border p-4 text-right transition-colors hover:bg-background-soft"
        >
          <span className="text-xs text-text-muted">Next</span>
          <span className="mt-1 text-sm font-semibold text-primary">{next.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
