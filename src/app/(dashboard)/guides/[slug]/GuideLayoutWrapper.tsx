'use client';

import { GuideLayout } from '@/components/guide/GuideLayout';
import type { GuideMetadata } from '@/lib/guides';

interface Props {
  guide: GuideMetadata;
  children: React.ReactNode;
}

export function GuideLayoutWrapper({ guide, children }: Props) {
  return <GuideLayout guide={guide}>{children}</GuideLayout>;
}
